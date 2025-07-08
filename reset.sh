#!/bin/bash

echo "🔄 Resetting Trucking Challenge completely..."

# Stop and remove containers, networks, and volumes
echo "🗑️ Removing containers and volumes..."
docker-compose down -v

# Clean up unused images
echo "🧹 Cleaning unused images..."
docker image prune -f

# Rebuild without cache
echo "🔨 Rebuilding images without cache..."
docker-compose build --no-cache

# Start services
echo "🚀 Starting services..."
docker-compose up -d

echo "⏳ Waiting for services to be ready..."
sleep 15

echo "✅ Application reset complete!"
echo ""
echo "🌐 Frontend: http://localhost"
echo "🔧 Backend API: http://localhost:3001"
echo "🗄️ MongoDB: mongodb://localhost:27017"
echo ""
echo "View logs: docker-compose logs -f"