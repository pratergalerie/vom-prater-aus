#!/bin/bash

# Exit on error
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" >&2
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Load environment variables
load_env() {
    if [ -f .env ]; then
        set -a
        source .env
        set +a
    else
        error ".env file not found"
        exit 1
    fi
}

# Check if domain is configured
check_domain() {
    if [ -z "$DOMAIN" ]; then
        error "DOMAIN not configured in .env file"
        exit 1
    fi
}

# Check if containers are running
check_containers() {
    if ! docker compose -f docker-compose.yml --profile prod ps nginx | grep -q "Up"; then
        error "Nginx container is not running. Please start the application first."
        exit 1
    fi
}

# Renew SSL certificate
renew_certificate() {
    log "Starting SSL certificate renewal for $DOMAIN..."
    
    # Attempt renewal
    if docker compose -f docker-compose.yml --profile prod run --rm certbot \
        renew --non-interactive --quiet --no-random-sleep-on-renew; then
        
        success "Certificate renewal completed successfully"
        
        # Reload nginx to use new certificates
        log "Reloading nginx to use new certificates..."
        docker compose -f docker-compose.yml --profile prod exec nginx nginx -s reload
        
        success "Nginx reloaded with new certificates"
        
        # Show certificate status
        log "Certificate status:"
        docker compose -f docker-compose.yml --profile prod run --rm certbot \
            certificates --cert-name "$DOMAIN"
    else
        warning "Certificate renewal failed or no renewal was needed"
    fi
}

# Main function
main() {
    log "🔒 Starting SSL certificate renewal process..."
    
    load_env
    check_domain
    check_containers
    renew_certificate
    
    success "🎉 SSL certificate renewal process completed!"
}

# Run main function
main "$@" 