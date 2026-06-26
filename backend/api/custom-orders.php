<?php
require_once __DIR__ . '/helpers.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $body = getJsonBody();
    $db = Database::getConnection();
    $stmt = $db->prepare('INSERT INTO custom_cake_orders (customer_name, customer_email, customer_phone, cake_size, flavor, design_description, delivery_date, special_notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
    $stmt->execute([
        sanitize($body['name'] ?? ''),
        filter_var($body['email'] ?? '', FILTER_VALIDATE_EMAIL) ?: '',
        sanitize($body['phone'] ?? ''),
        sanitize($body['size'] ?? ''),
        sanitize($body['flavor'] ?? ''),
        sanitize($body['design'] ?? ''),
        $body['date'] ?? date('Y-m-d'),
        sanitize($body['notes'] ?? ''),
    ]);
    jsonResponse(['message' => 'Custom order submitted'], 201);
}

jsonResponse(['message' => 'Method not allowed'], 405);
