from typing import Literal, List

from fastapi import APIRouter, Depends, HTTPException, Request, UploadFile
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session
from auth_RAG.services.ingest_service import IngestService
from auth_RAG.services.ingest_service import IngestedDoc
from auth_RAG.db.session import get_db
from auth_RAG.models.models import File, FileDoc
ingest_router = APIRouter(prefix="/v1")


class UpdateFileData(BaseModel):
    file_name: str
    access_level: int

class IngestTextBody(BaseModel):
    file_name: str = Field(examples=["Avatar: The Last Airbender"])
    text: str = Field(
        examples=[
            "Avatar is set in an Asian and Arctic-inspired world in which some "
            "people can telekinetically manipulate one of the four elements—water, "
            "earth, fire or air—through practices known as 'bending', inspired by "
            "Chinese martial arts."
        ]
    )


class IngestResponse(BaseModel):
    object: Literal["list"]
    model: Literal["authr-RAG"]
    data: list[IngestedDoc]





@ingest_router.post("/ingest/file", tags=["Ingestion"])
def ingest_file(request: Request, file: UploadFile, db: Session = Depends(get_db)) -> IngestResponse:
    """Ingests and processes a file, storing its chunks to be used as context in vector database.

    """
    service = request.state.injector.get(IngestService)
    if file.filename is None:
        raise HTTPException(400, "No file name provided")
    ingested_documents = service.ingest_bin_data(file.filename, file.file)
    add_file_data(ingested_documents,db)
    return IngestResponse(object="list", model="authr-RAG", data=ingested_documents)

def add_file_data(data, db: Session = Depends(get_db)):
    for item in data:
        doc_metadata = item.doc_metadata
        file_name = doc_metadata.get("file_name")
        # access_level = doc_metadata.get("access_level")
        doc_id = item.doc_id

        # Check if the file already exists
        file = db.query(File).filter(File.file_name == file_name).first()
        if not file:
            # If the file doesn't exist, create a new File record
            file = File(file_name=file_name, access_level = 1)
            db.add(file)
            db.commit()
            db.refresh(file)

        # Add a new FileDoc record
        file_doc = FileDoc(file_id=file.id, doc_id=doc_id)
        db.add(file_doc)

    db.commit()

# @ingest_router.post("/ingest/text", tags=["Ingestion"])
def ingest_text(request: Request, body: IngestTextBody) -> IngestResponse:
    """Ingests and processes a text, storing its chunks to be used as context.

    The context obtained from files is later used in
    `/chat/completions`, `/completions`, and `/chunks` APIs.

    A Document will be generated with the given text. The Document
    ID is returned in the response, together with the
    extracted Metadata (which is later used to improve context retrieval). That ID
    can be used to filter the context used to create responses in
    `/chat/completions`, `/completions`, and `/chunks` APIs.
    """
    service = request.state.injector.get(IngestService)
    if len(body.file_name) == 0:
        raise HTTPException(400, "No file name provided")
    ingested_documents = service.ingest_text(body.file_name, body.text)
    return IngestResponse(object="list", model="authr-RAG", data=ingested_documents)


@ingest_router.get("/ingest/list", tags=["Ingestion"])
def list_ingested(request: Request) -> IngestResponse:
    """Lists already ingested Documents including their Document ID and metadata.
    """
    service = request.state.injector.get(IngestService)
    ingested_documents = service.list_ingested()
    return IngestResponse(object="list", model="authr-RAG", data=ingested_documents)


@ingest_router.delete("/ingest/{doc_id}", tags=["Ingestion"])
def delete_ingested(request: Request, doc_id: str) -> None:
    """Delete the specified ingested Document.

    The `doc_id` can be obtained from the `GET /ingest/list` endpoint.
    The document will be effectively deleted from your storage context.
    """
    service = request.state.injector.get(IngestService)
    service.delete(doc_id)


@ingest_router.get("/files/")
async def list_files(db: Session = Depends(get_db)):
    files = db.query(File).all()
    return files

@ingest_router.put("/files/{file_name}")
async def update_File_access_level(file_name: str, form_data: UpdateFileData, db: Session = Depends(get_db)):
    file = db.query(File).filter(File.file_name == file_name).first()

    if file:
        file.file_name = file_name
        file.access_level = form_data.access_level
        db.commit()
        db.refresh(file)
        return file
    raise HTTPException(status_code=404, detail="File not found")

@ingest_router.delete("/files/{file_name}")
async def delete_file_by_name(request: Request, file_name: str, db: Session = Depends(get_db)):
    file_to_delete = db.query(File).filter(File.file_name == file_name).first()

    if file_to_delete:
        # Get all related doc_ids
        doc_ids = [file_doc.doc_id for file_doc in file_to_delete.docs]

        # Delete related file_docs
        db.query(FileDoc).filter(FileDoc.file_id == file_to_delete.id).delete()

        # Delete the file itself
        db.delete(file_to_delete)
        db.commit()
        # Delete the specified ingested Document.
        service = request.state.injector.get(IngestService)
        for doc_id in doc_ids:
            service.delete(doc_id)


        return {"message": f"File '{file_name}' and related docs deleted successfully"}

    raise HTTPException(status_code=404, detail=f"File '{file_name}' not found")