# 🚀 TPV Sistema para XAMPP

## 📋 Instrucciones de Instalación

### 1. **Preparar XAMPP**
```bash
# Asegúrate de que XAMPP esté instalado y funcionando
# Inicia Apache y MySQL desde el panel de control de XAMPP
```

### 2. **Copiar archivos**
```bash
# Copia la carpeta tpv-php completa a:
# Windows: C:\xampp\htdocs\tpv-php\
# Linux: /opt/lampp/htdocs/tpv-php/
# macOS: /Applications/XAMPP/xamppfiles/htdocs/tpv-php/
```

### 3. **Crear base de datos**
1. Ve a **phpMyAdmin**: `http://localhost/phpmyadmin`
2. Crea una nueva base de datos llamada: `tpv_sistema`
3. No necesitas crear tablas, se crean automáticamente

### 4. **Configurar conexión**
Edita el archivo `config.php` si es necesario:
```php
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');           // Cambia si tienes contraseña
define('DB_NAME', 'tpv_sistema');
```

## 🌐 **URLs de Acceso**

### **Dashboard Principal:**
```
http://localhost/tpv-php/
```

### **API Endpoints:**
```
http://localhost/tpv-php/api/products.php
http://localhost/tpv-php/api/sales.php
```

## 🧪 **Cómo Probar**

### **1. Verificar instalación**
- Ve a: `http://localhost/tpv-php/`
- Deberías ver el dashboard con estadísticas

### **2. Probar API de productos**
```bash
# En el navegador o con curl:
http://localhost/tpv-php/api/products.php
```

### **3. Datos de ejemplo**
El sistema incluye productos de ejemplo:
- Coca Cola 500ml ($2.50)
- Agua Natural 1L ($1.00) 
- Pan Integral ($3.50)
- Leche Entera 1L ($4.20)
- Huevos 12 piezas ($6.50)
- Y más...

## 🔧 **Estructura del Proyecto**

```
tpv-php/
├── 📄 config.php              # Configuración y conexión DB
├── 📄 index.php               # Dashboard principal
├── 📄 pos.php                 # Punto de venta (pendiente)
├── 📄 inventory.php           # Inventario (pendiente)
├── 📄 sales.php               # Reportes (pendiente)
├── 📁 api/                    # API REST
│   ├── products.php           # CRUD productos
│   └── sales.php              # Gestión ventas
└── 📄 INSTRUCCIONES_XAMPP.md  # Este archivo
```

## ⚡ **Funcionalidades Disponibles**

### ✅ **Completadas:**
- ✅ Configuración de base de datos
- ✅ API REST para productos
- ✅ API REST para ventas  
- ✅ Dashboard con estadísticas
- ✅ Datos de ejemplo automáticos
- ✅ Responsive design

### 🔄 **En desarrollo:**
- 🔄 Punto de venta (POS)
- 🔄 Gestión de inventario
- 🔄 Reportes de ventas
- 🔄 Categorías API

## 🚨 **Solución de Problemas**

### **Error de conexión a base de datos:**
1. Verifica que MySQL esté corriendo en XAMPP
2. Confirma que la base de datos `tpv_sistema` existe
3. Revisa usuario/contraseña en `config.php`

### **No se ven los datos:**
1. Ve a `http://localhost/tpv-php/api/products.php`
2. Deberías ver un JSON con productos
3. Si está vacío, revisa la consola del navegador

### **Error 500:**
1. Revisa los logs de Apache en XAMPP
2. Verifica que PHP esté habilitado
3. Confirma permisos de archivos

## 🎯 **Próximos Pasos**

Para completar el sistema, necesitas:

1. **Crear `pos.php`** - Interfaz punto de venta
2. **Crear `inventory.php`** - Gestión de productos
3. **Crear `sales.php`** - Reportes y estadísticas
4. **Agregar `api/categories.php`** - Gestión categorías

## 💡 **Consejos**

- Usa las herramientas de desarrollo del navegador (F12)
- Revisa la consola JavaScript para errores
- Utiliza phpMyAdmin para verificar datos
- Los archivos PHP deben estar en `htdocs` para funcionar

## 🔗 **Enlaces Útiles**

- **XAMPP Panel:** `http://localhost/xampp/`
- **phpMyAdmin:** `http://localhost/phpmyadmin`
- **Dashboard TPV:** `http://localhost/tpv-php/`

---

**¡Tu sistema TPV está listo para XAMPP!** 🎉