#!/bin/bash

# Check if access_token argument is provided
if [ -z "$1" ]; then
    echo "Error: openai api key argument is missing."
    exit 1
fi

# Set the access token
access_token=$1

# Update access_token under the local section in backend/settings.yaml
sed -i'.bak' '/^openai:/,/^[^ ]/ s/api_key:.*/api_key: '"$access_token"'/' backend/settings.yaml
