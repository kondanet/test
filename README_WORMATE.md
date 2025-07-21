# 🐍 Wormate.io Clone - Multiplayer Snake Game

Un clon completo de **Wormate.io** construido con **PhaserJS**, **Node.js**, y **Colyseus.io**. Juego Snake multijugador en tiempo real con interfaz moderna, efectos visuales profesionales y todas las características de un juego .io moderno.

![Wormate.io Clone](https://img.shields.io/badge/Game-Wormate.io%20Clone-green?style=for-the-badge&logo=gamepad)
![Node.js](https://img.shields.io/badge/Node.js-16+-green?style=for-the-badge&logo=node.js)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

## ✨ Características Principales

### 🎮 **Gameplay Idéntico a Wormate.io**
- ✅ **Serpientes circulares** con diseño realista y gradientes
- ✅ **16 skins únicos** con patrones especiales (rayas, puntos, rayos, etc.)
- ✅ **Ojos expresivos** que siguen la dirección de movimiento
- ✅ **Crecimiento dinámico** - la serpiente crece al comer
- ✅ **Sistema de puntuación** avanzado
- ✅ **Multijugador en tiempo real** hasta 50+ jugadores

### 🎨 **Efectos Visuales Profesionales**
- ✅ **Fondo animado** con patrón de puntos estilo Wormate.io
- ✅ **Partículas flotantes** en el fondo
- ✅ **Efectos de explosión** al comer comida
- ✅ **Brillo pulsante** en tu serpiente
- ✅ **Animaciones suaves** y transiciones fluidas
- ✅ **Comida colorida** con 8 colores vibrantes

### 🖱️ **Controles Intuitivos**
- ✅ **Control por mouse** - mueve hacia donde apuntes
- ✅ **Control táctil** - desliza para mover (móviles)
- ✅ **Teclado** - WASD o flechas
- ✅ **Clic rápido** - cambio instantáneo de dirección
- ✅ **Indicador visual** de dirección

### 📱 **Interfaz Moderna**
- ✅ **Menú principal** estilo Wormate.io
- ✅ **Selector de skins** interactivo
- ✅ **Leaderboard en vivo** con top 10 jugadores
- ✅ **HUD del juego** con score y longitud
- ✅ **Panel de muerte** con estadísticas finales
- ✅ **Notificaciones** elegantes
- ✅ **Totalmente responsivo** - funciona en móviles

### 🔧 **Backend Robusto**
- ✅ **Servidor autorizado** - anti-cheat
- ✅ **Base de datos** (SQLite/MongoDB)
- ✅ **Sistema de usuarios** y autenticación
- ✅ **Panel de administración** web
- ✅ **API RESTful** completa
- ✅ **Monitoreo en tiempo real**

## 🚀 Inicio Rápido

### 📋 Requisitos Previos
- **Node.js 16+** - [Descargar aquí](https://nodejs.org/)
- **npm** (incluido con Node.js)
- **Git** (opcional)

### ⚡ Instalación Automática (Recomendado)

```bash
# 1. Clonar el repositorio (o descargar ZIP)
git clone <repository-url>
cd wormate-clone

# 2. Ejecutar script de inicio automático
./startWormate.sh
```

**¡Eso es todo!** El script automáticamente:
- ✅ Instala todas las dependencias
- ✅ Configura la base de datos
- ✅ Inicia todos los servicios
- ✅ Abre el juego en tu navegador

### 🌐 Acceso al Juego

Una vez iniciado, accede a:

- **🎮 Juego Principal**: http://localhost:8080
- **⚙️ Panel Admin**: http://localhost:3001
- **📊 Monitor**: http://localhost:3000/colyseus

## 🎮 Cómo Jugar

### 🐍 **Objetivo**
- Controla tu serpiente para comer comida colorida
- Crece y sube en el leaderboard
- ¡Evita chocar con otras serpientes!

### 🕹️ **Controles**

| Control | Acción |
|---------|--------|
| 🖱️ **Mouse** | Mueve hacia donde apuntes |
| 📱 **Touch/Swipe** | Desliza para mover (móviles) |
| ⌨️ **WASD/Flechas** | Movimiento con teclado |
| 🖱️ **Clic** | Cambio rápido de dirección |
| ⚡ **Mantener Clic** | Boost (próximamente) |

### 🎨 **Personalización**
- **16 skins únicos** disponibles
- Usa las flechas en el menú para cambiar skin
- Tu selección se guarda automáticamente

## 🛠️ Instalación Manual

Si prefieres instalación manual:

### 1️⃣ **Servidor de Juego**
```bash
cd server
npm install
npm start
```

### 2️⃣ **Panel de Administración**
```bash
cd admin-panel
npm install
npm start
```

### 3️⃣ **Cliente Web**
```bash
# Servir archivos estáticos
cd client
python3 -m http.server 8080
# o
npx http-server -p 8080
```

## 📁 Estructura del Proyecto

```
wormate-clone/
├── 🎮 client/              # Frontend del juego
│   ├── index.html          # Interfaz principal
│   ├── js/
│   │   ├── game.js         # Motor del juego (Phaser)
│   │   ├── ui.js           # Interfaz de usuario
│   │   ├── auth.js         # Autenticación
│   │   ├── api.js          # Comunicación con API
│   │   └── main.js         # Punto de entrada
│   └── assets/             # Recursos (imágenes, sonidos)
│
├── 🖥️ server/              # Backend del juego
│   ├── index.js            # Servidor principal
│   ├── rooms/
│   │   └── SnakeRoom.js    # Lógica del juego multijugador
│   ├── schemas/
│   │   └── SnakeState.js   # Estados del juego
│   ├── routes/             # API endpoints
│   ├── models/             # Modelos de base de datos
│   └── .env                # Configuración
│
├── ⚙️ admin-panel/         # Panel de administración
│   ├── app.js              # Servidor del panel
│   ├── views/              # Vistas EJS
│   └── public/             # Archivos estáticos
│
├── 📜 Scripts de inicio
│   ├── startWormate.sh     # 🌟 Script principal (NUEVO)
│   ├── startBetterSQLite.sh
│   ├── startSimple.sh
│   └── stop.sh
│
└── 📚 Documentación
    ├── README.md           # Documentación original
    ├── README_WORMATE.md   # 🌟 Esta documentación
    └── OPCIONES_BASE_DATOS.md
```

## 🎨 Características del Diseño

### 🐍 **Serpientes Estilo Wormate.io**
- **Cuerpo circular** con gradientes realistas
- **Ojos expresivos** que miran hacia la dirección
- **16 colores vibrantes** únicos
- **Patrones especiales**: rayas, puntos, rayos, espirales
- **Tamaño dinámico** que crece con la longitud
- **Efectos de brillo** para el jugador actual

### 🍎 **Sistema de Comida**
- **8 colores diferentes** de comida
- **Animación de pulsación** suave
- **Rotación lenta** para efecto dinámico
- **Efectos de partículas** al ser comida
- **Gradientes y brillos** realistas

### 🌟 **Efectos Visuales**
- **Fondo con patrón de puntos** como Wormate.io
- **Partículas flotantes** en el fondo
- **Explosiones de partículas** al comer
- **Anillos de crecimiento** cuando la serpiente crece
- **Transiciones suaves** entre estados

## 🔧 Configuración Avanzada

### 🗄️ **Base de Datos**
El juego soporta múltiples opciones de base de datos:

| Opción | Descripción | Comando |
|--------|-------------|---------|
| **Better SQLite3** ⭐ | Recomendado para desarrollo | `./startWormate.sh` |
| **SQLite** | Alternativa con Sequelize | `./startSQLite.sh` |
| **MongoDB** | Para producción | `./start.sh` |
| **En Memoria** | Solo para testing | `./startSimple.sh` |

### ⚙️ **Variables de Entorno**
Edita `server/.env` para personalizar:

```env
# Servidor
PORT=3000
NODE_ENV=development

# Base de datos
DB_TYPE=better-sqlite3
DB_PATH=./wormate.db

# Juego
GAME_WIDTH=2000
GAME_HEIGHT=1500
MAX_FOOD=50
FOOD_SPAWN_RATE=1000
GAME_SPEED=100

# Seguridad
JWT_SECRET=tu-clave-secreta
SESSION_SECRET=tu-session-secret
```

## 📊 Panel de Administración

Accede al panel en: http://localhost:3001

**Credenciales por defecto:**
- Usuario: `admin`
- Contraseña: `admin123`

### 🔧 **Funcionalidades**
- 👥 Gestión de usuarios
- 🎮 Estadísticas de juegos
- 📈 Métricas en tiempo real
- 🛡️ Moderación de jugadores
- 📊 Leaderboards globales

## 🐛 Solución de Problemas

### ❌ **Problemas Comunes**

#### Puerto en uso
```bash
# Matar proceso en puerto 3000
lsof -ti:3000 | xargs kill -9

# O usar el script de limpieza
./stop.sh
```

#### Dependencias faltantes
```bash
# Reinstalar dependencias
cd server && npm install
cd ../admin-panel && npm install
cd ../client && npm install
```

#### Error de conexión
- Verificar que el servidor esté corriendo en puerto 3000
- Revisar logs: `tail -f logs/server.log`
- Verificar firewall/antivirus

### 📝 **Logs**
Los logs se guardan en:
- `logs/server.log` - Servidor de juego
- `logs/admin.log` - Panel de administración
- `logs/web.log` - Servidor web

## 🚀 Despliegue en Producción

### 🌐 **Preparación**
1. Cambiar `NODE_ENV=production` en `.env`
2. Configurar base de datos externa (MongoDB)
3. Configurar reverse proxy (nginx)
4. Configurar SSL/HTTPS
5. Configurar dominio

### 🐳 **Docker (Próximamente)**
```bash
# Construir imagen
docker build -t wormate-clone .

# Ejecutar contenedor
docker run -p 3000:3000 -p 3001:3001 wormate-clone
```

## 🤝 Contribuir

¡Las contribuciones son bienvenidas!

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-caracteristica`)
3. Commit tus cambios (`git commit -m 'Agregar nueva característica'`)
4. Push a la rama (`git push origin feature/nueva-caracteristica`)
5. Abre un Pull Request

### 🎯 **Ideas para Contribuir**
- 🎨 Nuevos skins y patrones
- ⚡ Sistema de boost/velocidad
- 🏆 Más modos de juego
- 🔊 Sistema de sonidos
- 📱 Mejoras para móviles
- 🌍 Internacionalización

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 🙏 Créditos

- **Phaser.js** - Motor de juego
- **Colyseus.io** - Multijugador en tiempo real
- **Node.js** - Backend
- **Wormate.io** - Inspiración del diseño

## 📞 Soporte

¿Necesitas ayuda?

- 📧 Email: [tu-email@ejemplo.com]
- 💬 Discord: [Tu servidor de Discord]
- 🐛 Issues: [GitHub Issues]
- 📖 Wiki: [GitHub Wiki]

---

## 🎮 ¡Disfruta Jugando!

**¡Tu clon de Wormate.io está listo!** 🐍✨

```bash
# ¡Inicia el juego ahora!
./startWormate.sh
```

**¿Te gustó el proyecto?** ⭐ ¡Dale una estrella en GitHub!

---

*Hecho con ❤️ por [Tu Nombre]*