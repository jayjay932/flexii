<?php
// Fichier : api/get_host_bookings.php
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

try {
    $pdo = new PDO('mysql:host=localhost;dbname=airbnb_clone;charset=utf8mb4', 'root', '', [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);

    $hostId = 1; // TEST

    $stmt = $pdo->prepare("
        SELECT 
            b.id AS booking_id,
            b.check_in,
            b.check_out,
            l.id AS listing_id,
            l.title,
            li.image_url
        FROM bookings b
        JOIN listings l ON b.listing_id = l.id
        LEFT JOIN listing_images li ON li.listing_id = l.id
        WHERE l.host_id = ?
        GROUP BY b.id
    ");
    $stmt->execute([$hostId]);
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
} catch (PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
