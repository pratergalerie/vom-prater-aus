#!/bin/sh

# Wait for Supabase services to be ready
echo "Waiting for Supabase services to be ready..."
sleep 10

# Install dependencies
echo "Installing dependencies..."
npm install

# Run the bucket creation script
echo "Creating storage bucket..."
npm run create-bucket

echo "Storage bucket setup completed!" 