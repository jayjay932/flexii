<?php
// get_favorites.php

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

$pdo = new PDO('mysql:host=localhost;dbname=airbnb_clone;charset=utf8', 'root', '', [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
]);

$user_id = isset($_GET['user_id']) ? intval($_GET['user_id']) : 0;

if ($user_id === 0) {
    echo json_encode(['success' => false, 'message' => 'ID utilisateur manquant']);
    exit;
}

$stmt = $pdo->prepare("
    SELECT l.id, l.title, l.price_per_night
    FROM favorites f
    JOIN listings l ON f.listing_id = l.id
    WHERE f.user_id = ?
");
$stmt->execute([$user_id]);
$listings = $stmt->fetchAll(PDO::FETCH_ASSOC);

foreach ($listings as &$listing) {
    $imgStmt = $pdo->prepare("SELECT image_url FROM listing_images WHERE listing_id = ?");
    $imgStmt->execute([$listing['id']]);
    $listing['images'] = $imgStmt->fetchAll(PDO::FETCH_COLUMN);
}

echo json_encode(['success' => true, 'favoris' => $listings]);
