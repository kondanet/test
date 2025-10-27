<?php
require_once '../config.php';

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

$method = $_SERVER['REQUEST_METHOD'];
$pdo = getDBConnection();

switch ($method) {
    case 'GET':
        if (isset($_GET['id'])) {
            // Obtener producto por ID
            $stmt = $pdo->prepare("SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.id = ?");
            $stmt->execute([$_GET['id']]);
            $product = $stmt->fetch();
            
            if ($product) {
                jsonResponse($product);
            } else {
                jsonResponse(['error' => 'Producto no encontrado'], 404);
            }
        } elseif (isset($_GET['barcode'])) {
            // Obtener producto por código de barras
            $stmt = $pdo->prepare("SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.barcode = ?");
            $stmt->execute([$_GET['barcode']]);
            $product = $stmt->fetch();
            
            if ($product) {
                jsonResponse($product);
            } else {
                jsonResponse(['error' => 'Producto no encontrado'], 404);
            }
        } else {
            // Obtener todos los productos
            $stmt = $pdo->query("SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id ORDER BY p.name");
            $products = $stmt->fetchAll();
            jsonResponse($products);
        }
        break;
        
    case 'POST':
        $input = json_decode(file_get_contents('php://input'), true);
        $errors = validateInput($input, ['name', 'price']);
        
        if (!empty($errors)) {
            jsonResponse(['errors' => $errors], 400);
        }
        
        try {
            $stmt = $pdo->prepare("INSERT INTO products (name, description, price, stock, barcode, category_id) VALUES (?, ?, ?, ?, ?, ?)");
            $stmt->execute([
                $input['name'],
                $input['description'] ?? '',
                $input['price'],
                $input['stock'] ?? 0,
                $input['barcode'] ?? null,
                $input['category_id'] ?? null
            ]);
            
            $productId = $pdo->lastInsertId();
            $stmt = $pdo->prepare("SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.id = ?");
            $stmt->execute([$productId]);
            $product = $stmt->fetch();
            
            jsonResponse($product, 201);
        } catch (PDOException $e) {
            jsonResponse(['error' => 'Error al crear producto: ' . $e->getMessage()], 500);
        }
        break;
        
    case 'PUT':
        if (!isset($_GET['id'])) {
            jsonResponse(['error' => 'ID de producto requerido'], 400);
        }
        
        $input = json_decode(file_get_contents('php://input'), true);
        
        try {
            $stmt = $pdo->prepare("UPDATE products SET name = ?, description = ?, price = ?, stock = ?, barcode = ?, category_id = ? WHERE id = ?");
            $stmt->execute([
                $input['name'],
                $input['description'] ?? '',
                $input['price'],
                $input['stock'] ?? 0,
                $input['barcode'] ?? null,
                $input['category_id'] ?? null,
                $_GET['id']
            ]);
            
            if ($stmt->rowCount() > 0) {
                $stmt = $pdo->prepare("SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.id = ?");
                $stmt->execute([$_GET['id']]);
                $product = $stmt->fetch();
                jsonResponse($product);
            } else {
                jsonResponse(['error' => 'Producto no encontrado'], 404);
            }
        } catch (PDOException $e) {
            jsonResponse(['error' => 'Error al actualizar producto: ' . $e->getMessage()], 500);
        }
        break;
        
    case 'DELETE':
        if (!isset($_GET['id'])) {
            jsonResponse(['error' => 'ID de producto requerido'], 400);
        }
        
        try {
            $stmt = $pdo->prepare("DELETE FROM products WHERE id = ?");
            $stmt->execute([$_GET['id']]);
            
            if ($stmt->rowCount() > 0) {
                jsonResponse(['message' => 'Producto eliminado correctamente']);
            } else {
                jsonResponse(['error' => 'Producto no encontrado'], 404);
            }
        } catch (PDOException $e) {
            jsonResponse(['error' => 'Error al eliminar producto: ' . $e->getMessage()], 500);
        }
        break;
        
    default:
        jsonResponse(['error' => 'Método no permitido'], 405);
}
?>