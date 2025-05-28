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

// Utilise cache APCu si disponible
$cacheKey = "vehicule_detail_$id";
$cacheTTL = 60; // secondes

if (function_exists('apcu_fetch') && apcu_exists($cacheKey)) {
    echo apcu_fetch($cacheKey);
    exit;
}

try {
    // Listing principal
    $stmt = $pdo->prepare("SELECT * FROM vehicules WHERE id = ?");
    $stmt->execute([$id]);
    $listing = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$listing) {
        echo json_encode(['error' => 'Logement introuvable']);
        exit;
    }

    // Images
    $stmtImg = $pdo->prepare("SELECT image_url FROM car_images WHERE vehicule_id = ?");
    $stmtImg->execute([$id]);
    $images = $stmtImg->fetchAll(PDO::FETCH_COLUMN);

    // Host
    $stmtHost = $pdo->prepare("SELECT * FROM hosts WHERE id = ?");
    $stmtHost->execute([$listing['host_id']]);
    $host = $stmtHost->fetch(PDO::FETCH_ASSOC);

    // Disponibilités
    $stmtDates = $pdo->prepare("SELECT date, is_available FROM availabilities_cars WHERE vehicule_id = ?");
    $stmtDates->execute([$id]);
    $availabilities = $stmtDates->fetchAll(PDO::FETCH_ASSOC);

    // Statistiques
    $stmtCount = $pdo->prepare("SELECT COUNT(*) FROM car_comments WHERE vehicule_id = ?");
    $stmtCount->execute([$id]);
    $totalEvaluations = $stmtCount->fetchColumn();

    $stmtAvg = $pdo->prepare("SELECT AVG(rating) FROM car_comments WHERE vehicule_id = ?");
    $stmtAvg->execute([$id]);
    $averageRating = $stmtAvg->fetchColumn();

    // Assemblage
    $listing['images'] = $images;
    $listing['host'] = $host;
    $listing['availabilities'] = $availabilities;
    $listing['totalEvaluations'] = $totalEvaluations;
    $listing['averageRating'] = round($averageRating, 2);

    $json = json_encode($listing);
    if (function_exists('apcu_store')) {
        apcu_store($cacheKey, $json, $cacheTTL);
    }

    echo $json;

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
