<?php
require_once __DIR__ . '/helpers.php';

$db = Database::getConnection();

if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['track'])) {
    $orderNum = sanitize($_GET['track']);
    $stmt = $db->prepare('SELECT order_number, status, created_at FROM orders WHERE order_number = ?');
    $stmt->execute([$orderNum]);
    $order = $stmt->fetch();
    if (!$order) jsonResponse(['message' => 'Order not found'], 404);
    jsonResponse($order);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $body = getJsonBody();
    $orderNumber = generateOrderNumber();

    $stmt = $db->prepare('INSERT INTO orders (order_number, customer_name, customer_email, customer_phone, shipping_address, city, subtotal, total, payment_method, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
    $stmt->execute([
        $orderNumber,
        sanitize($body['name'] ?? ''),
        filter_var($body['email'] ?? '', FILTER_VALIDATE_EMAIL) ?: '',
        sanitize($body['phone'] ?? ''),
        sanitize($body['address'] ?? ''),
        sanitize($body['city'] ?? 'Doha'),
        (float)($body['total'] ?? 0),
        (float)($body['total'] ?? 0),
        sanitize($body['payment'] ?? 'card'),
        'pending',
    ]);

    $orderId = $db->lastInsertId();

    foreach ($body['items'] ?? [] as $item) {
        $stmt = $db->prepare('INSERT INTO order_items (order_id, product_id, product_name, quantity, unit_price, total_price) VALUES (?, ?, ?, ?, ?, ?)');
        $stmt->execute([
            $orderId,
            $item['id'] ?? null,
            sanitize($item['name']['en'] ?? $item['name'] ?? 'Product'),
            (int)($item['quantity'] ?? 1),
            (float)($item['price'] ?? 0),
            (float)(($item['price'] ?? 0) * ($item['quantity'] ?? 1)),
        ]);
    }

    $db->prepare('INSERT INTO delivery_tracking (order_id, status) VALUES (?, ?)')->execute([$orderId, 'pending']);

    jsonResponse(['order_number' => $orderNumber, 'status' => 'pending'], 201);
}

jsonResponse(['message' => 'Method not allowed'], 405);
