#!/bin/bash

# Create backup directory if it doesn't exist
BACKUP_DIR="backups/$(date +%Y-%m)"
mkdir -p "$BACKUP_DIR"

# Generate backup filename with timestamp
BACKUP_FILE="$BACKUP_DIR/backup_$(date +%Y%m%d_%H%M%S).sql"

# Get database password from environment file
source .env

# Perform the backup
docker exec supabase-db pg_dump -U postgres -d postgres > "$BACKUP_FILE"

# Compress the backup
gzip "$BACKUP_FILE"

# Keep only last 30 days of backups
find backups -type f -name "*.sql.gz" -mtime +30 -delete

echo "Backup completed: ${BACKUP_FILE}.gz" 