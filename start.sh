#!/bin/bash

echo "🚀 Starting Trucking Challenge..."

# Create network if it doesn't exist
docker network create trucking-network 2>/dev/null || true

# Build and start all services
echo "📦 Building images..."
docker-compose build

echo "🔄 Starting services..."
docker-compose up -d

echo "⏳ Waiting for services to be ready..."
sleep 10

echo "✅ Services started!"
echo ""
echo "🌐 Frontend: http://localhost"
echo "🔧 Backend API: http://localhost:3001"
echo "🗄️ MongoDB: mongodb://localhost:27017"
echo ""
echo "View logs: docker-compose logs -f"
echo "Stop services: docker-compose down"