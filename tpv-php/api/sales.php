<?php
require_once '../config.php';

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type');

$method = $_SERVER['REQUEST_METHOD'];
$pdo = getDBConnection();

switch ($method) {
    case 'GET':
        try {
            // Obtener todas las ventas con sus items
            $stmt = $pdo->query("
                SELECT s.*, 
                       COUNT(si.id) as item_count,
                       GROUP_CONCAT(
                           CONCAT(p.name, ' (', si.quantity, 'x', si.unit_price, ')')
                           SEPARATOR ', '
                       ) as items_summary
                FROM sales s 
                LEFT JOIN sale_items si ON s.id = si.sale_id 
                LEFT JOIN products p ON si.product_id = p.id 
                GROUP BY s.id 
                ORDER BY s.created_at DESC
            ");
            
            $sales = $stmt->fetchAll();
            
            // Para cada venta, obtener los items detallados
            foreach ($sales as &$sale) {
                $stmt = $pdo->prepare("
                    SELECT si.*, p.name as product_name 
                    FROM sale_items si 
                    JOIN products p ON si.product_id = p.id 
                    WHERE si.sale_id = ?
                ");
                $stmt->execute([$sale['id']]);
                $sale['items'] = $stmt->fetchAll();
            }
            
            jsonResponse($sales);
        } catch (PDOException $e) {
            jsonResponse(['error' => 'Error al obtener ventas: ' . $e->getMessage()], 500);
        }
        break;
        
    case 'POST':
        $input = json_decode(file_get_contents('php://input'), true);
        $errors = validateInput($input, ['total', 'items']);
        
        if (!empty($errors)) {
            jsonResponse(['errors' => $errors], 400);
        }
        
        if (empty($input['items'])) {
            jsonResponse(['error' => 'La venta debe tener al menos un producto'], 400);
        }
        
        try {
            $pdo->beginTransaction();
            
            // Crear la venta
            $stmt = $pdo->prepare("INSERT INTO sales (total, payment_method) VALUES (?, ?)");
            $stmt->execute([
                $input['total'],
                $input['payment_method'] ?? 'efectivo'
            ]);
            
            $saleId = $pdo->lastInsertId();
            
            // Procesar cada item
            $itemStmt = $pdo->prepare("INSERT INTO sale_items (sale_id, product_id, quantity, unit_price, subtotal) VALUES (?, ?, ?, ?, ?)");
            $updateStockStmt = $pdo->prepare("UPDATE products SET stock = stock - ? WHERE id = ? AND stock >= ?");
            
            foreach ($input['items'] as $item) {
                // Verificar stock disponible
                $stockStmt = $pdo->prepare("SELECT stock FROM products WHERE id = ?");
                $stockStmt->execute([$item['product_id']]);
                $currentStock = $stockStmt->fetchColumn();
                
                if ($currentStock < $item['quantity']) {
                    $pdo->rollBack();
                    jsonResponse(['error' => "Stock insuficiente para el producto ID: {$item['product_id']}"], 400);
                }
                
                // Obtener precio actual del producto
                $priceStmt = $pdo->prepare("SELECT price FROM products WHERE id = ?");
                $priceStmt->execute([$item['product_id']]);
                $unitPrice = $priceStmt->fetchColumn();
                
                $subtotal = $unitPrice * $item['quantity'];
                
                // Insertar item de venta
                $itemStmt->execute([
                    $saleId,
                    $item['product_id'],
                    $item['quantity'],
                    $unitPrice,
                    $subtotal
                ]);
                
                // Actualizar stock
                $updateStockStmt->execute([
                    $item['quantity'],
                    $item['product_id'],
                    $item['quantity']
                ]);
            }
            
            $pdo->commit();
            
            // Obtener la venta creada
            $stmt = $pdo->prepare("SELECT * FROM sales WHERE id = ?");
            $stmt->execute([$saleId]);
            $sale = $stmt->fetch();
            
            jsonResponse([
                'id' => $sale['id'],
                'total' => $sale['total'],
                'payment_method' => $sale['payment_method'],
                'created_at' => $sale['created_at'],
                'message' => 'Venta procesada correctamente'
            ], 201);
            
        } catch (PDOException $e) {
            $pdo->rollBack();
            jsonResponse(['error' => 'Error al procesar venta: ' . $e->getMessage()], 500);
        }
        break;
        
    default:
        jsonResponse(['error' => 'Método no permitido'], 405);
}
?>