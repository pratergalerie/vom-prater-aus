# Database Setup for Self-Hosted Supabase

This directory contains SQL scripts and initialization scripts for setting up the database schema and tables for a self-hosted Supabase instance.

## Files

- `initial_schema.sql`: Creates the database schema and tables
- `initial_data.sql`: Inserts initial data into the tables
- `indexes_and_triggers.sql`: Creates indexes and triggers for the tables
- `init-db.sh`: Script that checks if the tables exist and only runs the SQL scripts if they don't
- `custom-entrypoint.sh`: Custom entrypoint script that runs the initialization script after the PostgreSQL container starts

## How It Works

The solution uses a custom entrypoint script (`custom-entrypoint.sh`) that:

1. Runs the original PostgreSQL entrypoint script in the background
2. Waits for PostgreSQL to be ready
3. Runs our custom initialization script (`init-db.sh`)

The initialization script (`init-db.sh`):

1. Checks if the tables already exist
2. If they don't exist, runs the SQL scripts to create the schema, insert data, and create indexes and triggers

## Usage

These scripts are automatically used by the Docker Compose configuration in the root directory. The `docker-compose.yml` file mounts these scripts to the PostgreSQL container and uses the custom entrypoint script.

## Modifying the Schema

If you need to modify the database schema, you can:

1. Update the SQL scripts in this directory
2. Restart the Docker containers with `docker-compose down` and `docker-compose up -d`

The initialization script will only run the SQL scripts if the tables don't already exist, so your data will be preserved.
