<?php
// Configuración de la base de datos para TPV
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'tpv_sistema');

// Configuración del sistema
define('TAX_RATE', 0.16); // 16% de impuestos
define('CURRENCY', '$');
define('LOW_STOCK_THRESHOLD', 10);

// Conexión a la base de datos
function getDBConnection() {
    try {
        $pdo = new PDO(
            "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4",
            DB_USER,
            DB_PASS,
            [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
            ]
        );
        return $pdo;
    } catch (PDOException $e) {
        die("Error de conexión: " . $e->getMessage());
    }
}

// Función para crear las tablas si no existen
function createTables() {
    $pdo = getDBConnection();
    
    // Tabla de categorías
    $pdo->exec("CREATE TABLE IF NOT EXISTS categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(50) NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )");
    
    // Tabla de productos
    $pdo->exec("CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        price DECIMAL(10,2) NOT NULL,
        stock INT DEFAULT 0,
        barcode VARCHAR(50) UNIQUE,
        category_id INT,
        image_url VARCHAR(200),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES categories(id)
    )");
    
    // Tabla de ventas
    $pdo->exec("CREATE TABLE IF NOT EXISTS sales (
        id INT AUTO_INCREMENT PRIMARY KEY,
        total DECIMAL(10,2) NOT NULL,
        payment_method VARCHAR(20) DEFAULT 'efectivo',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )");
    
    // Tabla de items de venta
    $pdo->exec("CREATE TABLE IF NOT EXISTS sale_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        sale_id INT NOT NULL,
        product_id INT NOT NULL,
        quantity INT NOT NULL,
        unit_price DECIMAL(10,2) NOT NULL,
        subtotal DECIMAL(10,2) NOT NULL,
        FOREIGN KEY (sale_id) REFERENCES sales(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id)
    )");
    
    // Insertar datos de ejemplo si no existen
    insertSampleData($pdo);
}

function insertSampleData($pdo) {
    // Verificar si ya hay datos
    $stmt = $pdo->query("SELECT COUNT(*) FROM categories");
    if ($stmt->fetchColumn() > 0) return;
    
    // Insertar categorías
    $categories = ['Bebidas', 'Comida', 'Snacks', 'Limpieza', 'Otros'];
    $stmt = $pdo->prepare("INSERT INTO categories (name) VALUES (?)");
    foreach ($categories as $category) {
        $stmt->execute([$category]);
    }
    
    // Insertar productos de ejemplo
    $products = [
        ['Coca Cola 500ml', '', 2.50, 50, '7501055300006', 1],
        ['Agua Natural 1L', '', 1.00, 100, '7501055300007', 1],
        ['Pan Integral', '', 3.50, 20, '7501055300008', 2],
        ['Leche Entera 1L', '', 4.20, 30, '7501055300009', 1],
        ['Huevos 12 piezas', '', 6.50, 25, '7501055300010', 2],
        ['Jabón Líquido', 'Jabón para manos', 2.80, 15, '7501055300011', 4],
        ['Papas Fritas', 'Bolsa grande', 1.75, 40, '7501055300012', 3],
        ['Yogurt Natural', 'Pack de 4', 3.20, 35, '7501055300013', 2]
    ];
    
    $stmt = $pdo->prepare("INSERT INTO products (name, description, price, stock, barcode, category_id) VALUES (?, ?, ?, ?, ?, ?)");
    foreach ($products as $product) {
        $stmt->execute($product);
    }
}

// Función para responder JSON
function jsonResponse($data, $status = 200) {
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

// Función para validar entrada
function validateInput($data, $required = []) {
    $errors = [];
    
    foreach ($required as $field) {
        if (!isset($data[$field]) || empty(trim($data[$field]))) {
            $errors[] = "El campo '$field' es requerido";
        }
    }
    
    return $errors;
}

// Inicializar base de datos
createTables();
?>