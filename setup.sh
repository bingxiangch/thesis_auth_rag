#!/bin/bash

# Backend setup
cd backend && python3.11 -m venv .venv && source .venv/bin/activate

# Launch the server
poetry run python3.11 -m auth_RAG &

# Frontend setup
cd ../frontend

# Start the frontend server
npm start