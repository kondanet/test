// TPV Sistema - JavaScript Common Functions

// Configuración global
const TPV = {
    API_BASE: '/api',
    CURRENCY: '$',
    TAX_RATE: 0.16,
    LOW_STOCK_THRESHOLD: 10
};

// Utilidades generales
const Utils = {
    // Formatear precio
    formatPrice: function(price) {
        return `${TPV.CURRENCY}${parseFloat(price).toFixed(2)}`;
    },

    // Formatear fecha
    formatDate: function(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    },

    // Mostrar notificación
    showNotification: function(message, type = 'info') {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
        alertDiv.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
        
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.body.appendChild(alertDiv);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.remove();
            }
        }, 5000);
    },

    // Confirmar acción
    confirm: function(message, callback) {
        if (confirm(message)) {
            callback();
        }
    },

    // Validar email
    validateEmail: function(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },

    // Generar código de barras simple
    generateBarcode: function() {
        return Date.now().toString() + Math.random().toString(36).substr(2, 5);
    },

    // Debounce function para búsquedas
    debounce: function(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Loading state
    setLoading: function(element, loading = true) {
        if (loading) {
            element.classList.add('loading');
            element.disabled = true;
        } else {
            element.classList.remove('loading');
            element.disabled = false;
        }
    }
};

// API Helper
const API = {
    // GET request
    get: async function(endpoint) {
        try {
            const response = await fetch(`${TPV.API_BASE}${endpoint}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('API GET Error:', error);
            Utils.showNotification('Error al cargar datos', 'danger');
            throw error;
        }
    },

    // POST request
    post: async function(endpoint, data) {
        try {
            const response = await fetch(`${TPV.API_BASE}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('API POST Error:', error);
            Utils.showNotification('Error al guardar datos', 'danger');
            throw error;
        }
    },

    // PUT request
    put: async function(endpoint, data) {
        try {
            const response = await fetch(`${TPV.API_BASE}${endpoint}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('API PUT Error:', error);
            Utils.showNotification('Error al actualizar datos', 'danger');
            throw error;
        }
    },

    // DELETE request
    delete: async function(endpoint) {
        try {
            const response = await fetch(`${TPV.API_BASE}${endpoint}`, {
                method: 'DELETE'
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('API DELETE Error:', error);
            Utils.showNotification('Error al eliminar datos', 'danger');
            throw error;
        }
    }
};

// Gestión de productos
const ProductManager = {
    // Obtener todos los productos
    getAll: async function() {
        return await API.get('/products');
    },

    // Obtener producto por ID
    getById: async function(id) {
        return await API.get(`/products/${id}`);
    },

    // Buscar producto por código de barras
    getByBarcode: async function(barcode) {
        return await API.get(`/products/barcode/${barcode}`);
    },

    // Crear producto
    create: async function(productData) {
        return await API.post('/products', productData);
    },

    // Actualizar producto
    update: async function(id, productData) {
        return await API.put(`/products/${id}`, productData);
    },

    // Eliminar producto
    delete: async function(id) {
        return await API.delete(`/products/${id}`);
    },

    // Validar datos del producto
    validate: function(productData) {
        const errors = [];
        
        if (!productData.name || productData.name.trim().length === 0) {
            errors.push('El nombre del producto es requerido');
        }
        
        if (!productData.price || productData.price <= 0) {
            errors.push('El precio debe ser mayor a 0');
        }
        
        if (productData.stock < 0) {
            errors.push('El stock no puede ser negativo');
        }
        
        return errors;
    }
};

// Gestión de categorías
const CategoryManager = {
    // Obtener todas las categorías
    getAll: async function() {
        return await API.get('/categories');
    },

    // Crear categoría
    create: async function(categoryData) {
        return await API.post('/categories', categoryData);
    }
};

// Gestión de ventas
const SalesManager = {
    // Obtener todas las ventas
    getAll: async function() {
        return await API.get('/sales');
    },

    // Crear venta
    create: async function(saleData) {
        return await API.post('/sales', saleData);
    },

    // Calcular totales
    calculateTotals: function(items) {
        const subtotal = items.reduce((sum, item) => {
            return sum + (item.price * item.quantity);
        }, 0);
        
        const tax = subtotal * TPV.TAX_RATE;
        const total = subtotal + tax;
        
        return {
            subtotal: subtotal,
            tax: tax,
            total: total
        };
    },

    // Validar venta
    validate: function(saleData) {
        const errors = [];
        
        if (!saleData.items || saleData.items.length === 0) {
            errors.push('La venta debe tener al menos un producto');
        }
        
        if (!saleData.total || saleData.total <= 0) {
            errors.push('El total de la venta debe ser mayor a 0');
        }
        
        return errors;
    }
};

// Funciones de inicialización
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar tooltips de Bootstrap
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function(tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Inicializar popovers de Bootstrap
    const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    popoverTriggerList.map(function(popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
    });

    // Manejar formularios con validación
    const forms = document.querySelectorAll('.needs-validation');
    Array.prototype.slice.call(forms).forEach(function(form) {
        form.addEventListener('submit', function(event) {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
            form.classList.add('was-validated');
        }, false);
    });

    // Auto-focus en campos de búsqueda
    const searchInputs = document.querySelectorAll('input[type="search"], input[placeholder*="buscar"], input[placeholder*="Buscar"]');
    if (searchInputs.length > 0) {
        searchInputs[0].focus();
    }

    // Configurar atajos de teclado
    setupKeyboardShortcuts();
});

// Atajos de teclado
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + N: Nuevo producto (en inventario)
        if ((e.ctrlKey || e.metaKey) && e.key === 'n' && window.location.pathname === '/inventory') {
            e.preventDefault();
            const newProductBtn = document.querySelector('[data-bs-target="#productModal"]');
            if (newProductBtn) newProductBtn.click();
        }

        // F1: Abrir POS
        if (e.key === 'F1') {
            e.preventDefault();
            window.location.href = '/pos';
        }

        // F2: Abrir inventario
        if (e.key === 'F2') {
            e.preventDefault();
            window.location.href = '/inventory';
        }

        // F3: Abrir ventas
        if (e.key === 'F3') {
            e.preventDefault();
            window.location.href = '/sales';
        }

        // Escape: Cerrar modales
        if (e.key === 'Escape') {
            const openModals = document.querySelectorAll('.modal.show');
            openModals.forEach(modal => {
                const modalInstance = bootstrap.Modal.getInstance(modal);
                if (modalInstance) modalInstance.hide();
            });
        }
    });
}

// Storage helpers
const Storage = {
    // Guardar en localStorage
    set: function(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error('Error saving to localStorage:', error);
        }
    },

    // Obtener de localStorage
    get: function(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return defaultValue;
        }
    },

    // Eliminar de localStorage
    remove: function(key) {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error('Error removing from localStorage:', error);
        }
    }
};

// Exportar funciones globales
window.TPV = TPV;
window.Utils = Utils;
window.API = API;
window.ProductManager = ProductManager;
window.CategoryManager = CategoryManager;
window.SalesManager = SalesManager;
window.Storage = Storage;