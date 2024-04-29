#!/bin/bash

# Backend setup
cd backend && python3.11 -m venv .venv && source .venv/bin/activate && \
pip install --upgrade pip poetry && poetry install --with local && poetry install --extras chroma && ./scripts/setup.py

# Launch the server
poetry run python3.11 -m auth_RAG &

# Frontend setup
cd ../frontend && npm install

# Start the frontend server
npm start
