# Todo Application - Kubernetes Practice Project

A professional full-stack todo application with Go backend, React frontend, and PostgreSQL database. Designed for Kubernetes deployment with Tilt for fast local development.

## 🏗️ Architecture

```
┌─────────────┐         ┌──────────────┐         ┌────────────┐
│   React     │────────▶│   Go API     │────────▶│ PostgreSQL │
│  Frontend   │         │   (Gin)      │         │  Database  │
│  (Tailwind) │         │              │         │            │
└─────────────┘         └──────────────┘         └────────────┘
```

- **Frontend**: React 19 + TypeScript + Tailwind CSS + Headless UI
- **Backend**: Go 1.22 + Gin + Standard architecture (Repository pattern, Service layer)
- **Database**: PostgreSQL 16 with UUID support
- **State Management**: Zustand
- **Authentication**: JWT tokens

## 🚀 Features

- ✅ User authentication (register/login)
- ✅ Create, read, update, delete todos
- ✅ Categories with custom colors
- ✅ Tags for organization
- ✅ Due dates and priorities
- ✅ Todo sharing with other users
- ✅ Mark todos as complete
- ✅ Responsive design with Tailwind CSS
- ✅ Accessible UI with Headless UI components

## 📋 Prerequisites

- Docker & Docker Compose
- Go 1.22+ (for local development)
- Node.js 20+ (for local development)
- kubectl (for Kubernetes deployment)
- Tilt (for Kubernetes development workflow)

## 🚀 Quick Start

### Option 1: Docker Run (Simplest)

Run all services with Docker in containers:

```bash
# Build all images
make build-all

# Start all services
./docker-run.sh
```

**Access the application:**
- Frontend: http://localhost:3000
- API: http://localhost:8080
- Health check: http://localhost:8080/health

**Manage services:**
```bash
# View logs
./docker-logs.sh
# or individually:
docker logs -f todo-db
docker logs -f todo-api
docker logs -f todo-web

# Stop all services
./docker-stop.sh
```

### Option 2: Tilt Kubernetes Development

For Kubernetes deployment with automatic rebuilds:

```bash
# Create Kubernetes manifests (see below)
# Then start Tilt
tilt up
```

### Option 3: Local Development

Run services locally without Docker:

**Terminal 1 - Database:**
```bash
docker run -d --name todo-db-dev \
  -e POSTGRES_DB=tododb \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  todo-db:latest
```

**Terminal 2 - Backend:**
```bash
cd apps/todo-api
export DATABASE_URL="postgres://postgres:postgres@localhost:5432/tododb?sslmode=disable"
export JWT_SECRET="my-secret-key"
go run cmd/server/main.go
```docker-run.sh              # Start all services with Docker
├── docker-stop.sh             # Stop all Docker services
├── docker-logs.sh             # View logs from all services
├── Tiltfile                   # Tilt configuration for Kubernetes
├── 

**Terminal 3 - Frontend:**
```bash
cd apps/todo-web
npm run dev
```

## 🔑 Test Credentials

The seed data includes placeholder password hashes, so you'll need to **register a new account**:

1. Open http://localhost:3000
2. Click "Register"
3. Create your account with any email/password

Or use the API directly:
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123","name":"Your Name"}'
```

## 📁 Project Structure

```
kube/
├── apps/
│   ├── databases/pgsql/       # PostgreSQL setup
│   │   ├── schema.sql         # Database schema
│   │   ├── seed.sql           # Seed data
│   │   └── Dockerfile         # Database image
│   │
│   ├── todo-api/              # Go backend
│   │   ├── cmd/server/        # Main application
│   │   ├── internal/
│   │   │   ├── config/        # Configuration management
│   │   │   ├── handler/       # HTTP handlers
│   │   │   ├── middleware/    # Middleware (auth, CORS, etc.)
│   │   │   ├── models/        # Data models and DTOs
│   │   │   ├── repository/    # Database layer
│   │   │   └── service/       # Business logic
│   │   ├── pkg/               # Shared utilities (JWT, password)
│   │   ├── Dockerfile         # API image
│   │   └── .env.example       # Environment variables template
│   │
│   └── todo-web/              # React frontend
│       ├── src/
│       │   ├── components/    # React components
│       │   ├── api.ts         # API client
│       │   ├── store.ts       # Zustand state management
│       │   ├── App.tsx        # Main app with routing
│       │   └── main.tsx       # Entry point
│       ├── Dockerfile         # Frontend image
│       ├── nginx.conf         # Nginx configuration
│       └── .env.example       # Environment variables template
│
├── Makefile                   # Build and development commands
└── README.md                  # This file
```

## 🔧 Development

### Backend (Go API)

```bash
cd apps/todo-api

# Run locally
go run cmd/server/main.go

# Run tests
go test ./...

# Format code
go fmt ./...
```

**Environment Variables** (create `.env` from `.env.example`):
- `PORT`: API server port (default: 8080)
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `JWT_EXPIRATION_HOURS`: Token expiration time
- `CORS_ORIGINS`: Allowed origins for CORS
- `LOG_LEVEL`: Logging level (debug/info/warn/error)

### Frontend (React)

```bash
cd apps/todo-web

