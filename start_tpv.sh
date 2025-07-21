#!/bin/bash

# TPV Sistema - Script de inicio
echo "🚀 Iniciando TPV Sistema..."
echo "📦 Terminal Punto de Venta para productos físicos"
echo ""

# Verificar si Python está disponible
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 no está instalado"
    exit 1
fi

# Verificar si las dependencias están instaladas
python3 -c "import flask, flask_sqlalchemy, flask_migrate" 2>/dev/null
if [ $? -ne 0 ]; then
    echo "📥 Instalando dependencias..."
    pip install --break-system-packages Flask==2.3.3 Flask-SQLAlchemy==3.0.5 Flask-Migrate==4.0.5 Werkzeug==2.3.7 python-dotenv==1.0.0 requests==2.31.0
fi

# Crear directorio de imágenes si no existe
mkdir -p static/images

echo "🌐 Iniciando servidor web..."
echo "📍 Accede al sistema en: http://localhost:5000"
echo ""
echo "📋 Funcionalidades disponibles:"
echo "   • Dashboard: http://localhost:5000/"
echo "   • Punto de Venta: http://localhost:5000/pos"
echo "   • Inventario: http://localhost:5000/inventory"
echo "   • Reportes: http://localhost:5000/sales"
echo ""
echo "⌨️  Atajos de teclado:"
echo "   • F1: Punto de Venta"
echo "   • F2: Inventario"
echo "   • F3: Reportes"
echo "   • Ctrl+C: Detener servidor"
echo ""
echo "🔄 Iniciando aplicación..."

# Ejecutar la aplicación
python3 app.py