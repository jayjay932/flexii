<?php

session_start();
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$pdo = new PDO('mysql:host=localhost;dbname=airbnb_clone;charset=utf8', 'root', '', [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
]);

$id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
if (!$id) {
    echo json_encode(['error' => 'Aucun logement spécifié']);
    exit;
}

// Listing principal
$stmt = $pdo->prepare("SELECT * FROM listings WHERE id = ?");
$stmt->execute([$id]);
$listing = $stmt->fetch(PDO::FETCH_ASSOC);
if (!$listing) {
    echo json_encode(['error' => 'Logement introuvable']);
    exit;
}

// Images
$stmtImg = $pdo->prepare("SELECT image_url FROM listing_images WHERE listing_id = ?");
$stmtImg->execute([$id]);
$images = $stmtImg->fetchAll(PDO::FETCH_COLUMN);

// Host
$stmtHost = $pdo->prepare("SELECT * FROM hosts WHERE id = ?");
$stmtHost->execute([$listing['host_id']]);
$host = $stmtHost->fetch(PDO::FETCH_ASSOC);

// Disponibilités
$stmtDates = $pdo->prepare("SELECT date, is_available FROM availabilities WHERE listing_id = ?");
$stmtDates->execute([$id]);
$availabilities = $stmtDates->fetchAll(PDO::FETCH_ASSOC);

// Statistiques
$stmtCount = $pdo->prepare("SELECT COUNT(*) FROM comments WHERE listing_id = ?");
$stmtCount->execute([$id]);
$totalEvaluations = $stmtCount->fetchColumn();

$stmtAvg = $pdo->prepare("SELECT AVG(rating) FROM comments WHERE listing_id = ?");
$stmtAvg->execute([$id]);
$averageRating = $stmtAvg->fetchColumn();

echo json_encode([
    'listing' => $listing,
    'images' => $images,
    'host' => $host,
    'availabilities' => $availabilities,
    'totalEvaluations' => $totalEvaluations,
    'averageRating' => round($averageRating, 2),
]);
