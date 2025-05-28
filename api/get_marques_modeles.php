<?php
// CORS headers
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

header('Content-Type: application/json');

try {
    $pdo = new PDO("mysql:host=localhost;dbname=airbnb_clone;charset=utf8mb4", "root", "", [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);

    // Requête pour marques et modèles
    $stmtMarques = $pdo->query("SELECT DISTINCT marque FROM vehicules WHERE marque IS NOT NULL AND marque != '' ORDER BY marque ASC");
    $marques = $stmtMarques->fetchAll(PDO::FETCH_COLUMN);

    $stmtModeles = $pdo->query("SELECT DISTINCT modele FROM vehicules WHERE modele IS NOT NULL AND modele != '' ORDER BY modele ASC");
    $modeles = $stmtModeles->fetchAll(PDO::FETCH_COLUMN);

    echo json_encode([
        'marques' => $marques,
        'modeles' => $modeles
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>
