<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TPV Sistema - XAMPP</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <style>
        body { background-color: #f5f5f5; }
        .card { border: none; box-shadow: 0 2px 4px rgba(0,0,0,0.1); border-radius: 10px; }
        .navbar-brand { font-weight: bold; }
        .product-card { cursor: pointer; transition: all 0.2s ease; }
        .product-card:hover { transform: translateY(-2px); box-shadow: 0 4px 8px rgba(0,0,0,0.15); }
        .cart-item { background-color: #f8f9fa; border-radius: 8px; }
        .stats-card { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; }
    </style>
</head>
<body>
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
        <div class="container">
            <a class="navbar-brand" href="index.php">
                <i class="fas fa-cash-register me-2"></i>TPV Sistema - XAMPP
            </a>
            <div class="navbar-nav ms-auto">
                <a class="nav-link" href="pos.php">
                    <i class="fas fa-shopping-cart me-1"></i>Punto de Venta
                </a>
                <a class="nav-link" href="inventory.php">
                    <i class="fas fa-boxes me-1"></i>Inventario
                </a>
                <a class="nav-link" href="sales.php">
                    <i class="fas fa-chart-bar me-1"></i>Ventas
                </a>
            </div>
        </div>
    </nav>

    <div class="container mt-4">
        <div class="row">
            <div class="col-12">
                <h1 class="mb-4">
                    <i class="fas fa-tachometer-alt me-2"></i>Dashboard TPV
                </h1>
            </div>
        </div>

        <div class="row mb-4">
            <div class="col-md-3 mb-3">
                <div class="card bg-primary text-white">
                    <div class="card-body">
                        <div class="d-flex justify-content-between">
                            <div>
                                <h4 class="card-title">Ventas Hoy</h4>
                                <h2 id="sales-today">$0.00</h2>
                                <small id="today-count">0 transacciones</small>
                            </div>
                            <div class="align-self-center">
                                <i class="fas fa-dollar-sign fa-2x"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-3 mb-3">
                <div class="card bg-success text-white">
                    <div class="card-body">
                        <div class="d-flex justify-content-between">
                            <div>
                                <h4 class="card-title">Productos</h4>
                                <h2 id="total-products">0</h2>
                            </div>
                            <div class="align-self-center">
                                <i class="fas fa-box fa-2x"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-3 mb-3">
                <div class="card bg-warning text-white">
                    <div class="card-body">
                        <div class="d-flex justify-content-between">
                            <div>
                                <h4 class="card-title">Stock Bajo</h4>
                                <h2 id="low-stock">0</h2>
                            </div>
                            <div class="align-self-center">
                                <i class="fas fa-exclamation-triangle fa-2x"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-3 mb-3">
                <div class="card bg-info text-white">
                    <div class="card-body">
                        <div class="d-flex justify-content-between">
                            <div>
                                <h4 class="card-title">Transacciones</h4>
                                <h2 id="total-transactions">0</h2>
                            </div>
                            <div class="align-self-center">
                                <i class="fas fa-receipt fa-2x"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="row mb-4">
            <div class="col-md-6 mb-3">
                <div class="card">
                    <div class="card-header">
                        <h5><i class="fas fa-rocket me-2"></i>Acciones Rápidas</h5>
                    </div>
                    <div class="card-body">
                        <div class="d-grid gap-2">
                            <a href="pos.php" class="btn btn-primary btn-lg">
                                <i class="fas fa-cash-register me-2"></i>Abrir Punto de Venta
                            </a>
                            <a href="inventory.php" class="btn btn-success">
                                <i class="fas fa-plus me-2"></i>Gestionar Inventario
                            </a>
                            <a href="sales.php" class="btn btn-info">
                                <i class="fas fa-chart-line me-2"></i>Ver Reportes
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-6 mb-3">
                <div class="card">
                    <div class="card-header">
                        <h5><i class="fas fa-clock me-2"></i>Ventas Recientes</h5>
                    </div>
                    <div class="card-body">
                        <div id="recent-sales" class="list-group list-group-flush">
                            <div class="text-center text-muted">Cargando ventas recientes...</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-12">
                <div class="card">
                    <div class="card-header">
                        <h5><i class="fas fa-exclamation-circle me-2"></i>Productos con Stock Bajo</h5>
                    </div>
                    <div class="card-body">
                        <div class="table-responsive">
                            <table class="table table-striped">
                                <thead>
                                    <tr>
                                        <th>Producto</th>
                                        <th>Stock Actual</th>
                                        <th>Precio</th>
                                        <th>Categoría</th>
                                    </tr>
                                </thead>
                                <tbody id="low-stock-table">
                                    <tr><td colspan="4" class="text-center text-muted">Cargando productos...</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script>
        // Configuración de la API
        const API_BASE = 'api';

        document.addEventListener('DOMContentLoaded', function() {
            loadDashboardData();
        });

        async function loadDashboardData() {
            try {
                // Cargar productos
                const products = await fetch(`${API_BASE}/products.php`).then(r => r.json());
                document.getElementById('total-products').textContent = products.length;
                
                // Productos con stock bajo
                const lowStockProducts = products.filter(p => p.stock < 10);
                document.getElementById('low-stock').textContent = lowStockProducts.length;
                
                // Mostrar productos con stock bajo
                const lowStockTable = document.getElementById('low-stock-table');
                lowStockTable.innerHTML = '';
                
                if (lowStockProducts.length === 0) {
                    lowStockTable.innerHTML = '<tr><td colspan="4" class="text-center text-muted">No hay productos con stock bajo</td></tr>';
                } else {
                    lowStockProducts.forEach(product => {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td>${product.name}</td>
                            <td><span class="badge bg-warning">${product.stock}</span></td>
                            <td>$${parseFloat(product.price).toFixed(2)}</td>
                            <td>${product.category_name || 'Sin categoría'}</td>
                        `;
                        lowStockTable.appendChild(row);
                    });
                }

                // Cargar ventas
                const sales = await fetch(`${API_BASE}/sales.php`).then(r => r.json());
                document.getElementById('total-transactions').textContent = sales.length;
                
                // Calcular ventas de hoy
                const today = new Date().toISOString().split('T')[0];
                const todaySales = sales.filter(sale => sale.created_at.startsWith(today));
                const todayTotal = todaySales.reduce((sum, sale) => sum + parseFloat(sale.total), 0);
                document.getElementById('sales-today').textContent = `$${todayTotal.toFixed(2)}`;
                document.getElementById('today-count').textContent = `${todaySales.length} transacciones`;
                
                // Mostrar ventas recientes
                const recentSales = document.getElementById('recent-sales');
                recentSales.innerHTML = '';
                
                const recentSalesList = sales.slice(0, 5);
                if (recentSalesList.length === 0) {
                    recentSales.innerHTML = '<div class="text-center text-muted">No hay ventas recientes</div>';
                } else {
                    recentSalesList.forEach(sale => {
                        const saleDate = new Date(sale.created_at).toLocaleString();
                        const saleElement = document.createElement('div');
                        saleElement.className = 'list-group-item d-flex justify-content-between align-items-center';
                        saleElement.innerHTML = `
                            <div>
                                <strong>Venta #${sale.id}</strong><br>
                                <small class="text-muted">${saleDate}</small>
                            </div>
                            <span class="badge bg-primary rounded-pill">$${parseFloat(sale.total).toFixed(2)}</span>
                        `;
                        recentSales.appendChild(saleElement);
                    });
                }
                
            } catch (error) {
                console.error('Error loading dashboard data:', error);
            }
        }
    </script>
</body>
</html>