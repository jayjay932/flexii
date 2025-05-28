<?php
// --- Configuration générale ---
session_start();
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');
// Connexion à la base
try {
    $pdo = new PDO('mysql:host=localhost;dbname=airbnb_clone;charset=utf8', 'root', '', [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Erreur de connexion : ' . $e->getMessage()]);
    exit;
}

// Vérifie si listing_id est passé
if (!isset($_GET['listing_id'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Paramètre listing_id manquant']);
    exit;
}

$id = (int) $_GET['listing_id'];

// Récupère les disponibilités
$stmt = $pdo->prepare("SELECT date, is_available FROM availabilities WHERE listing_id = ?");
$stmt->execute([$id]);

$availabilities = [];
while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    $availabilities[$row['date']] = (int)$row['is_available'];
}

// Retourne les dispos en JSON
echo json_encode(['availabilities' => $availabilities]);
