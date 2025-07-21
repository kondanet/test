# 🎮 **WormWorld.io - Guía para XAMPP**

## 📋 **Requisitos Previos**

### **1. Software Necesario:**
- ✅ **XAMPP** (Apache + MySQL + PHP)
- ✅ **Node.js** (v14 o superior)
- ✅ **NPM** (incluido con Node.js)
- ✅ **Navegador web moderno**

### **2. Verificar Instalaciones:**
```bash
# Verificar Node.js
node --version

# Verificar NPM
npm --version
```

## 🚀 **Instalación Paso a Paso**

### **Paso 1: Preparar XAMPP**
1. **Inicia XAMPP Control Panel**
2. **Inicia Apache** (puerto 80)
3. **Opcionalmente inicia MySQL** (si planeas usar base de datos MySQL)

### **Paso 2: Copiar Archivos**
1. **Copia la carpeta del proyecto** a:
   ```
   C:\xampp\htdocs\wormworld-game\
   ```

2. **Estructura final:**
   ```
   C:\xampp\htdocs\wormworld-game\
   ├── client/                  # Frontend del juego
   │   ├── index.html          # Página principal
   │   ├── js/                 # Scripts del juego
   │   └── css/                # Estilos
   ├── server/                 # Backend Node.js
   │   ├── package.json        # Dependencias del servidor
   │   └── rooms/              # Lógica del juego
   ├── admin-panel/            # Panel de administración
   ├── startWormate_xampp.bat  # Script de inicio para Windows
   └── GUIA_XAMPP.md          # Esta guía
   ```

### **Paso 3: Ejecutar el Juego**
1. **Navega a la carpeta del proyecto:**
   ```cmd
   cd C:\xampp\htdocs\wormworld-game\
   ```

2. **Ejecuta el script de inicio:**
   ```cmd
   startWormate_xampp.bat
   ```

3. **¡El juego se abrirá automáticamente!**

## 🌐 **URLs de Acceso**

### **🎮 Juego Principal:**
```
http://localhost/wormworld-game/client/
```

### **🛠️ Panel de Administración:**
```
http://localhost:3001
Usuario: admin
Contraseña: admin123
```

### **📊 Monitor del Servidor:**
```
http://localhost:3000/colyseus
Usuario: admin
Contraseña: admin123
```

### **🔌 API del Servidor:**
```
http://localhost:3000/api
```

## 🎨 **Características Disponibles**

### **✨ SKINLAB - Creador de Skins:**
- 🎨 **15+ Patrones únicos**
- 🌈 **5 Tipos de gradientes**
- ⚡ **10+ Efectos especiales**
- 👁️ **10+ Estilos de ojos**
- 🧱 **7+ Texturas de cuerpo**
- 🎭 **6+ Animaciones**
- 💾 **Guardar/Cargar skins**
- 📤 **Exportar/Importar**

### **🕹️ Controles del Juego:**
- **Teclado:** Flechas o WASD
- **Mouse:** Sigue el cursor
- **Móvil:** Controles táctiles
- **Boost:** Clic izquierdo mantenido

### **🎯 Funcionalidades:**
- ✅ **Multijugador en tiempo real**
- ✅ **Sistema de skins personalizado**
- ✅ **Efectos visuales avanzados**
- ✅ **Leaderboard en vivo**
- ✅ **Responsive design**
- ✅ **Persistencia de datos**

## 🔧 **Solución de Problemas**

### **❌ Error: "No se puede conectar al servidor"**
**Solución:**
1. Verifica que Node.js esté instalado
2. Ejecuta `startWormate_xampp.bat`
3. Espera que aparezcan los mensajes de "Servidor iniciado"
4. Recarga la página del juego

### **❌ Error: "Puerto 3000 en uso"**
**Solución:**
1. El script automáticamente libera los puertos
2. Si persiste, reinicia el script
3. O manualmente:
   ```cmd
   netstat -ano | findstr :3000
   taskkill /PID [PID_NUMBER] /F
   ```

### **❌ Error: "XAMPP Apache no inicia"**
**Solución:**
1. Verifica que el puerto 80 esté libre
2. Cierra Skype o cambia su puerto
3. Ejecuta XAMPP como administrador

### **❌ Error: "Módulos de Node.js no encontrados"**
**Solución:**
1. El script instala automáticamente las dependencias
2. Si falla, ejecuta manualmente:
   ```cmd
   cd server
   npm install
   cd ../admin-panel
   npm install
   ```

## 📝 **Logs y Debugging**

### **Ver Logs del Servidor:**
```cmd
type logs\game-server.log
```

### **Ver Logs del Admin Panel:**
```cmd
type logs\admin-panel.log
```

### **Consola del Navegador:**
1. Presiona `F12`
2. Ve a la pestaña "Console"
3. Busca mensajes de WormWorld.io

## 🎮 **Cómo Jugar**

### **🚀 Inicio Rápido:**
1. **Abre el juego:** `http://localhost/wormworld-game/client/`
2. **Ingresa tu nombre** en el campo de texto
3. **Personaliza tu skin** (opcional):
   - Haz clic en **"SKINLAB"**
   - Crea tu skin único
   - Guarda y aplica
4. **Haz clic en "¡JUGAR!"**

### **🎯 Objetivo:**
- Mueve tu serpiente para comer comida
- Crece y evita chocar con otros jugadores
- ¡Conviértete en la serpiente más larga!

### **🕹️ Controles:**
- **Movimiento:** Flechas, WASD, o mouse
- **Boost:** Mantén clic izquierdo (consume longitud)
- **Pausa:** Presiona ESC

## 🔄 **Comandos Útiles**

### **Reiniciar Servidores:**
```cmd
startWormate_xampp.bat
```

### **Detener Servidores:**
```cmd
Ctrl + C (en la ventana del script)
```

### **Ver Estado de Puertos:**
```cmd
netstat -an | findstr :3000
netstat -an | findstr :3001
```

### **Limpiar Cache del Navegador:**
```
Ctrl + F5 (recarga forzada)
```

## 🌟 **Características Avanzadas**

### **🎨 SKINLAB Avanzado:**
- **Rareza automática:** Común → Legendario
- **Exportar skins:** Formato JSON
- **Importar skins:** Desde archivos
- **Generador aleatorio:** Crea skins únicos
- **Vista previa:** Tiempo real

### **📊 Estadísticas:**
- **Puntuación actual**
- **Longitud de la serpiente**
- **Tiempo de juego**
- **Ranking en vivo**

### **🎭 Efectos Visuales:**
- **Partículas al comer**
- **Efectos de crecimiento**
- **Brillo personalizable**
- **Animaciones suaves**
- **Fondo dinámico**

## 📞 **Soporte**

### **🐛 Reportar Errores:**
1. Revisa los logs
2. Anota el error exacto
3. Incluye pasos para reproducir

### **💡 Sugerencias:**
- Nuevos patrones de skins
- Efectos especiales
- Modos de juego
- Características de WormWorld.io

## 🎉 **¡Disfruta el Juego!**

¡Ya tienes **WormWorld.io** funcionando en XAMPP! 

**Características destacadas:**
- 🎨 **SKINLAB completo**
- 🌟 **Efectos visuales únicos**
- 🚀 **Rendimiento optimizado**
- 📱 **Compatible con móviles**
- 🎮 **Multijugador fluido**

---

**¿Necesitas ayuda?** Revisa los logs en la carpeta `logs/` o verifica la consola del navegador para más información.

**¡Que tengas una excelente experiencia jugando WormWorld.io!** 🐍✨