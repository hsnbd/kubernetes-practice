.PHONY: help setup build-all build-db build-api build-web clean test lint

help:
	@echo "Available targets:"
	@echo "  setup      - Install dependencies for all services"
	@echo "  build-all  - Build all Docker images"
	@echo "  build-db   - Build PostgreSQL Docker image"
	@echo "  build-api  - Build Go API Docker image"
	@echo "  build-web  - Build React frontend Docker image"
	@echo "  test       - Run all tests"
	@echo "  lint       - Run linters"
	@echo "  clean      - Remove built images and dependencies"

setup:
	@echo "Installing Go dependencies..."
	cd apps/todo-api && go mod download
	@echo "Installing Node dependencies..."
	cd apps/todo-web && npm install
	@echo "✓ Dependencies installed"

build-db:
	@echo "Building PostgreSQL image..."
	docker build -t todo-db:latest apps/databases/pgsql
	@echo "✓ Database image built"

build-api:
	@echo "Building API image..."
	docker build -t todo-api:latest apps/todo-api
	@echo "✓ API image built"

build-web:
	@echo "Building frontend image..."
	docker build -t todo-web:latest apps/todo-web
	@echo "✓ Frontend image built"

build-all: build-db build-api build-web
	@echo "✓ All images built successfully"

test:
	@echo "Running Go tests..."
	cd apps/todo-api && go test ./... -v
	@echo "Running frontend tests..."
	cd apps/todo-web && npm test
	@echo "✓ All tests passed"

lint:
	@echo "Running Go linter..."
	cd apps/todo-api && go fmt ./...
	@echo "Running ESLint..."
	cd apps/todo-web && npm run lint
	@echo "✓ Linting complete"

clean:
	@echo "Removing Docker images..."
	-docker rmi todo-db:latest todo-api:latest todo-web:latest
	@echo "Cleaning Go cache..."
	cd apps/todo-api && go clean
	@echo "Cleaning Node modules..."
	rm -rf apps/todo-web/node_modules
	@echo "✓ Cleanup complete"
