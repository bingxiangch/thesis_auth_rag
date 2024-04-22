#!/bin/bash

# Backend setup
cd backend && export PYTHONPATH="${PYTHONPATH}:$(pwd)" && python3.11 -m venv .venv && source .venv/bin/activate && \
pip install --upgrade pip poetry && poetry install --with local && poetry install --extras chroma && ./scripts/setup

CMAKE_ARGS='-DLLAMA_CUBLAS=on' poetry run pip install --force-reinstall --no-cache-dir llama-cpp-python

# Launch the server
poetry run python3.11 -m auth_RAG &

# Frontend setup
cd ../frontend && npm install

# Start the frontend server
npm start
