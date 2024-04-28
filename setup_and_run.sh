#!/bin/bash

# Function to write values to config.yaml
write_to_yaml() {
    cat <<EOF >backend/setting.yaml
access_token: $hf_token
EOF
}
# Check if hf_token argument is provided
if [ -z "$1" ]; then
    echo "Error: hf_token argument is missing."
    exit 1
else
    hf_token=$1
fi

# Backend setup
cd backend && python3.11 -m venv .venv && source .venv/bin/activate && \
pip install --upgrade pip poetry && poetry install --with local && poetry install --extras chroma && ./scripts/setup

# Launch the server
poetry run python3.11 -m auth_RAG &

# Frontend setup
cd ../frontend && npm install

# Start the frontend server
npm start
