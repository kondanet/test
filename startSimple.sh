#!/bin/bash

echo "🐍 Iniciando Snake.io (Versión Simple - Sin MongoDB)"
echo "=================================================="

# Verificar que Node.js esté instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado"
    echo "   Instálalo desde: https://nodejs.org/"
    exit 1
fi

# Verificar que npm esté instalado
if ! command -v npm &> /dev/null; then
    echo "❌ npm no está instalado"
    exit 1
fi

echo "✅ Node.js y npm encontrados"

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
echo "🚀 Iniciando servidor simplificado..."
echo "   ✅ Sin MongoDB requerido"
echo "   ✅ Datos en memoria"
echo "   ✅ Perfecto para pruebas"

cd server
node simpleStart.js &
SERVER_PID=$!

# Esperar a que el servidor inicie
sleep 3

echo ""
echo "🎉 ¡Servidor iniciado exitosamente!"
echo ""
echo "🎮 Accede al juego en: http://localhost:3000"
echo ""
echo "👤 Usuarios de prueba:"
echo "   - admin / admin123 (administrador)"
echo "   - O crea tu propio usuario"
echo ""
echo "🎯 Cómo jugar:"
echo "   1. Abre http://localhost:3000"
echo "   2. Regístrate o juega como invitado"
echo "   3. Usa WASD o flechas para moverte"
echo "   4. Come comida para crecer"
echo "   5. ¡Evita chocar!"
echo ""
echo "📝 Nota: Los datos se guardan en memoria"
echo "   (se pierden al reiniciar el servidor)"
echo ""
echo "Para detener: Ctrl+C o ejecuta ./stop.sh"

# Guardar PID para el script de parada
echo $SERVER_PID > server.pid

# Mantener el script ejecutándose
wait $SERVER_PID