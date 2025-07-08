# Backend API Dockerfile (api/Dockerfile) - Development
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install pnpm globally
RUN npm install -g pnpm

# Install dependencies
RUN pnpm install

# Copy source code
COPY . .

# Expose port
EXPOSE 3001

# Use development mode with tsx (bypass build issues)
CMD ["pnpm", "run", "dev"]