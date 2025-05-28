<?php
session_start();
ini_set('display_errors', 1);
error_reporting(E_ALL);

header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

try {
    $pdo = new PDO('mysql:host=localhost;dbname=airbnb_clone;charset=utf8', 'root', '', [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Erreur de connexion']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

if (!$data || !isset($data['ville'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Requête invalide']);
    exit;
}
$title       = trim($data['title'] ?? '') ?: 'Logement sans titre';
$description = trim($data['description'] ?? '') ?: 'Ajoutez une description personnalisée';

$address          = $data['quartier'] ?? '';
$city             = $data['ville'] ?? '';
$country          = 'Congo';
$price_per_night  = $data['final_price'] ?? $data['price_per_night'] ?? 0;
$max_guests       = $data['voyageurs'] ?? 1;
$num_bedrooms     = $data['chambres'] ?? 1;
$num_bathrooms    = $data['sallesDeBain'] ?? 1;
$has_wifi         = in_array('has_wifi', $data['equipements'] ?? []) ? 1 : 0;
$has_kitchen      = in_array('has_kitchen', $data['equipements'] ?? []) ? 1 : 0;
$has_parking      = in_array('has_parking', $data['equipements'] ?? []) ? 1 : 0;
$rental_type      = $data['typeDispo'] ?? 'mensuel';
$created_at       = date('Y-m-d H:i:s');

$stmt = $pdo->prepare("
  INSERT INTO listings (
    title, description, address, city, country, price_per_night,
    max_guests, num_bedrooms, num_bathrooms,
    has_wifi, has_kitchen, has_parking, rental_type, created_at
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
");

$success = $stmt->execute([
  $title, $description, $address, $city, $country, $price_per_night,
  $max_guests, $num_bedrooms, $num_bathrooms,
  $has_wifi, $has_kitchen, $has_parking, $rental_type, $created_at
]);
if ($success) {
    $listing_id = $pdo->lastInsertId(); // Récupère l'ID du logement

    // Enregistrer les images liées
    $images = $data['images'] ?? [];
    if (is_array($images)) {
        $stmtImage = $pdo->prepare("INSERT INTO listing_images (listing_id, image_url) VALUES (?, ?)");
        foreach ($images as $img) {
            // Ne pas enregistrer les blobs "blob:http://..." — ignorer
            if (!str_starts_with($img, 'blob:')) {
                $stmtImage->execute([$listing_id, $img]);
            }
        }
    }

    echo json_encode(['success' => true, 'message' => 'Logement et images enregistrés']);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Échec d’enregistrement du logement']);
}
