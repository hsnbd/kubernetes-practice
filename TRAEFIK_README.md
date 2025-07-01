# Traefik Microservices Setup

This setup uses Traefik as a reverse proxy to route traffic to your microservices.

## Architecture

- **Frontend (Next.js)**: `http://localhost` or `http://app.localhost`
- **User Service (Go)**: `http://api.localhost/users/*`
- **Product Service (NestJS)**: `http://api.localhost/products/*`
- **Order Service (Laravel)**: `http://api.localhost/orders/*`
- **Notification Service (Node.js)**: `http://api.localhost/notifications/*`
- **Analytics Service (Python/FastAPI)**: `http://api.localhost/analytics/*`
- **Traefik Dashboard**: `http://traefik.localhost` or `http://localhost:8090`

## Getting Started

1. **Start all services:**
   ```bash
   docker-compose up -d
   ```

2. **Check service health:**
   ```bash
   docker-compose ps
   ```

3. **View logs:**
   ```bash
   # All services
   docker-compose logs -f
   
   # Specific service
   docker-compose logs -f traefik
   ```

## Service URLs

### Frontend
- **URL**: `http://localhost` or `http://app.localhost`
- **Port**: 3000 (internal)

### API Services
All API services are accessible through `http://api.localhost` with their respective path prefixes:

- **User Service**: `http://api.localhost/users/`
  - Health check: `http://api.localhost/users/health`
  
- **Product Service**: `http://api.localhost/products/`
  - Health check: `http://api.localhost/products/health`
  
- **Order Service**: `http://api.localhost/orders/`
  - Health check: `http://api.localhost/orders/health`
  
- **Notification Service**: `http://api.localhost/notifications/`
  - Health check: `http://api.localhost/notifications/health`
  
- **Analytics Service**: `http://api.localhost/analytics/`
  - Health check: `http://api.localhost/analytics/health`

### Traefik Dashboard
- **URL**: `http://traefik.localhost` or `http://localhost:8090`
- Monitor all services, routes, and health status

## Host Configuration

Add these entries to your `/etc/hosts` file for local development:

```
127.0.0.1 localhost
127.0.0.1 app.localhost
127.0.0.1 api.localhost
127.0.0.1 traefik.localhost
```

## Development Commands

```bash
# Start all services in background
docker-compose up -d

# Start with logs visible
docker-compose up

# Stop all services
docker-compose down

# Rebuild and start services
docker-compose up --build

# Remove all containers and volumes
docker-compose down -v

# View Traefik configuration
curl http://traefik.localhost/api/http/routers
```

## Service-Specific Notes

### User Service (Go)
- Uses PostgreSQL database
- JWT authentication enabled
- Internal port: 8080

### Product Service (NestJS)
- TypeScript/Node.js based
- Internal port: 3000

### Order Service (Laravel)
- PHP with Apache
- Uses PostgreSQL database
- Internal port: 80

### Notification Service (Node.js)
- Express.js based
- Internal port: 3000

### Analytics Service (Python)
- FastAPI based
- Uses PostgreSQL database
- Internal port: 8000

## Troubleshooting

1. **Services not accessible:**
   - Check if containers are running: `docker-compose ps`
   - Verify Traefik dashboard: `http://traefik.localhost`
   - Check container logs: `docker-compose logs [service-name]`

2. **Port conflicts:**
   - Make sure ports 80, 443, and 8090 are available
   - Stop other web servers (Apache, Nginx) if running

3. **Database connection issues:**
   - Ensure PostgreSQL container is healthy
   - Check database environment variables
   - Verify network connectivity between services

4. **Traefik routing issues:**
   - Check service labels in docker-compose.yml
   - Verify Traefik dashboard for active routes
   - Ensure services are in the same network (traefik)

## Security Notes

- This setup is for development only
- Traefik dashboard is exposed without authentication
- Use HTTPS and proper authentication for production
- Consider using Docker secrets for sensitive data

## Scaling Services

To scale a service (e.g., product-service):

```bash
docker-compose up --scale product-service=3 -d
```

Traefik will automatically load balance between instances.
