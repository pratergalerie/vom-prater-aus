#!/bin/bash

# Exit on error
set -e

echo "🚀 Starting deployment process..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found!"
    echo "Please create a .env file with the necessary environment variables."
    exit 1
fi

# Load environment variables properly
while IFS= read -r line || [ -n "$line" ]; do
    # Skip comments and empty lines
    if [[ $line =~ ^[[:space:]]*# ]] || [[ -z $line ]]; then
        continue
    fi
    # Remove any surrounding quotes and export the variable
    if [[ $line =~ ^[[:space:]]*([^=]+)[[:space:]]*=[[:space:]]*(.*)[[:space:]]*$ ]]; then
        key="${BASH_REMATCH[1]}"
        value="${BASH_REMATCH[2]}"
        # Remove surrounding quotes if they exist
        value="${value#\"}"
        value="${value%\"}"
        value="${value#\'}"
        value="${value%\'}"
        export "$key=$value"
    fi
done < .env

# Pull latest changes if git is used
if [ -d .git ]; then
    echo "📥 Pulling latest changes..."
    git pull
fi

# Create necessary directories for SSL certificates
echo "📁 Creating SSL directories..."
mkdir -p nginx/ssl
mkdir -p nginx/www/.well-known/acme-challenge

# Stop any running containers
echo "🛑 Stopping running containers..."
docker compose -f docker-compose.yml --profile prod down

# Pull latest images
echo "📥 Pulling latest Docker images..."
docker compose -f docker-compose.yml --profile prod pull

# Start the application
echo "🚀 Starting application..."
docker compose -f docker-compose.yml --profile prod up -d

# Initial SSL certificate setup
if [ ! -d "/etc/letsencrypt/live/$DOMAIN" ]; then
    echo "🔒 Setting up SSL certificate..."
    docker compose -f docker-compose.yml --profile prod run --rm certbot \
        certonly --webroot \
        --webroot-path=/var/www/html \
        --email "$ADMIN_EMAIL" \
        --agree-tos \
        --no-eff-email \
        -d "$DOMAIN"
fi

echo "✅ Deployment completed successfully!" 