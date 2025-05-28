<?php
// Fichier : api/get_reserved_listings_by_host.php
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');
session_start();

try {
    $pdo = new PDO("mysql:host=localhost;dbname=airbnb_clone;charset=utf8mb4", "root", "", [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);

    if (!isset($_SESSION['host_id'])) {
        http_response_code(401);
        echo json_encode(["error" => "Non authentifié"]);
        exit;
    }

    $hostId = $_SESSION['host_id'];

    $sql = "
        SELECT l.*, b.check_in, b.check_out
        FROM listings l
        INNER JOIN bookings b ON b.listing_id = l.id
        WHERE l.host_id = :host_id
        GROUP BY l.id
        ORDER BY b.check_in DESC
    ";

    $stmt = $pdo->prepare($sql);
    $stmt->execute(['host_id' => $hostId]);
    $listings = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Récupérer les images
    $listingIds = array_column($listings, 'id');
    if (count($listingIds) > 0) {
        $placeholders = implode(',', array_fill(0, count($listingIds), '?'));
        $stmtImg = $pdo->prepare("SELECT listing_id, image_url FROM listing_images WHERE listing_id IN ($placeholders)");
        $stmtImg->execute($listingIds);

        $imagesMap = [];
        foreach ($stmtImg as $img) {
            $imagesMap[$img['listing_id']][] = $img['image_url'];
        }

        foreach ($listings as &$listing) {
            $listing['images'] = $imagesMap[$listing['id']] ?? [];
        }
    }

    echo json_encode($listings);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
