#!/bin/bash

# Snake.io Multiplayer Game - Startup Script
echo "🐍 Starting Snake.io Multiplayer Game..."

# Check if MongoDB is running
if ! pgrep -x "mongod" > /dev/null; then
    echo "⚠️  MongoDB is not running. Please start MongoDB first."
    echo "   You can start it with: sudo systemctl start mongod"
    echo "   Or: brew services start mongodb/brew/mongodb-community (on macOS)"
    exit 1
fi

# Function to check if a port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo "⚠️  Port $1 is already in use"
        return 1
    fi
    return 0
}

# Check if required ports are available
echo "🔍 Checking ports..."
check_port 3000 || exit 1
check_port 3001 || exit 1

# Create log directory
mkdir -p logs

echo "🚀 Starting services..."

# Check if admin user exists, if not create one
echo "🔑 Checking for admin user..."
cd server
npm run create-admin
cd ..

# Start the game server
echo "   Starting game server on port 3000..."
cd server
npm start > ../logs/server.log 2>&1 &
SERVER_PID=$!
cd ..

# Wait a moment for server to start
sleep 3

# Start the admin panel
echo "   Starting admin panel on port 3001..."
cd admin-panel
npm start > ../logs/admin.log 2>&1 &
ADMIN_PID=$!
cd ..

# Wait for services to start
sleep 2

echo ""
echo "✅ Services started successfully!"
echo ""
echo "🎮 Game Client: http://localhost:3000"
echo "⚙️  Admin Panel: http://localhost:3001"
echo "📊 API Docs: http://localhost:3000/api"
echo "🔍 Colyseus Monitor: http://localhost:3000/colyseus"
echo ""
echo "📝 Logs are saved in the 'logs' directory"
echo "   Server log: logs/server.log"
echo "   Admin log: logs/admin.log"
echo ""
echo "To stop all services, run: ./stop.sh"
echo "Or press Ctrl+C to stop this script and run: kill $SERVER_PID $ADMIN_PID"

# Save PIDs for stop script
echo $SERVER_PID > logs/server.pid
echo $ADMIN_PID > logs/admin.pid

# Keep script running and show logs
echo ""
echo "📊 Real-time logs (press Ctrl+C to stop):"
echo "==========================================="

# Follow logs
tail -f logs/server.log logs/admin.log