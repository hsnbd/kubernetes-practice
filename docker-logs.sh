#!/bin/bash

# View logs for all services
echo "📊 Viewing logs for all services..."
echo "Press Ctrl+C to exit"
echo ""

docker logs -f todo-db &
docker logs -f todo-api &
docker logs -f todo-web &

wait
