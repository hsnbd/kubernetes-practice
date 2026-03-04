#!/bin/bash

set -e

echo "🐳 Starting Todo Application with Docker..."

# Create network if it doesn't exist
if ! docker network inspect todo-network >/dev/null 2>&1; then
    echo "📡 Creating Docker network..."
    docker network create todo-network
fi

# Stop and remove existing containers if they exist
echo "🧹 Cleaning up existing containers..."
docker rm -f todo-db todo-api todo-web 2>/dev/null || true

# Run PostgreSQL database
echo "🗄️  Starting PostgreSQL database..."
docker run -d \
    --name todo-db \
    --network todo-network \
    -e POSTGRES_DB=tododb \
    -e POSTGRES_USER=postgres \
    -e POSTGRES_PASSWORD=postgres \
    todo-db:latest

echo "⏳ Waiting for database to be ready..."
sleep 5

# Run API server
echo "🚀 Starting API server..."
docker run -d \
    --name todo-api \
    --network todo-network \
    -e DATABASE_URL="postgres://postgres:postgres@todo-db:5432/tododb?sslmode=disable" \
    -e JWT_SECRET="my-super-secret-jwt-key-change-in-production" \
    -e JWT_EXPIRATION_HOURS="24" \
    -e GIN_MODE="release" \
    -e LOG_LEVEL="info" \
    -e PORT="8080" \
    -e CORS_ORIGINS="*" \
    -p 8080:8080 \
    todo-api:latest

echo "⏳ Waiting for API to be ready..."
sleep 3

# Run frontend web server
echo "🌐 Starting frontend web server..."
docker run -d \
    --name todo-web \
    --network todo-network \
    -p 3000:80 \
    todo-web:latest

echo ""
echo "✅ All services started successfully!"
echo ""
echo "📍 Access points:"
echo "   Frontend:  http://localhost:3000"
echo "   API:       http://localhost:8080"
echo "   Database:  (internal only, accessible via Docker network)"
echo ""
echo "📊 View logs:"
echo "   docker logs -f todo-db"
echo "   docker logs -f todo-api"
echo "   docker logs -f todo-web"
echo ""
echo "🛑 Stop all services:"
echo "   ./docker-stop.sh"
echo ""
