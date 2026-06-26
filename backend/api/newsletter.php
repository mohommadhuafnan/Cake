<?php
require_once __DIR__ . '/helpers.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $body = getJsonBody();
    $email = filter_var($body['email'] ?? '', FILTER_VALIDATE_EMAIL);
    if (!$email) jsonResponse(['message' => 'Invalid email'], 400);

    $db = Database::getConnection();
    try {
        $stmt = $db->prepare('INSERT INTO newsletter_subscribers (email) VALUES (?)');
        $stmt->execute([$email]);
    } catch (PDOException $e) {
        /* already subscribed */
    }
    jsonResponse(['message' => 'Subscribed']);
}

jsonResponse(['message' => 'Method not allowed'], 405);
