<?php
session_start();

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Credentials: true');

try {
    $pdo = new PDO('mysql:host=localhost;dbname=airbnb_clone;charset=utf8', 'root', '', [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Erreur de connexion : ' . $e->getMessage()]);
    exit;
}

if (!isset($_GET['vehicule_id'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Paramètre vehicule_id manquant']);
    exit;
}

$vehicule_id = (int) $_GET['vehicule_id'];

$stmt = $pdo->prepare("SELECT date, is_available FROM availabilities_cars WHERE vehicule_id = ?");
$stmt->execute([$vehicule_id]);

$availabilities = [];
while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    $availabilities[$row['date']] = (int)$row['is_available'];
}

echo json_encode(['availabilities' => $availabilities]);
