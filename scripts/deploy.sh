#!/bin/bash

# Generate Nginx configuration
./scripts/generate-nginx-conf.sh

# Start production services
docker compose --profile prod up -d