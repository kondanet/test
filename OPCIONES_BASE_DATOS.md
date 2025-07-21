# 🗄️ Opciones de Base de Datos para Snake.io

¡Ahora tienes **4 opciones diferentes** para ejecutar tu juego Snake! Elige la que más te convenga:

## 🚀 **Opción 1: SÚPER FÁCIL - Sin Base de Datos**
```bash
./startSimple.sh
```
**✅ Ventajas:**
- ✅ **Cero configuración** - funciona inmediatamente
- ✅ **No requiere instalaciones** adicionales
- ✅ **Perfecto para pruebas** rápidas
- ✅ **Control con mouse** habilitado

**⚠️ Desventajas:**
- ❌ Los datos se pierden al reiniciar
- ❌ No hay persistencia de usuarios

---

## ⚡ **Opción 2: RECOMENDADA - Better SQLite3**
```bash
./startBetterSQLite.sh
```
**✅ Ventajas:**
- ✅ **Súper rápida** (3x más rápido que SQLite normal)
- ✅ **Un solo archivo** de base de datos
- ✅ **Cero configuración** - funciona automáticamente
- ✅ **Datos persistentes** - no se pierden
- ✅ **Optimizada** con queries preparados
- ✅ **Control con mouse** habilitado

**📊 Base de datos:** `snakegame.db` (archivo local)

---

## 📁 **Opción 3: SQLite Clásico**
```bash
./startSQLite.sh
```
**✅ Ventajas:**
- ✅ **Fácil de usar** - archivo local
- ✅ **Datos persistentes**
- ✅ **Estándar de la industria**
- ✅ **Control con mouse** habilitado

**📊 Base de datos:** `snakegame.db` (archivo local)

---

## 🌐 **Opción 4: MongoDB (Completa)**
```bash
./start.sh
```
**✅ Ventajas:**
- ✅ **Base de datos profesional**
- ✅ **Escalable** para muchos usuarios
- ✅ **Panel de administración** completo
- ✅ **Todas las características** avanzadas

**⚠️ Requisitos:**
- ❌ Requiere **instalar MongoDB**
- ❌ Más **configuración inicial**

---

## 🎯 **¿Cuál Elegir?**

### **Para Probar Rápido:**
```bash
./startSimple.sh
```
- Perfecto si solo quieres ver el juego funcionando

### **Para Desarrollo/Uso Personal (RECOMENDADO):**
```bash
./startBetterSQLite.sh
```
- La mejor opción: rápida, fácil y persistente

### **Para Producción/Muchos Usuarios:**
```bash
./start.sh
```
- Después de instalar MongoDB

---

## 🎮 **Características Incluidas en TODAS las Opciones:**

✅ **Juego multijugador** (hasta 10 jugadores)
✅ **Control con mouse** 🖱️ (¡NUEVO!)
✅ **Control táctil** 📱 para móviles
✅ **Controles de teclado** ⌨️ (WASD/Flechas)
✅ **Efectos visuales** y animaciones
✅ **Tabla de clasificación** en tiempo real
✅ **Sistema de puntuación**
✅ **Cámara que sigue al jugador**
✅ **Registro de usuarios** (excepto opción simple)

---

## 🖱️ **Nuevos Controles de Mouse:**

- **Mueve el mouse** → La serpiente sigue la dirección
- **Haz clic** → Cambio rápido de dirección
- **Desliza** (móviles) → Control táctil
- **Indicadores visuales** → Sabes hacia dónde vas

---

## 🚀 **Inicio Rápido:**

1. **Elige tu opción favorita**
2. **Ejecuta el script correspondiente**
3. **Abre http://localhost:3000**
4. **¡Juega con el mouse!** 🎮

---

## 👤 **Usuario Admin (opciones con BD):**
- **Usuario:** `admin`
- **Contraseña:** `admin123`

---

## 🔧 **Para Cambiar de Opción:**

1. **Detener servidor actual:** `./stop.sh` o `Ctrl+C`
2. **Ejecutar nueva opción:** `./startBetterSQLite.sh` (por ejemplo)

---

**¡Recomendación: Empieza con `./startBetterSQLite.sh` para la mejor experiencia!** ⚡🐍