from fastapi import APIRouter, Depends, Request
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi import Depends, FastAPI, HTTPException, status, Security
from auth_RAG.utils.auth import decode_access_token
from auth_RAG.models.models import User    
from pydantic import BaseModel, Field
from starlette.responses import StreamingResponse
from typing import Literal
from auth_RAG.schemas.schema import ContextFilter
from fastapi import APIRouter, Depends, HTTPException, Request, UploadFile
from sqlalchemy.orm import Session
from auth_RAG.models.models import File, FileDoc
from auth_RAG.services.chat_service import ChatService
from auth_RAG.db.session import get_db
from auth_RAG.services.chunks_service import Chunk, ChunksService
from collections import OrderedDict
from auth_RAG.settings.settings import settings
chat_router = APIRouter(prefix="/v1")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    token_data = decode_access_token(token)

    if token_data is None:
        raise credentials_exception
    user = db.query(User).filter(User.username == token_data.get("sub")).first()
    if user is None:
        raise credentials_exception

    return user

def get_accessible_doc_ids(session: Session, user: User, doc_ids: list) -> list:
    # Query the database to get all relevant FileDoc records
    query_result = (
        session.query(FileDoc.doc_id)
        .join(File, File.id == FileDoc.file_id)
        .filter(FileDoc.doc_id.in_(doc_ids), File.access_level == user.access_level)
        .all()
    )

    # Extract the doc_ids from the query result
    accessible_doc_ids = [result[0] for result in query_result]

    return accessible_doc_ids


def has_access_to_doc(session: Session, user: User, doc_id: str) -> bool:
    # Query the database to check if the user has access to the given doc_id
    query_result = (
        session.query(FileDoc)
        .join(File, File.id == FileDoc.file_id)
        .filter(FileDoc.doc_id == doc_id, File.access_level == user.access_level)
        .first()
    )
    return query_result is not None
def get_access_level(session: Session, user: User, doc_id: str) -> int:
    # Query the database to get the access level for the given doc_id
    query_result = (
        session.query(File.access_level)
        .join(FileDoc, File.id == FileDoc.file_id)
        .filter(FileDoc.doc_id == doc_id)
        .first()
    )

    return query_result[0] if query_result else None

def get_username_by_access_level(session: Session, access_level: int) -> str:
    # Query the database to get the username based on the access level
    user = session.query(User).filter(User.access_level == access_level).first()

    return user.username if user else None

class Message(BaseModel):
    """Inference result, with the source of the message.

    Role could be the assistant or system
    (providing a default response, not AI generated).
    """

    role: Literal["assistant", "system", "user"] = Field(default="user")
    content: str | None

class CompletionsBody(BaseModel):
    prompt: str
    system_prompt: str | None = None
    use_context: bool = False
    context_filter: ContextFilter | None = None
    include_sources: bool = True
    stream: bool = False

    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "prompt": "prompt",
                    "include_sources": False,
                }
            ]
        }
    }


@chat_router.post(
    "/chat",
    response_model=None,
    summary="chat",
    tags=["chat"],
)
def prompt_completion(
    request: Request, body: CompletionsBody, current_user: User = Security(get_current_user), db: Session = Depends(get_db)
):
    """
    , current_user: User = Security(get_current_user)
    Given a prompt, the model will return one predicted completion.

    When using `'include_sources': true`, the API will return the source Chunks used
    to create the response, which come from the context provided.
    ```
    """


    chunks_service = request.state.injector.get(ChunksService)
    relevant_chunks = chunks_service.retrieve_relevant(
        text=body.prompt, limit=6, prev_next_chunks=0
    )
    filtered_chunks = [chunk for chunk in relevant_chunks if getattr(chunk, 'score', 0) > 0.45]

    # Extract unique doc_ids
    doc_id_set_ordered = list(OrderedDict.fromkeys(chunk.document.doc_id for chunk in filtered_chunks))
    ## unit select in database.

    accessible_doc_ids = get_accessible_doc_ids(db, current_user, doc_id_set_ordered)
    unaccessible_doc_ids = [doc_id for doc_id in doc_id_set_ordered if doc_id not in accessible_doc_ids]
    default_system_prompt = settings().system_prompt.default_query_system_prompt
    # Check if there are unaccessible documents before trying to access the first one
    if unaccessible_doc_ids:
        # Get the access level of the first unaccessible document
        access_level_of_first_doc = get_access_level(db, current_user, unaccessible_doc_ids[0])
        username = get_username_by_access_level(db, access_level_of_first_doc)
        # Additional information to be appended
        additional_info = f"Additionally, clearly state that the user can ask {username} who has permission {access_level_of_first_doc} for help if the information is not within the current context."
        # Append the additional information to the system prompt
        default_system_prompt += additional_info
    messages = [Message(content=body.prompt, role="user")]
    # If system prompt is passed, create a fake message with the system prompt.
    if body.system_prompt:
        messages.insert(0, Message(content=body.system_prompt, role="system"))
    else:
        messages.insert(0, Message(content=default_system_prompt, role="system"))

    service = request.state.injector.get(ChatService)
    
    docs_filter = ContextFilter(docs_ids = accessible_doc_ids)

    completion = service.chat(
        messages=messages,
        use_context=True,
        context_filter=docs_filter,
    )
    # # Check if the current user has access to the first doc_id and generate advisor info
    # if access_level_of_first_doc is not None and access_level_of_first_doc != current_user.access_level:
    #     completion.response = completion.response + " You can contact users with access level " + str(access_level_of_first_doc) + " for help or get more accurate answer."

    return {
        "response": completion.response,
        "sources": completion.sources if body.include_sources else None
    }

