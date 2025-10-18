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

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
check_prerequisites() {
    log "Checking prerequisites..."
    
    if ! command_exists docker; then
        error "Docker is not installed"
        exit 1
    fi
    
    # Check if docker compose is available (newer syntax)
    if ! docker compose version >/dev/null 2>&1; then
        error "Docker Compose is not available. Please ensure Docker Compose is installed."
        exit 1
    fi
    
    if ! command_exists git; then
        error "Git is not installed"
        exit 1
    fi
    
    success "All prerequisites are met"
}

# Check if .env file exists
check_env_file() {
    log "Checking environment configuration..."
    
    if [ ! -f .env ]; then
        error ".env file not found!"
        echo "Please create a .env file with the necessary environment variables."
        exit 1
    fi
    
    success "Environment file found"
}

# Load environment variables
load_env() {
    log "Loading environment variables..."
    set -a
    source .env
    set +a
    success "Environment variables loaded"
}

# Backup current state
backup_current_state() {
    log "Creating backup of current state..."
    
    # Create backup directory with timestamp
    BACKUP_DIR="backups/$(date +'%Y%m%d_%H%M%S')"
    mkdir -p "$BACKUP_DIR"
    
    # Save current git commit hash
    git rev-parse HEAD > "$BACKUP_DIR/commit_hash.txt" 2>/dev/null || true
    
    # Save docker compose logs
    docker compose -f docker-compose.yml --profile prod logs > "$BACKUP_DIR/docker_logs.txt" 2>/dev/null || true
    
    success "Backup created in $BACKUP_DIR"
}

# Pull latest changes
pull_changes() {
    log "Pulling latest changes from repository..."
    
    # Check if we're in a git repository
    if [ ! -d .git ]; then
        error "Not in a git repository"
        exit 1
    fi
    
    # Fetch latest changes
    git fetch origin
    
    # Get current branch
    CURRENT_BRANCH=$(git branch --show-current)
    
    # Check if we're on main branch
    if [ "$CURRENT_BRANCH" != "main" ]; then
        warning "Not on main branch (currently on $CURRENT_BRANCH)"
        read -p "Do you want to continue anyway? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            log "Deployment cancelled"
            exit 0
        fi
    fi
    
    # Pull changes
    git pull origin main
    
    success "Latest changes pulled successfully"
}

# Stop containers
stop_containers() {
    log "Stopping all containers..."
    
    docker compose -f docker-compose.yml --profile prod down
    
    success "All containers stopped"
}

# Pull latest images
pull_images() {
    log "Pulling latest Docker images..."
    
    docker compose -f docker-compose.yml --profile prod pull
    
    success "Latest images pulled"
}

# Build latest strapi image


# Start application
start_application() {
    log "Starting application..."
    
    # Create necessary directories for SSL certificates
    mkdir -p nginx/ssl
    mkdir -p nginx/www/.well-known/acme-challenge
    
    # Start the application
    docker compose -f docker-compose.yml --profile prod up -d
    
    success "Application started"
}

# Wait for services to be healthy
wait_for_services() {
    log "Waiting for services to be healthy..."
    
    # Wait for database to be ready - much more efficient approach
    log "Waiting for database..."
    DB_READY=false
    for i in {1..30}; do  # Reduced from 60 to 30 attempts
        if docker compose -f docker-compose.yml --profile prod logs db | tail -20 | grep -q "database system is ready to accept connections"; then
            DB_READY=true
            break
        fi
        sleep 1  # Reduced from 2s to 1s
    done
    
    if [ "$DB_READY" = false ]; then
        warning "Database ready check timed out, but continuing..."
    else
        success "Database is ready"
    fi
    
    # Reduced wait time
    log "Ensuring database is fully ready..."
    sleep 5  # Reduced from 10s to 5s
    
    # Wait for Nuxt app
    log "Waiting for Nuxt application..."
    timeout 180 bash -c 'until curl -s -f http://localhost:3000 > /dev/null; do sleep 5; done' || {
        error "Nuxt application failed to start within timeout"
        return 1
    }
    
    success "All services are healthy"
}

# Setup SSL certificate (if needed)
setup_ssl() {
    log "Checking SSL certificate..."
    
    if [ -n "$DOMAIN" ]; then
        if [ ! -d "/etc/letsencrypt/live/$DOMAIN" ]; then
            log "Setting up SSL certificate for $DOMAIN..."
            
            docker compose -f docker-compose.yml --profile prod run --rm certbot \
                certonly --webroot \
                --webroot-path=/var/www/html \
                --email "$ADMIN_EMAIL" \
                --agree-tos \
                --no-eff-email \
                --non-interactive \
                -d "$DOMAIN" || {
                warning "SSL certificate setup failed, continuing without SSL"
            }
        else
            log "SSL certificate exists for $DOMAIN, checking for renewal..."
            
            # Always attempt renewal - certbot will only renew if needed
            docker compose -f docker-compose.yml --profile prod run --rm certbot \
                renew --non-interactive --quiet --no-random-sleep-on-renew || {
                log "Certificate renewal check completed"
            }
            
            # Check if renewal actually happened
            if docker compose -f docker-compose.yml --profile prod run --rm certbot \
                certificates --cert-name "$DOMAIN" | grep -q "VALID:"; then
                log "Certificate status checked"
            fi
        fi
    else
        log "No domain configured for SSL certificate"
    fi
}

# Cleanup
cleanup() {
    log "Cleaning up unused Docker resources..."
    
    # Remove unused images
    docker image prune -f
    
    # Remove unused volumes (be careful with this)
    # docker volume prune -f
    
    # Remove unused networks
    docker network prune -f
    
    success "Cleanup completed"
}

# Health check
health_check() {
    log "Performing health check..."
    
    # Check if main services are responding
    if curl -s -f http://localhost:3000 > /dev/null 2>&1; then
        success "Application is responding"
    else
        error "Application is not responding"
        return 1
    fi
    
    # Check if database is running
    if docker compose -f docker-compose.yml --profile prod ps db | grep -q "Up"; then
        success "Database is running"
    else
        error "Database is not running"
        return 1
    fi
}

# Main deployment function
main() {
    log "🚀 Starting automated deployment process..."
    
    check_prerequisites
    check_env_file
    load_env
    backup_current_state
    pull_changes
    stop_containers
    pull_images
    start_application
    # wait_for_services
    setup_ssl
    cleanup
    health_check
    
    success "🎉 Deployment completed successfully!"
    
    # Show running containers
    log "Running containers:"
    docker compose -f docker-compose.yml --profile prod ps
}

# Run main function
main "$@" 