@echo off
echo ========================================
echo    WORMWORLD.IO - XAMPP LAUNCHER
echo ========================================
echo.

:: Colores para Windows
color 0A

echo [INFO] Verificando dependencias...

:: Verificar Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js no está instalado. Descárgalo desde: https://nodejs.org/
    pause
    exit /b 1
)

:: Verificar npm
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] NPM no está disponible.
    pause
    exit /b 1
)

echo [OK] Node.js y NPM están instalados.
echo.

:: Crear directorio de logs si no existe
if not exist "logs" mkdir logs

echo [INFO] Instalando dependencias del servidor...
cd server
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Error instalando dependencias del servidor.
    pause
    exit /b 1
)
cd ..

echo [INFO] Instalando dependencias del panel de administración...
cd admin-panel
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Error instalando dependencias del panel de administración.
    pause
    exit /b 1
)
cd ..

echo.
echo [INFO] Configurando variables de entorno...

:: Crear archivo .env para el servidor si no existe
if not exist "server\.env" (
    echo # Configuración de WormWorld.io > server\.env
    echo NODE_ENV=development >> server\.env
    echo PORT=3000 >> server\.env
    echo ADMIN_PORT=3001 >> server\.env
    echo # Base de datos - usando Better SQLite3 por defecto >> server\.env
    echo DB_TYPE=better-sqlite3 >> server\.env
    echo DB_PATH=./database/wormworld.db >> server\.env
    echo # Configuración JWT >> server\.env
    echo JWT_SECRET=wormworld_super_secret_key_2024 >> server\.env
    echo JWT_EXPIRES_IN=7d >> server\.env
    echo # CORS >> server\.env
    echo CORS_ORIGIN=http://localhost >> server\.env
    echo # Monitor Colyseus >> server\.env
    echo COLYSEUS_MONITOR_AUTH_USER=admin >> server\.env
    echo COLYSEUS_MONITOR_AUTH_PASSWORD=admin123 >> server\.env
    echo [OK] Archivo .env creado con configuración por defecto.
) else (
    echo [OK] Archivo .env ya existe.
)

echo.
echo [INFO] Verificando puertos...

:: Verificar si los puertos están en uso
netstat -an | find "3000" >nul
if %errorlevel% equ 0 (
    echo [WARNING] Puerto 3000 está en uso. Intentando liberar...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3000"') do (
        taskkill /PID %%a /F >nul 2>&1
    )
)

netstat -an | find "3001" >nul
if %errorlevel% equ 0 (
    echo [WARNING] Puerto 3001 está en uso. Intentando liberar...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3001"') do (
        taskkill /PID %%a /F >nul 2>&1
    )
)

echo.
echo [INFO] Iniciando servidores...

:: Iniciar servidor del juego en segundo plano
echo [INFO] Iniciando servidor del juego (Puerto 3000)...
cd server
start /B npm run betterSqliteStart > ..\logs\game-server.log 2>&1
cd ..

:: Esperar un momento para que el servidor se inicie
timeout /t 3 /nobreak >nul

:: Iniciar panel de administración en segundo plano
echo [INFO] Iniciando panel de administración (Puerto 3001)...
cd admin-panel
start /B npm start > ..\logs\admin-panel.log 2>&1
cd ..

:: Esperar un momento más
timeout /t 2 /nobreak >nul

echo.
echo ========================================
echo           SERVIDORES INICIADOS
echo ========================================
echo.
echo 🎮 JUEGO (Frontend):
echo    👉 http://localhost/wormworld-game/client/
echo.
echo 🎮 SERVIDOR DEL JUEGO:
echo    👉 http://localhost:3000
echo.
echo 🛠️  PANEL DE ADMINISTRACIÓN:
echo    👉 http://localhost:3001
echo    Usuario: admin
echo    Contraseña: admin123
echo.
echo 📊 MONITOR COLYSEUS:
echo    👉 http://localhost:3000/colyseus
echo    Usuario: admin
echo    Contraseña: admin123
echo.
echo ========================================
echo            CONTROLES DEL JUEGO
echo ========================================
echo 🕹️  Movimiento: Flechas del teclado o WASD
echo 🖱️  Movimiento: Mouse (sigue el cursor)
echo 📱 Móvil: Controles táctiles en pantalla
echo 🎨 Personalización: Botón SKINLAB en el menú
echo 👕 Accesorios: Botón WEARLAB en el menú
echo ⚡ Boost: Mantén presionado clic izquierdo
echo.
echo ========================================
echo              COMANDOS ÚTILES
echo ========================================
echo 📝 Ver logs del servidor: type logs\game-server.log
echo 📝 Ver logs del admin: type logs\admin-panel.log
echo 🔄 Reiniciar servidores: Ejecuta este script nuevamente
echo 🛑 Detener servidores: Ctrl+C en esta ventana
echo.

:: Intentar abrir el navegador automáticamente
echo [INFO] Abriendo el juego en el navegador...
start http://localhost/wormworld-game/client/

echo.
echo [INFO] Monitoreo de servidores activo...
echo [INFO] Presiona Ctrl+C para detener todos los servidores.
echo.

:monitor_loop
timeout /t 5 /nobreak >nul

:: Verificar si el servidor del juego sigue corriendo
netstat -an | find "3000" >nul
if %errorlevel% neq 0 (
    echo [ERROR] El servidor del juego se ha detenido inesperadamente.
    echo [INFO] Revisa los logs en: logs\game-server.log
)

:: Verificar si el panel de admin sigue corriendo
netstat -an | find "3001" >nul
if %errorlevel% neq 0 (
    echo [ERROR] El panel de administración se ha detenido inesperadamente.
    echo [INFO] Revisa los logs en: logs\admin-panel.log
)

goto monitor_loop

:cleanup
echo.
echo [INFO] Deteniendo servidores...

:: Matar procesos de Node.js en los puertos específicos
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3000"') do (
    taskkill /PID %%a /F >nul 2>&1
)

for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3001"') do (
    taskkill /PID %%a /F >nul 2>&1
)

echo [INFO] Servidores detenidos.
echo [INFO] ¡Gracias por jugar WormWorld.io!
pause
exit /b 0