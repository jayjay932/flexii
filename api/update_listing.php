<?php
// CORS headers
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: POST, OPTIONS');

// Répondre à la requête préflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Connexion BDD
$pdo = new PDO('mysql:host=localhost;dbname=airbnb_clone;charset=utf8', 'root', '', [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
]);

header('Content-Type: application/json');

$data = json_decode(file_get_contents("php://input"), true);

if (!$data || !isset($data['id'])) {
    echo json_encode(['success' => false, 'message' => 'ID manquant']);
    exit;
}

// Mise à jour des données du logement
$stmt = $pdo->prepare("
    UPDATE listings SET 
        title = ?, 
        description = ?, 
        address = ?, 
        city = ?, 
        country = ?, 
        price_per_night = ?, 
        max_guests = ?, 
        num_bedrooms = ?, 
        num_bathrooms = ?, 
        has_living_room = ?, 
        has_garden = ?, 
        has_balcony = ?, 
        has_terrace = ?, 
        has_pool = ?, 
        is_furnished = ?, 
        has_wifi = ?, 
        has_kitchen = ?, 
        has_parking = ?
    WHERE id = ?
");

$success = $stmt->execute([
    $data['title'] ?? null,
    $data['description'] ?? null,
    $data['address'] ?? null,
    $data['city'] ?? null,
    $data['country'] ?? null,
    $data['price_per_night'] ?? null,
    $data['max_guests'] ?? null,
    $data['num_bedrooms'] ?? null,
    $data['num_bathrooms'] ?? null,
    $data['has_living_room'] ? 1 : 0,
    $data['has_garden'] ? 1 : 0,
    $data['has_balcony'] ? 1 : 0,
    $data['has_terrace'] ? 1 : 0,
    $data['has_pool'] ? 1 : 0,
    $data['is_furnished'] ? 1 : 0,
    $data['has_wifi'] ? 1 : 0,
    $data['has_kitchen'] ? 1 : 0,
    $data['has_parking'] ? 1 : 0,
    $data['id']
]);

if (!$success) {
    echo json_encode(['success' => false, 'message' => 'Erreur requête principale']);
    exit;
}

// 🔄 Mise à jour des images associées
if (!empty($data['images']) && is_array($data['images'])) {
    // Supprimer les anciennes images
    $stmtDelete = $pdo->prepare("DELETE FROM listing_images WHERE listing_id = ?");
    $stmtDelete->execute([$data['id']]);

    // Réinsérer les images actuelles
    $stmtInsert = $pdo->prepare("INSERT INTO listing_images (listing_id, image_url) VALUES (?, ?)");
    foreach ($data['images'] as $url) {
        $stmtInsert->execute([$data['id'], $url]);
    }
}

echo json_encode(['success' => true]);
