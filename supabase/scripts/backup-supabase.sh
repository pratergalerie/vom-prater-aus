#!/bin/bash

# Comprehensive Supabase Backup Script
# This script backs up both the database and storage data
# Can be run as a cronjob

set -euo pipefail

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
BACKUP_ROOT="${PROJECT_ROOT}/../backups"
DATE=$(date +%Y-%m-%d_%H%M%S)
BACKUP_DIR="${BACKUP_ROOT}/${DATE}"
LOG_FILE="${BACKUP_DIR}/backup.log"

# Create backup directory structure immediately
mkdir -p "$BACKUP_DIR"
mkdir -p "${BACKUP_DIR}/database"
mkdir -p "${BACKUP_DIR}/storage"
mkdir -p "${BACKUP_DIR}/metadata"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "$LOG_FILE"
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING:${NC} $1" | tee -a "$LOG_FILE"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR:${NC} $1" | tee -a "$LOG_FILE"
}

# Function to check if Docker containers are running
check_containers() {
    log "Checking if required containers are running..."
    
    local containers=("supabase-db" "supabase-minio" "supabase-storage")
    local missing_containers=()
    
    for container in "${containers[@]}"; do
        if ! docker ps --format "{{.Names}}" | grep -q "^${container}$"; then
            missing_containers+=("$container")
        fi
    done
    
    if [ ${#missing_containers[@]} -gt 0 ]; then
        error "The following containers are not running: ${missing_containers[*]}"
        error "Please start the Supabase services first: docker-compose up -d"
        exit 1
    fi
    
    log "All required containers are running"
}

# Function to create backup directory (now just logs since directory is already created)
create_backup_dir() {
    log "Backup directory created: $BACKUP_DIR"
}

# Function to backup database
backup_database() {
    log "Starting database backup..."
    
    local db_backup_file="${BACKUP_DIR}/database/supabase_backup_${DATE}.sql"
    
    # Get database password from environment
    if [ -f "${PROJECT_ROOT}/../.env" ]; then
        source "${PROJECT_ROOT}/../.env"
    else
        error "Environment file not found at ${PROJECT_ROOT}/../.env"
        return 1
    fi
    
    # Create database backup using pg_dump
    log "Creating PostgreSQL dump..."
    if docker exec supabase-db pg_dump -U postgres -d postgres --verbose --clean --if-exists --create > "$db_backup_file" 2>> "$LOG_FILE"; then
        log "Database backup completed: $db_backup_file"
        
        # Compress the backup
        log "Compressing database backup..."
        gzip "$db_backup_file"
        log "Database backup compressed: ${db_backup_file}.gz"
        
        # Save backup info
        echo "Database backup: ${db_backup_file}.gz" > "${BACKUP_DIR}/metadata/backup_info.txt"
        echo "Size: $(du -h "${db_backup_file}.gz" | cut -f1)" >> "${BACKUP_DIR}/metadata/backup_info.txt"
        echo "Created: $(date)" >> "${BACKUP_DIR}/metadata/backup_info.txt"
    else
        error "Database backup failed"
        return 1
    fi
}

# Function to backup storage data
backup_storage() {
    log "Starting storage backup..."
    
    local storage_backup_dir="${BACKUP_DIR}/storage"
    
    # Create a tar archive of the storage volume
    log "Creating storage volume backup..."
    if docker run --rm \
        --volumes-from supabase-minio \
        -v "${storage_backup_dir}:/backup" \
        alpine:latest \
        tar czf /backup/minio_storage_${DATE}.tar.gz -C /data .; then
        
        log "Storage backup completed: ${storage_backup_dir}/minio_storage_${DATE}.tar.gz"
        
        # Update backup info
        echo "Storage backup: ${storage_backup_dir}/minio_storage_${DATE}.tar.gz" >> "${BACKUP_DIR}/metadata/backup_info.txt"
        echo "Size: $(du -h "${storage_backup_dir}/minio_storage_${DATE}.tar.gz" | cut -f1)" >> "${BACKUP_DIR}/metadata/backup_info.txt"
    else
        error "Storage backup failed"
        return 1
    fi
}

# Function to backup storage metadata from database
backup_storage_metadata() {
    log "Backing up storage metadata from database..."
    
    local metadata_file="${BACKUP_DIR}/metadata/storage_metadata_${DATE}.sql"
    
    # Export storage-related tables
    if docker exec supabase-db pg_dump -U postgres -d postgres \
        --table=storage.objects \
        --table=storage.buckets \
        --table=storage.migrations \
        --data-only > "$metadata_file" 2>> "$LOG_FILE"; then
        
        log "Storage metadata backup completed: $metadata_file"
        
        # Compress the metadata
        gzip "$metadata_file"
        log "Storage metadata compressed: ${metadata_file}.gz"
    else
        warn "Storage metadata backup failed (this might be normal if no storage data exists)"
    fi
}

# Function to create backup manifest
create_manifest() {
    log "Creating backup manifest..."
    
    local manifest_file="${BACKUP_DIR}/manifest.json"
    
    cat > "$manifest_file" << EOF
{
  "backup_date": "$(date -Iseconds)",
  "backup_version": "1.0",
  "supabase_version": "local",
  "components": {
    "database": {
      "file": "database/supabase_backup_${DATE}.sql.gz",
      "type": "postgresql_dump"
    },
    "storage": {
      "file": "storage/minio_storage_${DATE}.tar.gz",
      "type": "minio_volume_backup"
    },
    "storage_metadata": {
      "file": "metadata/storage_metadata_${DATE}.sql.gz",
      "type": "storage_tables_dump"
    }
  },
  "restore_instructions": "See README.md for restore instructions"
}
EOF
    
    log "Backup manifest created: $manifest_file"
}

# Function to create restore instructions
create_restore_instructions() {
    log "Creating restore instructions..."
    
    local readme_file="${BACKUP_DIR}/README.md"
    
    cat > "$readme_file" << 'EOF'
# Supabase Backup - Restore Instructions

This backup contains all data from your Supabase instance including database and storage.

## Backup Contents

- `database/`: PostgreSQL database dump
- `storage/`: MinIO storage volume backup
- `metadata/`: Storage metadata and backup information

## Restore Process

### 1. Stop Supabase Services
```bash
cd /path/to/your/project
docker-compose down
```

### 2. Restore Database
```bash
# Extract the database backup
gunzip database/supabase_backup_*.sql.gz

# Restore to the database
docker exec -i supabase-db psql -U postgres -d postgres < database/supabase_backup_*.sql
```

### 3. Restore Storage
```bash
# Extract the storage backup
tar -xzf storage/minio_storage_*.tar.gz -C /path/to/supabase/volumes/storage/

# Set proper permissions
chmod -R 755 /path/to/supabase/volumes/storage/
```

### 4. Restore Storage Metadata (if needed)
```bash
# Extract and restore storage metadata
gunzip metadata/storage_metadata_*.sql.gz
docker exec -i supabase-db psql -U postgres -d postgres < metadata/storage_metadata_*.sql
```

### 5. Start Services
```bash
docker-compose up -d
```

## Verification

After restore, verify that:
1. Database tables are accessible
2. Storage buckets and objects are available
3. Application functionality is working correctly

## Notes

- This backup was created on: $(date)
- Backup version: 1.0
- Always test restores in a non-production environment first
EOF
    
    log "Restore instructions created: $readme_file"
}

# Function to cleanup old backups
cleanup_old_backups() {
    local retention_days=${BACKUP_RETENTION_DAYS:-30}
    log "Cleaning up backups older than $retention_days days..."
    
    local deleted_count=0
    while IFS= read -r -d '' backup_dir; do
        if [ -d "$backup_dir" ] && [ "$backup_dir" != "$BACKUP_DIR" ]; then
            log "Removing old backup: $backup_dir"
            rm -rf "$backup_dir"
            ((deleted_count++))
        fi
    done < <(find "$BACKUP_ROOT" -maxdepth 1 -type d -name "20*" -mtime +$retention_days -print0)
    
    if [ $deleted_count -gt 0 ]; then
        log "Cleaned up $deleted_count old backup(s)"
    else
        log "No old backups to clean up"
    fi
}

# Function to calculate backup size
calculate_backup_size() {
    local total_size=$(du -sh "$BACKUP_DIR" | cut -f1)
    log "Backup completed successfully!"
    log "Total backup size: $total_size"
    log "Backup location: $BACKUP_DIR"
}

# Main backup function
main() {
    log "Starting Supabase backup process..."
    log "Backup directory: $BACKUP_DIR"
    
    # Check if containers are running
    check_containers
    
    # Create backup directory structure
    create_backup_dir
    
    # Perform backups
    if backup_database; then
        log "Database backup successful"
    else
        error "Database backup failed"
        exit 1
    fi
    
    if backup_storage; then
        log "Storage backup successful"
    else
        error "Storage backup failed"
        exit 1
    fi
    
    backup_storage_metadata
    
    # Create manifest and instructions
    create_manifest
    create_restore_instructions
    
    # Calculate final size
    calculate_backup_size
    
    # Cleanup old backups
    cleanup_old_backups
    
    log "Backup process completed successfully!"
}

# Handle script arguments
case "${1:-}" in
    --help|-h)
        echo "Usage: $0 [OPTIONS]"
        echo ""
        echo "Options:"
        echo "  --help, -h     Show this help message"
        echo "  --retention N  Set backup retention in days (default: 30)"
        echo ""
        echo "Environment variables:"
        echo "  BACKUP_RETENTION_DAYS  Number of days to keep backups (default: 30)"
        exit 0
        ;;
    --retention)
        if [ -n "${2:-}" ] && [[ "$2" =~ ^[0-9]+$ ]]; then
            BACKUP_RETENTION_DAYS="$2"
            shift 2
        else
            error "Invalid retention value. Must be a number."
            exit 1
        fi
        ;;
esac

# Run main function
main "$@" 