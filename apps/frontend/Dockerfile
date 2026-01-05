# Development stage
FROM node:22-alpine AS development

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev dependencies)
RUN npm install

# For development, we'll run as root to avoid permission issues with volume mounts
# This is acceptable in development environments

# Expose the default Next.js dev port
EXPOSE 3000

# Use development environment
ENV NODE_ENV=development
ENV HOST=0.0.0.0
ENV PORT=3000

# Run the development server
CMD ["npm", "run", "dev"]

# Build stage
FROM node:22-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:22-alpine AS production

WORKDIR /app

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy built application from build stage
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public

# Change ownership of the app directory
RUN chown -R nextjs:nodejs /app
USER nextjs

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]