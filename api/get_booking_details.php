<?php
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

header('Content-Type: application/json');
session_start();

try {
    $pdo = new PDO('mysql:host=localhost;dbname=airbnb_clone;charset=utf8mb4', 'root', '', [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);

    if (!isset($_GET['booking_id'])) {
        http_response_code(400);
        echo json_encode(["error" => "booking_id manquant"]);
        exit;
    }

    $bookingId = $_GET['booking_id'];

    $stmt = $pdo->prepare("
        SELECT b.id AS booking_id, b.user_id, l.host_id
        FROM bookings b
        JOIN listings l ON b.listing_id = l.id
        WHERE b.id = ?
    ");
    $stmt->execute([$bookingId]);
    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$result) {
        http_response_code(404);
        echo json_encode(["error" => "Réservation non trouvée"]);
        exit;
    }

    echo json_encode($result);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
