# Supabase Migrations

This directory contains database migrations for the VomPraterAus project.

## Directory Structure

- `migrations/`: Contains SQL migration files that are executed in order based on their timestamp prefix
- `seed.sql`: Contains seed data that is executed after all migrations have been applied

## How Migrations Work

The migrations are automatically applied when the Supabase containers are started. The migration files are executed in alphabetical order, which is why we prefix them with timestamps.

## Adding New Migrations

To add a new migration:

1. Create a new SQL file in the `migrations/` directory with a timestamp prefix that is later than the existing migrations
2. Write your SQL statements in the file
3. Restart the Supabase containers to apply the migration

Example:

```
20240101000003_add_new_table.sql
```

## Adding Seed Data

To add seed data:

1. Edit the `seed.sql` file
2. Add your INSERT statements
3. Restart the Supabase containers to apply the seed data

## Troubleshooting

If you encounter issues with migrations:

1. Check the logs of the `db` container for error messages
2. Make sure your SQL syntax is correct
3. Ensure that tables referenced in foreign keys exist before they are referenced
4. Check that the user executing the migrations has the necessary permissions
