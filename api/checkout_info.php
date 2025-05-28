<?php
// checkout_info.php

session_start();

// CORS — autorise ton front et l’envoi des cookies
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Si c’est une préflight OPTIONS, on renvoie sans exécuter la logique métier
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

try {
    $pdo = new PDO('mysql:host=localhost;dbname=airbnb_clone;charset=utf8', 'root', '');
    if (!isset($_GET['id'], $_GET['start_date'], $_GET['end_date'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Paramètres manquants.']);
        exit;
    }

    $id    = (int) $_GET['id'];
    $start = DateTime::createFromFormat('Y-m-d', $_GET['start_date']);
    $end   = DateTime::createFromFormat('Y-m-d', $_GET['end_date']);

    // Récupérer les infos du logement
    $stmt = $pdo->prepare('SELECT * FROM listings WHERE id = ?');
    $stmt->execute([$id]);
    $listing = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$listing) {
        http_response_code(404);
        echo json_encode(['error' => 'Logement introuvable.']);
        exit;
    }

    // Image principale
    $stmtImg = $pdo->prepare(
        'SELECT image_url FROM listing_images WHERE listing_id = ? LIMIT 1'
    );
    $stmtImg->execute([$id]);
    $mainImage = $stmtImg->fetchColumn() ?: '';

    // Calcul du nombre de nuits et du total
    $nbNuits    = $start->diff($end)->days;
    $totalPrice = $nbNuits * $listing['price_per_night'];

    echo json_encode([
        'listing'    => $listing,
        'mainImage'  => $mainImage,
        'nbNuits'    => $nbNuits,
        'totalPrice' => $totalPrice
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
