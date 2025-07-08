#!/bin/bash

echo "🛑 Stopping Trucking Challenge..."

# Stop all services
docker-compose down

echo "✅ Services stopped!"
echo ""
echo "💡 To restart: ./start.sh"
echo "💡 To reset completely: ./reset.sh"