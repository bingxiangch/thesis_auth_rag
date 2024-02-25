from typing import Literal

from fastapi import APIRouter, Depends, Request
from pydantic import BaseModel, Field

from auth_RAG.schemas.schema import ContextFilter
from auth_RAG.services.chunks_service import Chunk, ChunksService

chunks_router = APIRouter(prefix="/v1")

class Source(BaseModel):
    file: str
    page: str
    text: str

    class Config:
        frozen = True

    @staticmethod
    def curate_sources(sources: list[Chunk]) -> set["Source"]:
        curated_sources = set()

        for chunk in sources:
            doc_metadata = chunk.document.doc_metadata

            file_name = doc_metadata.get("file_name", "-") if doc_metadata else "-"
            page_label = doc_metadata.get("page_label", "-") if doc_metadata else "-"

            source = Source(file=file_name, page=page_label, text=chunk.text)
            curated_sources.add(source)

        return curated_sources
    
class ChunksBody(BaseModel):
    text: str = Field(examples=["prompt"])

class ChunksResponse(BaseModel):
    object: Literal["list"]
    model: Literal["authr-RAG"]
    data: list[Chunk]


@chunks_router.post("/chunks", tags=["Context Chunks"])
def chunks_retrieval(request: Request, body: ChunksBody) -> list[Source]:
    """Given a `text`, returns the most relevant chunks from the ingested documents.
    """
    service = request.state.injector.get(ChunksService)
    results = service.retrieve_relevant(
        text=body.text, limit=6, prev_next_chunks=0
    )
    sources = Source.curate_sources(results)

    # return ChunksResponse(
    #     object="list",
    #     model="authr-RAG",
    #     data=results,
    # )

    return sources

@chunks_router.post("/most_relevant_chunk", tags=["Context Chunks"])
def most_relevant_chunk(request: Request, body: ChunksBody):
    """Given a `text`, returns the most relevant chunks from the ingested documents.
    """
    service = request.state.injector.get(ChunksService)
    results = service.retrieve_most_relevant(
        body.text
    )
    return results