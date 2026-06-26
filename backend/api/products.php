<?php
require_once __DIR__ . '/helpers.php';

$db = Database::getConnection();

if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['id'])) {
    $stmt = $db->prepare('SELECT p.*, c.slug as category FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.id = ? AND p.is_active = 1');
    $stmt->execute([(int)$_GET['id']]);
    $product = $stmt->fetch();
    if (!$product) jsonResponse(['message' => 'Product not found'], 404);
    jsonResponse($product);
}

$category = $_GET['category'] ?? null;
$search = $_GET['search'] ?? null;

$sql = 'SELECT p.id, p.name, p.description, p.price, p.image, p.stock, p.rating, c.slug as category FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.is_active = 1';
$params = [];

if ($category) {
    $sql .= ' AND c.slug = ?';
    $params[] = $category;
}
if ($search) {
    $sql .= ' AND p.name LIKE ?';
    $params[] = "%$search%";
}

$sql .= ' ORDER BY p.created_at DESC';
$stmt = $db->prepare($sql);
$stmt->execute($params);
jsonResponse($stmt->fetchAll());
