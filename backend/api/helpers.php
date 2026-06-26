<?php
function loadEnv($path) {
    if (!file_exists($path)) return;
    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (str_starts_with(trim($line), '#')) continue;
        [$key, $value] = explode('=', $line, 2);
        $_ENV[trim($key)] = trim($value, " \t\n\r\0\x0B\"'");
    }
}

loadEnv(__DIR__ . '/../.env');
require_once __DIR__ . '/../config/database.php';

function jsonResponse($data, $code = 200) {
    http_response_code($code);
    header('Content-Type: application/json; charset=utf-8');
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-CSRF-Token');
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

function getJsonBody() {
    return json_decode(file_get_contents('php://input'), true) ?? [];
}

function sanitize($str) {
    return htmlspecialchars(strip_tags(trim($str)), ENT_QUOTES, 'UTF-8');
}

function generateToken($userId, $email) {
    $secret = $_ENV['JWT_SECRET'] ?? 'change-me-in-production';
    $payload = base64_encode(json_encode([
        'sub' => $userId,
        'email' => $email,
        'exp' => time() + 86400,
        'iat' => time(),
    ]));
    $sig = hash_hmac('sha256', $payload, $secret);
    return "$payload.$sig";
}

function verifyToken() {
    $header = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    if (!str_starts_with($header, 'Bearer ')) return null;
    $token = substr($header, 7);
    [$payload, $sig] = explode('.', $token, 2);
    $secret = $_ENV['JWT_SECRET'] ?? 'change-me-in-production';
    if (!hash_equals(hash_hmac('sha256', $payload, $secret), $sig)) return null;
    $data = json_decode(base64_decode($payload), true);
    if ($data['exp'] < time()) return null;
    return $data;
}

function generateOrderNumber() {
    return 'MD' . date('ymd') . strtoupper(substr(uniqid(), -4));
}

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    jsonResponse(['ok' => true]);
}
