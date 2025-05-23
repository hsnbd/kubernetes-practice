# Build stage
FROM node:22-alpine AS build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:22-alpine AS runner

WORKDIR /app

# Set environment to production
ENV NODE_ENV production

# Create non-root user for better security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy necessary files from build stage
COPY --from=build /app/public ./public
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/.next/standalone ./

# Set appropriate permissions
COPY --from=build --chown=nextjs:nodejs /app/.next/static ./.next/static

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

# Set host environment variable to listen on all interfaces
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Command to run the application
CMD ["node", "server.js"]