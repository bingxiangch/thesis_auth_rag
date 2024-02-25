"""FastAPI app creation, logger configuration and main API routes."""

import llama_index

from auth_RAG.di import global_injector
from auth_RAG.launcher import create_app

# Add LlamaIndex simple observability
llama_index.set_global_handler("simple")

app = create_app(global_injector)
