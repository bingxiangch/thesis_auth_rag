import abc
import itertools
import logging
import multiprocessing
import multiprocessing.pool
import os
import threading
from pathlib import Path
from typing import Any

from llama_index import (
    Document,
    ServiceContext,
    StorageContext,
    VectorStoreIndex,
    load_index_from_storage,
)
from llama_index.data_structs import IndexDict
from llama_index.indices.base import BaseIndex
from llama_index.ingestion import run_transformations

from auth_RAG.components.ingest.ingest_helper import IngestionHelper
from auth_RAG.paths import local_data_path
from auth_RAG.settings.settings import Settings

logger = logging.getLogger(__name__)


class BaseIngestComponent(abc.ABC):
    def __init__(
        self,
        storage_context: StorageContext,
        service_context: ServiceContext,
        *args: Any,
        **kwargs: Any,
    ) -> None:
        logger.debug("Initializing base ingest component type=%s", type(self).__name__)
        self.storage_context = storage_context
        self.service_context = service_context

    @abc.abstractmethod
    def ingest(self, file_name: str, file_data: Path) -> list[Document]:
        pass

    @abc.abstractmethod
    def bulk_ingest(self, files: list[tuple[str, Path]]) -> list[Document]:
        pass

    @abc.abstractmethod
    def delete(self, doc_id: str) -> None:
        pass


class BaseIngestComponentWithIndex(BaseIngestComponent, abc.ABC):
    def __init__(
        self,
        storage_context: StorageContext,
        service_context: ServiceContext,
        *args: Any,
        **kwargs: Any,
    ) -> None:
        super().__init__(storage_context, service_context, *args, **kwargs)

        self.show_progress = True
        self._index_thread_lock = (
            threading.Lock()
        )  # Thread lock! Not Multiprocessing lock
        self._index = self._initialize_index()

    def _initialize_index(self) -> BaseIndex[IndexDict]:
        """Initialize the index from the storage context."""
        try:
            # Load the index with store_nodes_override=True to be able to delete them
            index = load_index_from_storage(
                storage_context=self.storage_context,
                service_context=self.service_context,
                store_nodes_override=True,  # Force store nodes in index and document stores
                show_progress=self.show_progress,
            )
        except ValueError:
            # There are no index in the storage context, creating a new one
            logger.info("Creating a new vector store index")
            index = VectorStoreIndex.from_documents(
                [],
                storage_context=self.storage_context,
                service_context=self.service_context,
                store_nodes_override=True,  # Force store nodes in index and document stores
                show_progress=self.show_progress,
            )
            index.storage_context.persist(persist_dir=local_data_path)
        return index

    def _save_index(self) -> None:
        self._index.storage_context.persist(persist_dir=local_data_path)

    def delete(self, doc_id: str) -> None:
        with self._index_thread_lock:
            # Delete the document from the index
            self._index.delete_ref_doc(doc_id, delete_from_docstore=True)

            # Save the index
            self._save_index()


class SimpleIngestComponent(BaseIngestComponentWithIndex):
    def __init__(
        self,
        storage_context: StorageContext,
        service_context: ServiceContext,
        *args: Any,
        **kwargs: Any,
    ) -> None:
        super().__init__(storage_context, service_context, *args, **kwargs)

    def ingest(self, file_name: str, file_data: Path) -> list[Document]:
        logger.info("Ingesting file_name=%s", file_name)
        documents = IngestionHelper.transform_file_into_documents(file_name, file_data)
        logger.info(
            "Transformed file=%s into count=%s documents", file_name, len(documents)
        )
        logger.debug("Saving the documents in the index and doc store")
        return self._save_docs(documents)

    def bulk_ingest(self, files: list[tuple[str, Path]]) -> list[Document]:
        saved_documents = []
        for file_name, file_data in files:
            documents = IngestionHelper.transform_file_into_documents(
                file_name, file_data
            )
            saved_documents.extend(self._save_docs(documents))
        return saved_documents

    def _save_docs(self, documents: list[Document]) -> list[Document]:
        logger.debug("Transforming count=%s documents into nodes", len(documents))
        with self._index_thread_lock:
            # for document in documents:
            #     self._index.insert(document, show_progress=True)
            refreshed_docs = self._index.refresh_ref_docs(documents, update_kwargs={"update_kwargs": {'delete_from_docstore': True}})
            print(refreshed_docs)
            print('Number of newly inserted/refreshed docs: ', sum(refreshed_docs))
            logger.debug("Persisting the index and nodes")
            # persist the index and nodes
            self._save_index()
            logger.debug("Persisted the index and nodes")
        return documents




def get_ingestion_component(
    storage_context: StorageContext,
    service_context: ServiceContext,
    settings: Settings,
) -> BaseIngestComponent:
    """Get the ingestion component for the given configuration."""
    ingest_mode = settings.embedding.ingest_mode

    return SimpleIngestComponent(storage_context, service_context)
