#!/bin/bash

# Check if llm_mode argument is provided
if [ -z "$1" ]; then
    echo "Error: llm_mode argument is missing."
    exit 1
fi

# Set the llm_mode
llm_mode=$1

# Update llm_mode in backend/settings.yaml
sed -i'.bak' '/^llm:/,/^[^ ]/ s/mode:.*/mode: '"$llm_mode"'/' backend/settings.yaml

# If api_key argument is provided, update access_token under the local section in backend/settings.yaml
if [ -n "$2" ]; then
    # Set the access_token
    access_token=$2
    sed -i'.bak' '/^openai:/,/^[^ ]/ s/api_key:.*/api_key: '"$access_token"'/' backend/settings.yaml
fi
