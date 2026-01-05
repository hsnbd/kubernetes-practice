# Development stage
FROM golang:1.24-alpine AS development

WORKDIR /app

# Install necessary build tools and air for hot reloading
RUN apk add --no-cache gcc musl-dev git
RUN go install github.com/air-verse/air@latest

# Copy go mod and sum files
COPY go.mod go.sum ./

# Download all dependencies
RUN go mod download

# Expose port 8080
EXPOSE 8080

# Use air for hot reloading in development
CMD ["air", "-c", ".air.toml"]

# Production stage
FROM golang:1.24-alpine AS build

WORKDIR /app

# Install necessary build tools
RUN apk add --no-cache gcc musl-dev

# Copy go mod and sum files
COPY go.mod go.sum ./

# Download all dependencies
RUN go mod download

# Copy the source code
COPY . .

# Build the application
RUN go build -o main .

# Final production stage
FROM alpine:latest AS production

RUN apk --no-cache add ca-certificates
WORKDIR /root/

# Copy the binary from build stage
COPY --from=build /app/main .

# Expose port 8080
EXPOSE 8080

# Command to run the application
CMD ["./main"]
