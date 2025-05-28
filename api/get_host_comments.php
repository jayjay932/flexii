<?php
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');
session_start();

try {
    if (isset($_SESSION['host_id'])) {
        http_response_code(401);
        echo json_encode(["error" => "Hôte non connecté"]);
        exit;
    }

    $pdo = new PDO('mysql:host=localhost;dbname=airbnb_clone;charset=utf8mb4', 'root', '', [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);

    $hostId = 1;

    // Récupère les commentaires pour tous les logements de l’hôte
    $stmt = $pdo->prepare("
        SELECT c.*, l.title, u.name AS user_name
        FROM comments c
        INNER JOIN listings l ON c.listing_id = l.id
        INNER JOIN users u ON c.user_id = u.id
        WHERE l.host_id = ?
        ORDER BY c.created_at DESC
    ");
    $stmt->execute([$hostId]);
    $comments = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($comments);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
