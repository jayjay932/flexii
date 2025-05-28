<?php
// CORS headers
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: POST, DELETE, OPTIONS');

// Répondre à la requête préflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

header('Content-Type: application/json');

// Connexion à la base de données
$pdo = new PDO('mysql:host=localhost;dbname=airbnb_clone;charset=utf8', 'root', '', [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
]);

// Récupération des données
$data = json_decode(file_get_contents("php://input"), true);

// Vérification de l'ID
if (!$data || !isset($data['id'])) {
    echo json_encode(['success' => false, 'message' => 'ID manquant']);
    exit;
}

$id = (int) $data['id'];

// Supprimer les images associées
$stmtImages = $pdo->prepare("DELETE FROM listing_images WHERE listing_id = ?");
$stmtImages->execute([$id]);

// Supprimer les disponibilités associées
$stmtAvail = $pdo->prepare("DELETE FROM availabilities WHERE listing_id = ?");
$stmtAvail->execute([$id]);

// Supprimer les commentaires associés
$stmtComments = $pdo->prepare("DELETE FROM comments WHERE listing_id = ?");
$stmtComments->execute([$id]);

// Supprimer le logement
$stmtListing = $pdo->prepare("DELETE FROM listings WHERE id = ?");
$success = $stmtListing->execute([$id]);

if ($success) {
    echo json_encode(['success' => true, 'message' => 'Logement supprimé avec succès']);
} else {
    echo json_encode(['success' => false, 'message' => 'Erreur lors de la suppression']);
}
