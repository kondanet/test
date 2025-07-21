#!/bin/bash

# Snake.io Multiplayer Game - Stop Script
echo "🛑 Stopping Snake.io services..."

# Function to stop a service by PID
stop_service() {
    local service_name=$1
    local pid_file=$2
    
    if [ -f "$pid_file" ]; then
        local pid=$(cat "$pid_file")
        if ps -p $pid > /dev/null 2>&1; then
            echo "   Stopping $service_name (PID: $pid)..."
            kill $pid
            # Wait for process to stop
            local count=0
            while ps -p $pid > /dev/null 2>&1 && [ $count -lt 10 ]; do
                sleep 1
                count=$((count + 1))
            done
            
            # Force kill if still running
            if ps -p $pid > /dev/null 2>&1; then
                echo "   Force stopping $service_name..."
                kill -9 $pid
            fi
            echo "   ✅ $service_name stopped"
        else
            echo "   ⚠️  $service_name was not running"
        fi
        rm -f "$pid_file"
    else
        echo "   ⚠️  No PID file found for $service_name"
    fi
}

# Stop services
if [ -d "logs" ]; then
    stop_service "Game Server" "logs/server.pid"
    stop_service "Admin Panel" "logs/admin.pid"
else
    echo "   ⚠️  No logs directory found. Services may not be running."
fi

# Also kill any processes on the known ports
echo "🔍 Checking for any remaining processes on ports 3000 and 3001..."

# Kill any process on port 3000
PORT_3000_PID=$(lsof -ti:3000)
if [ ! -z "$PORT_3000_PID" ]; then
    echo "   Killing process on port 3000 (PID: $PORT_3000_PID)"
    kill $PORT_3000_PID 2>/dev/null
fi

# Kill any process on port 3001
PORT_3001_PID=$(lsof -ti:3001)
if [ ! -z "$PORT_3001_PID" ]; then
    echo "   Killing process on port 3001 (PID: $PORT_3001_PID)"
    kill $PORT_3001_PID 2>/dev/null
fi

echo ""
echo "✅ All Snake.io services have been stopped!"
echo "   Ports 3000 and 3001 are now available."