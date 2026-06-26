<?php
require_once __DIR__ . '/helpers.php';

$db = Database::getConnection();
$stmt = $db->query('SELECT id, slug, name_en, name_ar, image FROM categories ORDER BY sort_order');
jsonResponse($stmt->fetchAll());
