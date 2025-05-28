<?php
// Fichier : api/get_messages.php
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

try {
    $pdo = new PDO('mysql:host=localhost;dbname=airbnb_clone;charset=utf8mb4', 'root', '', [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);

    if (!isset($_GET['booking_id'])) {
        http_response_code(400);
        echo json_encode(["error" => "booking_id requis"]);
        exit;
    }

    $bookingId = $_GET['booking_id'];

    $stmt = $pdo->prepare("SELECT * FROM messagerie WHERE booking_id = ? ORDER BY sent_at ASC");
    $stmt->execute([$bookingId]);

    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