# Run development server
npm run dev

# Build for production
npm run build

# Run linter
npm run lint
```

**Environment Variables** (create `.env` from `.env.example`):
-he database is initialized with:
- Schema with all tables and indexes
- UUID extension enabled
- Sample categories and tags
- Test todos with relationships

**Note**: Seed data users have placeholder password hashes. Use the registration endpoint to create real accounts.

Test users in seed data:
- Email: `alice@example.com` / Password: `password123`
- Email: `bob@example.com` / Password: `password123`

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user (protected)

### Todos
- `GET /api/todos` - List user's todos (with filters)
- `GET /api/todos/shared` - List shared todos
- `GET /api/todos/:id` - Get specific todo
- `POST /api/todos` - Create todo
- `PUT /api/todos/:id` - Update todo
- `PATCH /api/todos/:id/complete` - Toggle complete status
- `DELETE /api/todos/:id` - Delete todo
- `POST /api/todos/:id/share` - Share todo with another user
- `DELETE /api/todos/:id/share/:userId` - Unshare todo
- `GET /api/todos/:id/shares` - List todo shares

### Categories
- `GET /api/categories` - List categories
- `POST /api/categories` - Create category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### Tags
- `GET /api/tags` - List tags
- `POST /api/tags` - Create tag
- `DELETE /api/tags/:id` - Delete tag

All protected endpoints require `Authorization: Bearer <token>` header.

## 🧪 Testing

```bash
# Run all tests
make test

# Run only backend tests
cd apps/todo-api && go test ./... -v

# Run with coverage
cd apps/todo-api && go test ./... -cover
```

## 🎨 Tech Stack Details

### Backend
- **Gin**: Fast HTTP framework
- **pgx/v5**: PostgreSQL driver
- **JWT**: Token-based authentication
- **Zap**: Structured logging
- **bcrypt**: Password hashing

### Frontend
- **React 19**: Latest React with concurrent features
- **TypeScript**: Type safety
- **Tailwind CSS**: Utility-first CSS
- **Headless UI**: Accessible components
- **Heroicons**: Icon library
- **Axios**: HTTP client and seed data
- `todo-api:latest` - Go API server (multi-stage build)
- `todo-web:latest` - React frontend with Nginx

### Building Images

```bash
# Build all images
make build-all

# Or individually
make build-db
make build-api
make build-web
```

### Running with Docker

The `docker-run.sh` script creates a Docker network and runs all containers:

```bash
./docker-run.sh
```

This will:
1. Create a `todo-network` Docker network
2. Start PostgreSQL (todo-db) on the network
3. Start API server (todo-api) connected to the database
4. Start frontend (todo-web) serving on port 3000
 (Go modules + npm packages)
- `make build-all` - Build all Docker images
- `make build-db` - Build database image
- `make build-api` - Build API image
- `make build-web` - Build frontend image
- `make test` - Run all tests
- `make lint` - Run linters
- `make clean` - Clean up images and dependencies

## 🐚 Docker Scripts

- `./docker-are hashed with bcrypt (cost factor 10)
- JWT tokens expire after 24 hours (configurable via JWT_EXPIRATION_HOURS)
- Database uses UUIDs for all primary keys
- API uses standard REST conventions
- Frontend uses localStorage for token persistence
- CORS is configured for development (accepts all origins with *)
- Docker network isolates services (database not exposed to host)
- Seed data includes sample todos, categories, tags, and relationships
- `todo-web:latest` - React frontend with Nginx

## ☸️ Kubernetes Deployment

The `Tiltfile` is configured to build all three Docker images:
- `todo-db` - PostgreSQL database
- `todo-api` - Go backend API
- `todo-web` - React frontend

**You need to create Kubernetes manifests** in `kuberaw/deployments/`:

1. **Deployments**: For each service (postgres, api, web)
2. **Services**: To expose the services
3. **Ingress**: For external access
4. **ConfigMaps**: For configuration
5. **Secrets**: For sensitive data (passwords, JWT secret)
6. **PersistentVolumeClaims**: For database storage

Once manifests are created, uncomment the relevant lines in the Tiltfile to load them.

## 🔨 Makefile Commands

- `make help` - Show available commands
- `make setup` - Install all dependencies
- `make build-all` - Build all Docker images
- `make build-db` - Build database image
- `make build-api` - Build API image
- `make build-web` - Build frontend image
- `make test` - Run all tests
- `make lint` - Run linters
- `make clean` - Clean up images and dependencies

## 📝 Notes

- Passwords in seed data are hashed with bcrypt
- JWT tokens expire after 72 hours (configurable)
- Database uses UUIDs for all primary keys
- API uses standard REST conventions
- Frontend uses localStorage for token persistence
- CORS is configured for local development

## 🤝 Contributing

This is a practice project. Feel free to extend it with:
- Subtasks/nested todos
- Recurring todos
- Notifications
- File attachments
- Team workspaces
- Calendar view
- Search functionality
- Todo templates

## 📄 License

MIT License - Use freely for learning and practice.
