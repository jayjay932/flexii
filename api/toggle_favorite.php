<?php
session_start();
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Credentials: true');

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'error' => 'Non connecté']);
    exit;
}

$userId = $_SESSION['user_id'];
$listingId = $_POST['listing_id'] ?? null;

if (!$listingId) {
    echo json_encode(['success' => false, 'error' => 'ID logement manquant']);
    exit;
}

try {
    $pdo = new PDO('mysql:host=localhost;dbname=airbnb_clone;charset=utf8', 'root', '', [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);

    // Vérifie si le favori existe déjà
    $stmt = $pdo->prepare("SELECT id FROM favorites WHERE user_id = :user AND listing_id = :listing");
    $stmt->execute(['user' => $userId, 'listing' => $listingId]);
    $exists = $stmt->fetch();

    if ($exists) {
        // Supprimer
        $pdo->prepare("DELETE FROM favorites WHERE user_id = :user AND listing_id = :listing")
            ->execute(['user' => $userId, 'listing' => $listingId]);
        echo json_encode(['success' => true, 'favorited' => false]);
    } else {
        // Ajouter
        $pdo->prepare("INSERT INTO favorites (user_id, listing_id) VALUES (:user, :listing)")
            ->execute(['user' => $userId, 'listing' => $listingId]);
        echo json_encode(['success' => true, 'favorited' => true]);
    }

} catch (PDOException $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
