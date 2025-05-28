<?php
session_start();
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Headers: Content-Type');

// Connexion BDD
try {
    $pdo = new PDO('mysql:host=localhost;dbname=airbnb_clone;charset=utf8mb4', 'root', '', [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Erreur de connexion à la base.']);
    exit;
}

// Vérification de session utilisateur
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Non connecté']);
    exit;
}

$userId = $_SESSION['user_id'];
$listingId = intval($_POST['listing_id'] ?? 0);

if (!$listingId) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'ID invalide']);
    exit;
}

// Vérifie si déjà favori
$stmt = $pdo->prepare("SELECT id FROM favorites WHERE user_id = ? AND listing_id = ?");
$stmt->execute([$userId, $listingId]);
$exists = $stmt->fetch();

if ($exists) {
    // Supprimer
    $stmt = $pdo->prepare("DELETE FROM favorites WHERE user_id = ? AND listing_id = ?");
    $stmt->execute([$userId, $listingId]);
    echo json_encode(['success' => true, 'liked' => false]);
} else {
    // Ajouter
    $stmt = $pdo->prepare("INSERT INTO favorites (user_id, listing_id) VALUES (?, ?)");
    $stmt->execute([$userId, $listingId]);
    echo json_encode(['success' => true, 'liked' => true]);
}
exit;