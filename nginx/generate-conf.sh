#!/bin/bash

# Load environment variables from .env file if it exists
if [ -f ../.env ]; then
    export $(cat ../.env | grep -v '^#' | xargs)
fi

# Ensure DOMAIN is set
if [ -z "$DOMAIN" ]; then
    echo "Error: DOMAIN environment variable is not set"
    exit 1
fi

# Generate app.conf from template
envsubst '${DOMAIN}' < conf/app.conf.template > conf/app.conf

echo "Generated conf/app.conf for domain: $DOMAIN"