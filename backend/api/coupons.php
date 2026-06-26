<?php
require_once __DIR__ . '/helpers.php';

$db = Database::getConnection();

if (isset($_GET['code'])) {
    $code = strtoupper(sanitize($_GET['code']));
    $stmt = $db->prepare('SELECT * FROM coupons WHERE code = ? AND is_active = 1 AND (expires_at IS NULL OR expires_at > NOW())');
    $stmt->execute([$code]);
    $coupon = $stmt->fetch();
    if (!$coupon) jsonResponse(['message' => 'Invalid coupon'], 404);
    if ($coupon['max_uses'] && $coupon['used_count'] >= $coupon['max_uses']) {
        jsonResponse(['message' => 'Coupon expired'], 410);
    }
    jsonResponse(['code' => $coupon['code'], 'type' => $coupon['type'], 'value' => (float)$coupon['value']]);
}

jsonResponse(['message' => 'Code required'], 400);
