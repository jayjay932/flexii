<?php
session_start();
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

try {
    $pdo = new PDO("mysql:host=localhost;dbname=airbnb_clone;charset=utf8", "root", "", [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);

    $host_id = $_SESSION['host_id'] ?? 1; // 👈 Utilisateur par défaut pour dev

    $stmt = $pdo->prepare("SELECT id, name, email, birth_year, profession, host_type, avatar_url, identity_url, description FROM hosts WHERE id = ?");
    $stmt->execute([$host_id]);
    $host = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$host) {
        http_response_code(404);
        echo json_encode(['error' => 'Profil introuvable']);
        exit;
    }

    echo json_encode($host);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Erreur serveur : ' . $e->getMessage()]);
}
