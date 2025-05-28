<?php
// Fichier : api/get_host_listings.php
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');
session_start();

try {
    $pdo = new PDO('mysql:host=localhost;dbname=airbnb_clone;charset=utf8mb4', 'root', '', [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);

    // Pour test, on utilise un ID fixe
    $hostId = 1;

    $stmt = $pdo->prepare("SELECT * FROM listings WHERE host_id = ?");
    $stmt->execute([$hostId]);
    $listings = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (empty($listings)) {
        echo json_encode([]);
        exit;
    }

    // Récupérer les images
    $ids = array_column($listings, 'id');
    $placeholders = implode(',', array_fill(0, count($ids), '?'));

    $stmtImg = $pdo->prepare("SELECT listing_id, image_url FROM listing_images WHERE listing_id IN ($placeholders)");
    $stmtImg->execute($ids);

    $imagesByListing = [];
    foreach ($stmtImg as $row) {
        $imagesByListing[$row['listing_id']][] = $row['image_url'];
    }

    // Fusionner images dans chaque listing
    foreach ($listings as &$listing) {
        $listing['images'] = $imagesByListing[$listing['id']] ?? [];
    }

    echo json_encode($listings);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
