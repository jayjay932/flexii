<?php
// Fichier : api/get_user_bookings.php
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');
session_start();

try {
    $pdo = new PDO('mysql:host=localhost;dbname=airbnb_clone;charset=utf8mb4', 'root', '', [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);

    // ⚠️ Assurez-vous que la session contient bien le user_id
    if (!isset($_SESSION['user_id'])) {
        http_response_code(401);
        echo json_encode(["error" => "Utilisateur non connecté"]);
        exit;
    }

    $userId = $_SESSION['user_id'];

    // Récupération des réservations du user
    $sql = "
        SELECT 
            l.*, 
            b.check_in, 
            b.check_out, 
            b.total_price, 
            b.status
        FROM bookings b
        INNER JOIN listings l ON b.listing_id = l.id
        WHERE b.user_id = :userId
        ORDER BY b.check_in DESC
    ";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([':userId' => 1]);
    $bookings = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (empty($bookings)) {
        echo json_encode([]);
        exit;
    }

    // Récupérer les images des logements
    $listingIds = array_column($bookings, 'id');
    $placeholders = implode(',', array_fill(0, count($listingIds), '?'));
    $stmtImg = $pdo->prepare("SELECT listing_id, image_url FROM listing_images WHERE listing_id IN ($placeholders)");
    $stmtImg->execute($listingIds);

    $imagesMap = [];
    foreach ($stmtImg as $row) {
        $imagesMap[$row['listing_id']][] = $row['image_url'];
    }

    // Ajout des images aux réservations
    foreach ($bookings as &$booking) {
        $booking['images'] = $imagesMap[$booking['id']] ?? [];
    }

    echo json_encode($bookings);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
