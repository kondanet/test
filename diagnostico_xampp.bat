@echo off
echo ========================================
echo    DIAGNOSTICO WORMWORLD.IO - XAMPP
echo ========================================
echo.

color 0E

echo [DIAGNOSTICO] Verificando sistema...
echo.

:: Verificar Node.js
echo [1/8] Verificando Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ [ERROR] Node.js NO está instalado
    echo 💡 [SOLUCION] Descarga Node.js desde: https://nodejs.org/
    echo.
    goto :error_found
) else (
    for /f %%i in ('node --version') do echo ✅ [OK] Node.js %%i instalado
)

:: Verificar NPM
echo [2/8] Verificando NPM...
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ [ERROR] NPM NO está disponible
    goto :error_found
) else (
    for /f %%i in ('npm --version') do echo ✅ [OK] NPM %%i disponible
)

:: Verificar XAMPP Apache
echo [3/8] Verificando XAMPP Apache...
netstat -an | find ":80 " >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ [ERROR] Apache (puerto 80) NO está corriendo
    echo 💡 [SOLUCION] Inicia Apache en XAMPP Control Panel
    echo.
    goto :error_found
) else (
    echo ✅ [OK] Apache corriendo en puerto 80
)

:: Verificar estructura de archivos
echo [4/8] Verificando archivos del proyecto...
if not exist "client\index.html" (
    echo ❌ [ERROR] Archivo client\index.html NO encontrado
    echo 💡 [SOLUCION] Asegúrate de estar en la carpeta correcta del proyecto
    echo 📁 Deberías estar en: C:\xampp\htdocs\wormworld-game\
    echo.
    goto :error_found
) else (
    echo ✅ [OK] client\index.html encontrado
)

if not exist "server\package.json" (
    echo ❌ [ERROR] Archivo server\package.json NO encontrado
    echo 💡 [SOLUCION] Copia todos los archivos del proyecto
    echo.
    goto :error_found
) else (
    echo ✅ [OK] server\package.json encontrado
)

:: Verificar puertos disponibles
echo [5/8] Verificando puertos del juego...
netstat -an | find ":3000 " >nul 2>&1
if %errorlevel% equ 0 (
    echo ⚠️ [WARNING] Puerto 3000 ya está en uso
    echo 💡 [SOLUCION] El script intentará liberarlo automáticamente
) else (
    echo ✅ [OK] Puerto 3000 disponible
)

netstat -an | find ":3001 " >nul 2>&1
if %errorlevel% equ 0 (
    echo ⚠️ [WARNING] Puerto 3001 ya está en uso
    echo 💡 [SOLUCION] El script intentará liberarlo automáticamente
) else (
    echo ✅ [OK] Puerto 3001 disponible
)

:: Verificar dependencias del servidor
echo [6/8] Verificando dependencias del servidor...
if not exist "server\node_modules" (
    echo ⚠️ [WARNING] Dependencias del servidor NO instaladas
    echo 💡 [SOLUCION] El script las instalará automáticamente
) else (
    echo ✅ [OK] Dependencias del servidor instaladas
)

:: Verificar dependencias del admin panel
echo [7/8] Verificando dependencias del admin panel...
if not exist "admin-panel\node_modules" (
    echo ⚠️ [WARNING] Dependencias del admin panel NO instaladas
    echo 💡 [SOLUCION] El script las instalará automáticamente
) else (
    echo ✅ [OK] Dependencias del admin panel instaladas
)

:: Verificar acceso web
echo [8/8] Verificando acceso web...
echo 🌐 Intentando acceder a la página...

:: Crear archivo de prueba
echo ^<html^>^<body^>^<h1^>Prueba XAMPP OK^</h1^>^</body^>^</html^> > test.html

:: Verificar si se puede acceder
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost/wormworld-game/test.html' -TimeoutSec 5; if($response.StatusCode -eq 200) { exit 0 } else { exit 1 } } catch { exit 1 }" >nul 2>&1

if %errorlevel% neq 0 (
    echo ❌ [ERROR] No se puede acceder a http://localhost/wormworld-game/
    echo 💡 [SOLUCIONES]:
    echo    1. Verifica que XAMPP Apache esté corriendo
    echo    2. Asegúrate de que los archivos estén en C:\xampp\htdocs\wormworld-game\
    echo    3. Verifica que no haya firewall bloqueando
    echo.
    del test.html >nul 2>&1
    goto :error_found
) else (
    echo ✅ [OK] Acceso web funcionando correctamente
    del test.html >nul 2>&1
)

echo.
echo ========================================
echo        ✅ DIAGNOSTICO COMPLETADO
echo ========================================
echo.
echo 🎉 [EXITO] Todos los requisitos están OK
echo 🚀 [SIGUIENTE] Ejecuta: startWormate_xampp.bat
echo.
echo URLs que deberían funcionar:
echo 🎮 Juego: http://localhost/wormworld-game/client/
echo 🛠️ Admin: http://localhost:3001 (después de ejecutar el script)
echo 📊 Monitor: http://localhost:3000/colyseus (después de ejecutar el script)
echo.
pause
exit /b 0

:error_found
echo.
echo ========================================
echo         ❌ ERRORES ENCONTRADOS
echo ========================================
echo.
echo 🔧 [SOLUCION RAPIDA] Sigue estos pasos:
echo.
echo 1. 📥 INSTALAR NODE.JS (si no está):
echo    👉 https://nodejs.org/
echo    👉 Descarga la versión LTS
echo    👉 Instala con opciones por defecto
echo.
echo 2. 🚀 INICIAR XAMPP:
echo    👉 Abre XAMPP Control Panel
echo    👉 Haz clic en "Start" en Apache
echo    👉 Verifica que aparezca en verde
echo.
echo 3. 📁 VERIFICAR UBICACION:
echo    👉 Los archivos deben estar en:
echo    👉 C:\xampp\htdocs\wormworld-game\
echo.
echo 4. 🔄 REINTENTAR:
echo    👉 Ejecuta este diagnóstico nuevamente
echo    👉 Si todo está OK, ejecuta: startWormate_xampp.bat
echo.
echo ========================================
echo          🆘 AYUDA ADICIONAL
echo ========================================
echo.
echo Si sigues teniendo problemas:
echo 1. 📋 Copia el error exacto que ves
echo 2. 📷 Toma captura de pantalla
echo 3. 📝 Describe qué paso estabas haciendo
echo.
pause
exit /b 1