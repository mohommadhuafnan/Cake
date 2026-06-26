<?php
require_once __DIR__ . '/helpers.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $body = getJsonBody();
    $db = Database::getConnection();
    $stmt = $db->prepare('INSERT INTO contact_messages (name, email, message) VALUES (?, ?, ?)');
    $stmt->execute([
        sanitize($body['name'] ?? ''),
        filter_var($body['email'] ?? '', FILTER_VALIDATE_EMAIL) ?: '',
        sanitize($body['message'] ?? ''),
    ]);
    jsonResponse(['message' => 'Message sent'], 201);
}

jsonResponse(['message' => 'Method not allowed'], 405);
