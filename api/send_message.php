<?php
// Fichier : api/send_message.php

// 1) Headers CORS
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// 2) Gérer pré-vol CORS (OPTIONS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// 3) Header JSON
header('Content-Type: application/json');
session_start();

try {
    // Connexion BDD
    $pdo = new PDO('mysql:host=localhost;dbname=airbnb_clone;charset=utf8mb4', 'root', '', [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);

    // 4) Lecture des données envoyées en JSON
    $data = json_decode(file_get_contents('php://input'), true);

    // 5) Vérification des données
    if (!isset($data['booking_id'], $data['sender_type'], $data['sender_id'], $data['receiver_id'], $data['message'])) {
        http_response_code(400);
        echo json_encode(["error" => "Données incomplètes"]);
        exit;
    }

    // 6) Insertion du message
    $stmt = $pdo->prepare("
        INSERT INTO messagerie (booking_id, sender_type, sender_id, receiver_id, message) 
        VALUES (?, ?, ?, ?, ?)
    ");
    $stmt->execute([
        $data['booking_id'],
        $data['sender_type'],
        $data['sender_id'],
        $data['receiver_id'],
        $data['message']
    ]);

    // 7) Réponse OK
    echo json_encode([
        "success" => true,
        "message_id" => $pdo->lastInsertId()
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
