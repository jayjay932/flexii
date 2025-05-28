<?php
// Fichier : api/get_listing_comments.php

header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

if (!isset($_GET['listing_id'])) {
    http_response_code(400);
    echo json_encode(["error" => "ID du logement manquant."]);
    exit;
}

$listing_id = $_GET['listing_id'];

try {
    $pdo = new PDO("mysql:host=localhost;dbname=airbnb_clone;charset=utf8mb4", "root", "", [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);

    $stmt = $pdo->prepare("
        SELECT c.*, u.name AS user_name
        FROM comments c
        LEFT JOIN users u ON c.user_id = u.id
        WHERE c.listing_id = ?
        ORDER BY c.created_at DESC
    ");
    $stmt->execute([$listing_id]);

    $comments = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($comments);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Erreur BDD : " . $e->getMessage()]);
}
