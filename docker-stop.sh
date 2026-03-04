#!/bin/bash

set -e

echo "🛑 Stopping Todo Application..."

# Stop containers
echo "Stopping containers..."
docker stop todo-web todo-api todo-db 2>/dev/null || true

# Remove containers
echo "Removing containers..."
docker rm todo-web todo-api todo-db 2>/dev/null || true

# Remove network
echo "Removing network..."
docker network rm todo-network 2>/dev/null || true

echo "✅ All services stopped and cleaned up!"
