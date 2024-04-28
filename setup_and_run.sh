#!/bin/bash

# Check if access_token argument is provided
if [ -z "$1" ]; then
    echo "Error: access_token argument is missing."
    exit 1
fi

# Set the access token
access_token=$1

# Check if backend/settings.yaml exists
if [ ! -f "backend/settings.yaml" ]; then
    echo "Error: backend/settings.yaml does not exist."
    exit 1
fi

# Update access_token in backend/settings.yaml
sed -i "s/^ *access_token: .*$/  access_token: $access_token/" backend/settings.yaml




# Backend setup
cd backend && python3.11 -m venv .venv && source .venv/bin/activate && \
pip install --upgrade pip poetry && poetry install --with local && poetry install --extras chroma && ./scripts/setup

# Launch the server
poetry run python3.11 -m auth_RAG &

# Frontend setup
cd ../frontend && npm install

# Start the frontend server
npm start
