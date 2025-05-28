<?php
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

try {
    $pdo = new PDO("mysql:host=localhost;dbname=airbnb_clone;charset=utf8mb4", "root", "", [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);

    // On récupère les villes distinctes pour les véhicules
    $stmt = $pdo->query("SELECT DISTINCT city FROM vehicules WHERE city IS NOT NULL AND city != '' ORDER BY city ASC");
    $villes = $stmt->fetchAll(PDO::FETCH_COLUMN);

    echo json_encode($villes);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([]);
}
