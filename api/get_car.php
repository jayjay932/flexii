<?php
session_start();
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

try {
    $pdo = new PDO('mysql:host=localhost;dbname=airbnb_clone;charset=utf8', 'root', '', [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);
} catch (PDOException $e) {
    echo json_encode(['error' => 'Erreur connexion BDD']);
    exit;
}

$id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
if (!$id) {
    echo json_encode(['error' => 'Aucun véhicule spécifié']);
    exit;
}

// Véhicule principal
$stmt = $pdo->prepare("SELECT * FROM vehicules WHERE id = ?");
$stmt->execute([$id]);
$vehicle = $stmt->fetch(PDO::FETCH_ASSOC);
if (!$vehicle) {
    echo json_encode(['error' => 'Véhicule introuvable']);
    exit;
}

// Images
$stmtImg = $pdo->prepare("SELECT image_url FROM car_images WHERE vehicule_id = ?");
$stmtImg->execute([$id]);
$images = $stmtImg->fetchAll(PDO::FETCH_COLUMN);

// Hôte (même logique que listings)
$stmtHost = $pdo->prepare("SELECT * FROM hosts WHERE id = ?");
$stmtHost->execute([$vehicle['host_id']]);
$host = $stmtHost->fetch(PDO::FETCH_ASSOC);

// Disponibilités
$stmtDates = $pdo->prepare("SELECT date, is_available FROM availabilities WHERE vehicule_id = ?");
$stmtDates->execute([$id]);
$availabilities = $stmtDates->fetchAll(PDO::FETCH_ASSOC);

// Commentaires
$stmtCount = $pdo->prepare("SELECT COUNT(*) FROM comments WHERE vehicule_id = ?");
$stmtCount->execute([$id]);
$totalEvaluations = $stmtCount->fetchColumn();

$stmtAvg = $pdo->prepare("SELECT AVG(rating) FROM comments WHERE vehicule_id = ?");
$stmtAvg->execute([$id]);
$averageRating = $stmtAvg->fetchColumn();

echo json_encode([
    'vehicle' => $vehicle,
    'images' => $images,
    'host' => $host,
    'availabilities' => $availabilities,
    'totalEvaluations' => $totalEvaluations,
    'averageRating' => round($averageRating, 2)
]);
