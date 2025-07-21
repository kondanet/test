#!/bin/bash

# Wormate.io Clone - Startup Script
# Este script inicia el juego Snake multijugador con interfaz estilo Wormate.io

echo "🐍 Iniciando Wormate.io Clone..."
echo "=================================="

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Función para mostrar mensajes con colores
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${PURPLE}$1${NC}"
}

# Verificar si Node.js está instalado
if ! command -v node &> /dev/null; then
    print_error "Node.js no está instalado. Por favor instala Node.js 16+ desde https://nodejs.org/"
    exit 1
fi

# Verificar versión de Node.js
NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    print_warning "Se recomienda Node.js 16+. Versión actual: $(node --version)"
fi

# Verificar si npm está instalado
if ! command -v npm &> /dev/null; then
    print_error "npm no está instalado. Por favor instala npm."
    exit 1
fi

# Crear directorio de logs si no existe
mkdir -p logs

# Función para limpiar procesos al salir
cleanup() {
    print_status "Deteniendo servicios..."
    if [ -f "logs/server.pid" ]; then
        SERVER_PID=$(cat logs/server.pid)
        if ps -p $SERVER_PID > /dev/null 2>&1; then
            kill $SERVER_PID
            print_success "Servidor detenido"
        fi
        rm -f logs/server.pid
    fi
    
    if [ -f "logs/admin.pid" ]; then
        ADMIN_PID=$(cat logs/admin.pid)
        if ps -p $ADMIN_PID > /dev/null 2>&1; then
            kill $ADMIN_PID
            print_success "Panel de administración detenido"
        fi
        rm -f logs/admin.pid
    fi
    
    print_status "¡Hasta luego! 👋"
    exit 0
}

# Capturar señales para cleanup
trap cleanup SIGINT SIGTERM

# Verificar dependencias del servidor
print_status "Verificando dependencias del servidor..."
cd server
if [ ! -d "node_modules" ]; then
    print_status "Instalando dependencias del servidor..."
    npm install
    if [ $? -ne 0 ]; then
        print_error "Error instalando dependencias del servidor"
        exit 1
    fi
fi

# Verificar dependencias del admin panel
print_status "Verificando dependencias del panel de administración..."
cd ../admin-panel
if [ ! -d "node_modules" ]; then
    print_status "Instalando dependencias del panel de administración..."
    npm install
    if [ $? -ne 0 ]; then
        print_error "Error instalando dependencias del panel de administración"
        exit 1
    fi
fi

cd ..

# Verificar puertos disponibles
print_status "Verificando puertos disponibles..."

check_port() {
    local port=$1
    local service=$2
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null; then
        print_warning "Puerto $port está en uso (necesario para $service)"
        print_status "Intentando liberar el puerto..."
        lsof -ti:$port | xargs kill -9 2>/dev/null
        sleep 2
        if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null; then
            print_error "No se pudo liberar el puerto $port. Por favor cierra la aplicación que lo está usando."
            return 1
        fi
    fi
    return 0
}

check_port 3000 "Servidor de Juego" || exit 1
check_port 3001 "Panel de Administración" || exit 1

# Configurar variables de entorno si no existen
if [ ! -f "server/.env" ]; then
    print_status "Creando archivo de configuración..."
    cat > server/.env << EOF
# Configuración del Servidor Wormate.io Clone
PORT=3000
NODE_ENV=development

# Base de datos (usando Better SQLite3 por defecto)
DB_TYPE=better-sqlite3
DB_PATH=./wormate.db

# Seguridad
JWT_SECRET=wormate-super-secret-key-$(date +%s)
SESSION_SECRET=wormate-session-secret-$(date +%s)

# Admin Panel
ADMIN_PORT=3001

# Configuración del Juego
GAME_WIDTH=2000
GAME_HEIGHT=1500
MAX_FOOD=50
FOOD_SPAWN_RATE=1000
GAME_SPEED=100

# Logs
LOG_LEVEL=info
EOF
    print_success "Archivo de configuración creado"
fi

# Mostrar información del sistema
print_header "🎮 WORMATE.IO CLONE - INFORMACIÓN DEL SISTEMA"
echo "Node.js: $(node --version)"
echo "npm: $(npm --version)"
echo "Sistema: $(uname -s)"
echo "Arquitectura: $(uname -m)"
echo "Directorio: $(pwd)"
echo ""

# Iniciar servidor del juego
print_header "🚀 INICIANDO SERVIDOR DE JUEGO"
print_status "Puerto: 3000"
print_status "Base de datos: Better SQLite3"
cd server
npm start > ../logs/server.log 2>&1 &
SERVER_PID=$!
echo $SERVER_PID > ../logs/server.pid
cd ..

# Esperar a que el servidor inicie
print_status "Esperando a que el servidor inicie..."
sleep 3

# Verificar si el servidor está corriendo
if ! ps -p $SERVER_PID > /dev/null 2>&1; then
    print_error "El servidor no pudo iniciarse. Revisa los logs:"
    tail -20 logs/server.log
    exit 1
fi

# Verificar si el puerto está escuchando
sleep 2
if ! lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null; then
    print_error "El servidor no está escuchando en el puerto 3000"
    print_error "Logs del servidor:"
    tail -20 logs/server.log
    exit 1
fi

print_success "Servidor de juego iniciado (PID: $SERVER_PID)"

