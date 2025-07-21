#!/bin/bash

echo "🐍 Snake.io con Better SQLite3 (SÚPER RÁPIDO)"
echo "=============================================="

# Verificar que Node.js esté instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado"
    echo "   Instálalo desde: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js encontrado"

# Instalar dependencias si no existen
if [ ! -d "server/node_modules" ]; then
    echo "📦 Instalando dependencias del servidor..."
    cd server
    npm install
    cd ..
fi

if [ ! -d "client/node_modules" ]; then
    echo "📦 Instalando dependencias del cliente..."
    cd client
    npm install
    cd ..
fi

# Verificar puertos
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "⚠️  Puerto 3000 ya está en uso"
    echo "   Ejecuta: ./stop.sh para detener servicios"
    exit 1
fi

echo ""
echo "🚀 Iniciando servidor con Better SQLite3..."
echo "   ✅ Base de datos: Better SQLite3 (SÚPER RÁPIDA)"
echo "   ✅ Rendimiento optimizado"
echo "   ✅ Queries preparados para máxima velocidad"
echo "   ✅ Control con mouse habilitado"

cd server
node betterSqliteStart.js &
SERVER_PID=$!

# Esperar a que el servidor inicie
sleep 3

echo ""
echo "🎉 ¡Servidor iniciado exitosamente!"
echo ""
echo "🎮 Accede al juego en: http://localhost:3000"
echo ""
echo "👤 Usuario admin:"
echo "   - Usuario: admin"
echo "   - Contraseña: admin123"
echo ""
echo "🎯 Controles del juego:"
echo "   🖱️ Mouse: Mueve hacia donde apuntes"
echo "   👆 Clic: Cambio rápido de dirección"
echo "   📱 Touch: Desliza en móviles"
echo "   ⌨️ Teclado: WASD o flechas"
echo ""
echo "⚡ Ventajas de Better SQLite3:"
echo "   - 3x más rápido que SQLite normal"
echo "   - Queries preparados para mejor rendimiento"
echo "   - Manejo optimizado de transacciones"
echo "   - Archivo único (snakegame.db)"
echo ""
echo "📊 Base de datos: snakegame.db"
echo "   - Los datos se guardan automáticamente"
echo "   - Respaldo fácil (solo copia el archivo .db)"
echo ""
echo "Para detener: Ctrl+C o ejecuta ./stop.sh"

# Guardar PID para el script de parada
echo $SERVER_PID > server.pid

# Mantener el script ejecutándose
wait $SERVER_PID