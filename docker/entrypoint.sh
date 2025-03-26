#!/bin/bash
# Entrypoint script

# You can add any logic here (e.g., waiting for the backend to be ready)

echo "Starting frontend..."
exec npm start  # This will run `npm start` to launch the Next.js app