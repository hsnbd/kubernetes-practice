# Development image
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy all source files
COPY . .

# Expose the default Next.js dev port
EXPOSE 3000

# Use development environment
ENV NODE_ENV=development
ENV HOST 0.0.0.0
ENV PORT 3000

# Run the development server
CMD ["npm", "run", "dev"]