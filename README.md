# TPV Sistema - Terminal Punto de Venta

Un sistema completo de Terminal Punto de Venta (TPV) para productos físicos, desarrollado con Python Flask y tecnologías web modernas.

## 🚀 Características

### 📊 Dashboard
- Vista general de ventas del día, semana y mes
- Productos con stock bajo
- Ventas recientes
- Estadísticas en tiempo real

### 🛒 Punto de Venta (POS)
- Interfaz intuitiva para ventas rápidas
- Búsqueda de productos por nombre o código de barras
- Carrito de compras interactivo
- Múltiples métodos de pago (efectivo, tarjeta, transferencia)
- Cálculo automático de impuestos (16%)
- Confirmación de ventas con modal

### 📦 Gestión de Inventario
- CRUD completo de productos
- Gestión de categorías
- Control de stock en tiempo real
- Códigos de barras automáticos
- Filtros avanzados de búsqueda
- Ajuste rápido de inventario

### 📈 Reportes de Ventas
- Historial completo de ventas
- Filtros por fecha
- Gráficos de ventas por método de pago
- Gráficos de ventas diarias
- Exportación a CSV
- Detalles de cada venta

## 🛠️ Tecnologías Utilizadas

### Backend
- **Python 3.8+**
- **Flask** - Framework web
- **SQLAlchemy** - ORM para base de datos
- **SQLite** - Base de datos (fácil de configurar)
- **Flask-Migrate** - Migraciones de base de datos

### Frontend
- **HTML5/CSS3**
- **JavaScript ES6+**
- **Bootstrap 5** - Framework CSS
- **Font Awesome** - Iconos
- **Chart.js** - Gráficos

## 📋 Instalación y Configuración

### Prerrequisitos
- Python 3.8 o superior
- pip (gestor de paquetes de Python)

### Pasos de instalación

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd tpv-sistema
   ```

2. **Crear entorno virtual (recomendado)**
   ```bash
   python -m venv venv
   source venv/bin/activate  # En Linux/Mac
   # o
   venv\Scripts\activate     # En Windows
   ```

3. **Instalar dependencias**
   ```bash
   pip install -r requirements.txt
   ```

4. **Ejecutar la aplicación**
   ```bash
   python app.py
   ```

5. **Abrir en el navegador**
   ```
   http://localhost:5000
   ```

## 🎯 Uso del Sistema

### Primer Uso
Al iniciar la aplicación por primera vez, se crearán automáticamente:
- Categorías predeterminadas (Bebidas, Comida, Snacks, Limpieza, Otros)
- Productos de ejemplo para pruebas

### Flujo de Trabajo Típico

1. **Configuración Inicial**
   - Ir a "Inventario" y agregar productos
   - Crear categorías según necesidades
   - Configurar códigos de barras

2. **Realizar Ventas**
   - Ir a "Punto de Venta"
   - Buscar productos o escanear códigos de barras
   - Agregar al carrito
   - Seleccionar método de pago
   - Procesar venta

3. **Monitoreo**
   - Revisar dashboard para estadísticas
   - Ver reportes de ventas
   - Controlar stock bajo

## 🔧 Configuración Avanzada

### Variables de Entorno
Puedes crear un archivo `.env` para configuraciones personalizadas:

```env
SECRET_KEY=tu-clave-secreta-aqui
DATABASE_URL=sqlite:///tpv.db
DEBUG=True
```

### Base de Datos
El sistema usa SQLite por defecto, pero puede configurarse para usar PostgreSQL o MySQL modificando la URL de la base de datos.

### Personalización
- **Impuestos**: Modificar `TAX_RATE` en `static/js/app.js`
- **Moneda**: Cambiar `CURRENCY` en `static/js/app.js`
- **Stock bajo**: Ajustar `LOW_STOCK_THRESHOLD` en `static/js/app.js`

## 📱 Funcionalidades Destacadas

### Atajos de Teclado
- **F1**: Abrir Punto de Venta
- **F2**: Abrir Inventario
- **F3**: Abrir Reportes de Ventas
- **Ctrl+N**: Nuevo producto (en inventario)
- **Enter**: Buscar por código de barras (en POS)
- **Escape**: Cerrar modales

### Responsive Design
- Adaptado para tablets y dispositivos móviles
- Interfaz optimizada para pantallas táctiles
- Navegación intuitiva en dispositivos pequeños

### Validaciones
- Control de stock en tiempo real
- Validación de formularios
- Prevención de ventas con stock insuficiente
- Validación de datos de productos

## 🔒 Seguridad

- Validación de datos en cliente y servidor
- Protección contra inyección SQL (SQLAlchemy ORM)
- Validación de formularios
- Manejo seguro de errores

## 🚀 Próximas Funcionalidades

- [ ] Sistema de usuarios y roles
- [ ] Integración con impresoras de tickets
- [ ] Backup automático de base de datos
- [ ] Integración con lectores de códigos de barras
- [ ] Reportes más avanzados
- [ ] Sistema de descuentos y promociones
- [ ] Integración con sistemas de pago externos

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu funcionalidad (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Soporte

Si tienes problemas o preguntas:
1. Revisa la documentación
2. Busca en los issues existentes
3. Crea un nuevo issue con detalles del problema

## 🙏 Agradecimientos

- Bootstrap por el framework CSS
- Font Awesome por los iconos
- Chart.js por los gráficos
- Flask community por la documentación

---

**Desarrollado con ❤️ para pequeños y medianos comercios**