# Iniciar panel de administración
print_header "⚙️ INICIANDO PANEL DE ADMINISTRACIÓN"
print_status "Puerto: 3001"
cd admin-panel
npm start > ../logs/admin.log 2>&1 &
ADMIN_PID=$!
echo $ADMIN_PID > ../logs/admin.pid
cd ..

# Esperar a que el admin panel inicie
sleep 3

# Verificar si el admin panel está corriendo
if ! ps -p $ADMIN_PID > /dev/null 2>&1; then
    print_warning "El panel de administración no pudo iniciarse (opcional)"
    print_status "El juego funcionará sin panel de administración"
else
    print_success "Panel de administración iniciado (PID: $ADMIN_PID)"
fi

# Mostrar información de acceso
print_header "🌐 INFORMACIÓN DE ACCESO"
echo ""
print_success "✅ Wormate.io Clone está funcionando!"
echo ""
echo -e "${CYAN}🎮 JUGAR:${NC}"
echo "   🌐 http://localhost:8080"
echo "   📱 http://$(hostname -I | awk '{print $1}'):8080 (para móviles en la misma red)"
echo ""
echo -e "${CYAN}⚙️ ADMINISTRACIÓN:${NC}"
if ps -p $ADMIN_PID > /dev/null 2>&1; then
    echo "   🔧 http://localhost:3001"
    echo "   📊 Usuario: admin | Contraseña: admin123"
else
    echo "   ❌ No disponible (error al iniciar)"
fi
echo ""
echo -e "${CYAN}📊 MONITOREO:${NC}"
echo "   📈 http://localhost:3000/colyseus (Monitor de Colyseus)"
echo ""
echo -e "${CYAN}🛠️ DESARROLLO:${NC}"
echo "   📁 Logs: ./logs/"
echo "   🔧 Config: ./server/.env"
echo ""

# Iniciar servidor web simple para servir archivos estáticos
print_status "Iniciando servidor web para archivos del cliente..."

# Verificar si Python está disponible
if command -v python3 &> /dev/null; then
    cd client
    python3 -m http.server 8080 > ../logs/web.log 2>&1 &
    WEB_PID=$!
    echo $WEB_PID > ../logs/web.pid
    cd ..
    print_success "Servidor web iniciado con Python (PID: $WEB_PID)"
elif command -v python &> /dev/null; then
    cd client
    python -m SimpleHTTPServer 8080 > ../logs/web.log 2>&1 &
    WEB_PID=$!
    echo $WEB_PID > ../logs/web.pid
    cd ..
    print_success "Servidor web iniciado con Python 2 (PID: $WEB_PID)"
elif command -v npx &> /dev/null; then
    cd client
    npx http-server -p 8080 -c-1 > ../logs/web.log 2>&1 &
    WEB_PID=$!
    echo $WEB_PID > ../logs/web.pid
    cd ..
    print_success "Servidor web iniciado con http-server (PID: $WEB_PID)"
else
    print_warning "No se pudo iniciar servidor web automáticamente"
    print_status "Abre client/index.html directamente en tu navegador"
fi

# Agregar PID del servidor web al cleanup
cleanup_with_web() {
    cleanup
    if [ -f "logs/web.pid" ]; then
        WEB_PID=$(cat logs/web.pid)
        if ps -p $WEB_PID > /dev/null 2>&1; then
            kill $WEB_PID
            print_success "Servidor web detenido"
        fi
        rm -f logs/web.pid
    fi
}

trap cleanup_with_web SIGINT SIGTERM

# Mostrar controles
print_header "🎮 CONTROLES DEL JUEGO"
echo "🖱️  Mouse: Mueve hacia donde apuntes"
echo "📱  Touch: Desliza para mover (móviles)"
echo "⌨️  Teclado: WASD o Flechas"
echo "🖱️  Clic: Cambio rápido de dirección"
echo "⚡  Boost: Mantén clic (próximamente)"
echo ""

print_header "🔧 COMANDOS ÚTILES"
echo "Ctrl+C: Detener todos los servicios"
echo "tail -f logs/server.log: Ver logs del servidor"
echo "tail -f logs/admin.log: Ver logs del admin"
echo "./stop.sh: Script alternativo para detener"
echo ""

# Abrir navegador automáticamente (opcional)
if command -v xdg-open &> /dev/null; then
    print_status "Abriendo navegador..."
    sleep 2
    xdg-open http://localhost:8080 &
elif command -v open &> /dev/null; then
    print_status "Abriendo navegador..."
    sleep 2
    open http://localhost:8080 &
fi

# Mantener el script corriendo
print_header "🏃 SERVIDOR EJECUTÁNDOSE"
print_status "Presiona Ctrl+C para detener todos los servicios"
echo ""

# Monitor de procesos
while true; do
    sleep 10
    
    # Verificar servidor de juego
    if ! ps -p $SERVER_PID > /dev/null 2>&1; then
        print_error "El servidor de juego se detuvo inesperadamente"
        print_status "Revisa los logs: tail logs/server.log"
        break
    fi
    
    # Verificar admin panel
    if [ -n "$ADMIN_PID" ] && ! ps -p $ADMIN_PID > /dev/null 2>&1; then
        print_warning "El panel de administración se detuvo"
        ADMIN_PID=""
    fi
    
    # Verificar servidor web
    if [ -n "$WEB_PID" ] && ! ps -p $WEB_PID > /dev/null 2>&1; then
        print_warning "El servidor web se detuvo"
        WEB_PID=""
    fi
done

# Si llegamos aquí, algo salió mal
cleanup_with_web