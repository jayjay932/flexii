<?php
// Fichier : api/get_host_bookings_with_comments.php
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');
session_start();

if (isset($_SESSION['host_id'])) {
    http_response_code(401);
    echo json_encode(["error" => "Hôte non connecté"]);
    exit;
}

$hostId = 1;

try {
    $pdo = new PDO("mysql:host=localhost;dbname=airbnb_clone;charset=utf8mb4", "root", "", [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);

    // Récupérer les réservations pour les logements de l'hôte
    $sql = "
        SELECT 
            b.*, 
            l.title, 
            l.id AS listing_id,
            c.image_url,
            cm.content AS comment_content,
            cm.rating,
            u.name AS user_name
        FROM bookings b
        JOIN listings l ON b.listing_id = l.id
        LEFT JOIN listing_images c ON c.listing_id = l.id
        LEFT JOIN comments cm ON cm.booking_id = b.id
        LEFT JOIN users u ON b.user_id = u.id
        WHERE l.host_id = ?
        GROUP BY b.id
        ORDER BY b.check_in DESC
    ";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([$hostId]);
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($results);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
