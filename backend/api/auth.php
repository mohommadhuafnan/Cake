<?php
require_once __DIR__ . '/helpers.php';

$db = Database::getConnection();
$action = $_GET['action'] ?? '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $body = getJsonBody();

    if ($action === 'register') {
        $name = sanitize($body['name'] ?? '');
        $email = filter_var($body['email'] ?? '', FILTER_VALIDATE_EMAIL);
        $password = $body['password'] ?? '';

        if (!$name || !$email || strlen($password) < 6) {
            jsonResponse(['message' => 'Invalid input'], 400);
        }

        $hash = password_hash($password, PASSWORD_BCRYPT);
        try {
            $stmt = $db->prepare('INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)');
            $stmt->execute([$name, $email, $hash]);
            $userId = $db->lastInsertId();
            jsonResponse([
                'token' => generateToken($userId, $email),
                'user' => ['id' => $userId, 'name' => $name, 'email' => $email],
            ], 201);
        } catch (PDOException $e) {
            jsonResponse(['message' => 'Email already registered'], 409);
        }
    }

    if ($action === 'login') {
        $email = filter_var($body['email'] ?? '', FILTER_VALIDATE_EMAIL);
        $password = $body['password'] ?? '';

        $stmt = $db->prepare('SELECT id, name, email, password_hash FROM users WHERE email = ?');
        $stmt->execute([$email]);
        $user = $stmt->fetch();

        if (!$user || !password_verify($password, $user['password_hash'])) {
            jsonResponse(['message' => 'Invalid credentials'], 401);
        }

        jsonResponse([
            'token' => generateToken($user['id'], $user['email']),
            'user' => ['id' => $user['id'], 'name' => $user['name'], 'email' => $user['email']],
        ]);
    }
}

jsonResponse(['message' => 'Invalid action'], 400);
