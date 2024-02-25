from pydantic import BaseModel, Field


class ContextFilter(BaseModel):
    docs_ids: list[str] | None = Field(
        examples=[["doc_id_1", "doc_id_2", "doc_id_3"]]
    )
