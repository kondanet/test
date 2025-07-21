@echo off
echo ========================================
echo    SOLUCION RAPIDA - WORMWORLD.IO
echo ========================================
echo.

color 0A

echo [INFO] Solucionando problema "al intentar jugar"...
echo.

:: Verificar Node.js rápidamente
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ [ERROR CRITICO] Node.js NO está instalado
    echo.
    echo 🔧 [SOLUCION INMEDIATA]:
    echo 1. Ve a: https://nodejs.org/
    echo 2. Descarga la versión LTS (recomendada)
    echo 3. Instala con todas las opciones por defecto
    echo 4. Reinicia tu computadora
    echo 5. Ejecuta este script nuevamente
    echo.
    pause
    exit /b 1
)

echo ✅ [OK] Node.js está instalado
echo.

:: Crear directorio de logs
if not exist "logs" mkdir logs

:: Matar procesos existentes en los puertos
echo [INFO] Liberando puertos del juego...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3000" 2^>nul') do (
    taskkill /PID %%a /F >nul 2>&1
)
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3001" 2^>nul') do (
    taskkill /PID %%a /F >nul 2>&1
)

:: Instalar dependencias rápidamente
echo [INFO] Instalando dependencias del servidor...
cd server
call npm install --silent
if %errorlevel% neq 0 (
    echo ❌ [ERROR] No se pudieron instalar las dependencias del servidor
    echo 💡 [SOLUCION] Verifica tu conexión a internet
    pause
    exit /b 1
)
cd ..

echo [INFO] Instalando dependencias del admin panel...
cd admin-panel
call npm install --silent
if %errorlevel% neq 0 (
    echo ❌ [ERROR] No se pudieron instalar las dependencias del admin panel
    echo 💡 [SOLUCION] Verifica tu conexión a internet
    pause
    exit /b 1
)
cd ..

:: Crear archivo .env
echo [INFO] Configurando servidor...
if not exist "server\.env" (
    echo NODE_ENV=development > server\.env
    echo PORT=3000 >> server\.env
    echo ADMIN_PORT=3001 >> server\.env
    echo DB_TYPE=better-sqlite3 >> server\.env
    echo DB_PATH=./database/wormworld.db >> server\.env
    echo JWT_SECRET=wormworld_secret_2024 >> server\.env
    echo JWT_EXPIRES_IN=7d >> server\.env
    echo CORS_ORIGIN=http://localhost >> server\.env
    echo COLYSEUS_MONITOR_AUTH_USER=admin >> server\.env
    echo COLYSEUS_MONITOR_AUTH_PASSWORD=admin123 >> server\.env
)

echo [INFO] Iniciando servidor del juego...
cd server
start /B cmd /c "npm run betterSqliteStart > ..\logs\game-server.log 2>&1"
cd ..

:: Esperar que el servidor se inicie
echo [INFO] Esperando que el servidor se inicie...
timeout /t 5 /nobreak >nul

:: Verificar que el servidor esté corriendo
netstat -an | find ":3000" >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ [ERROR] El servidor del juego no se inició correctamente
    echo.
    echo 📝 [DEBUG] Revisa el log del servidor:
    if exist "logs\game-server.log" (
        echo ----------------------------------------
        type logs\game-server.log
        echo ----------------------------------------
    )
    echo.
    pause
    exit /b 1
)

echo ✅ [OK] Servidor del juego iniciado correctamente
echo.

:: Iniciar admin panel
echo [INFO] Iniciando panel de administración...
cd admin-panel
start /B cmd /c "npm start > ..\logs\admin-panel.log 2>&1"
cd ..

:: Esperar un poco más
timeout /t 3 /nobreak >nul

echo.
echo ========================================
echo           🎉 ¡LISTO PARA JUGAR!
echo ========================================
echo.
echo 🎮 JUEGO: http://localhost/wormworld-game/client/
echo 🛠️ ADMIN: http://localhost:3001
echo 📊 MONITOR: http://localhost:3000/colyseus
echo.
echo ========================================
echo              COMO JUGAR
echo ========================================
echo.
echo 1. 🌐 Abre tu navegador
echo 2. 📍 Ve a: http://localhost/wormworld-game/client/
echo 3. ✏️ Escribe tu nombre
echo 4. 🎨 [OPCIONAL] Haz clic en "SKINLAB" para personalizar
echo 5. 🚀 Haz clic en "¡JUGAR!"
echo.
echo 🕹️ CONTROLES:
echo    • Flechas del teclado o WASD = Mover
echo    • Mouse = Seguir cursor
echo    • Clic izquierdo mantenido = Boost (acelerar)
echo.

:: Intentar abrir el navegador
echo [INFO] Abriendo el juego automáticamente...
start http://localhost/wormworld-game/client/

echo.
echo ========================================
echo         MANTENIENDO SERVIDORES
echo ========================================
echo.
echo ℹ️ Los servidores están corriendo en segundo plano
echo ℹ️ Puedes cerrar esta ventana DESPUÉS de jugar
echo ℹ️ Para detener los servidores: Ctrl+C
echo.
echo 🔄 Monitoreando servidores cada 10 segundos...
echo 📝 Si hay errores, revisa los logs en la carpeta "logs"
echo.

:monitor_loop
timeout /t 10 /nobreak >nul

:: Verificar servidor del juego
netstat -an | find ":3000" >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ [ERROR] Servidor del juego se detuvo inesperadamente
    echo 📝 Revisa: logs\game-server.log
    echo.
)

:: Verificar admin panel
netstat -an | find ":3001" >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ [ERROR] Panel de administración se detuvo
    echo 📝 Revisa: logs\admin-panel.log
    echo.
)

goto monitor_loop