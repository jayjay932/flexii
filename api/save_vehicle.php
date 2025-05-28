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

if (!$data || !isset($data['marque']) || !isset($data['modele'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Requête incomplète']);
    exit;
}

$marque             = $data['marque'];
$modele             = $data['modele'];
$annee              = $data['annee'];
$kilometrage        = $data['kilometrage'];
$carburant          = $data['carburant'];
$transmission       = $data['transmission'];
$couleur            = $data['couleur'];
$etat               = $data['etat'];
$type_vehicule      = $data['type_vehicule'];
$type_location      = $data['type_location'] ?? null;
$ville              = $data['ville'];
$quartier           = $data['quartier'];
$puissance_fiscale  = $data['puissance_fiscale'];
$consommation       = $data['consommation_moyenne'];
$controle_technique = $data['controle_technique'];
$nombre_portes      = $data['nombre_portes'];
$nombre_places      = $data['nombre_places'];
$equipements        = $data['equipements'] ?? [];

$gps                = in_array('gps', $equipements) ? 1 : 0;
$climatisation      = in_array('climatisation', $equipements) ? 1 : 0;
$camera_recul       = in_array('camera_recul', $equipements) ? 1 : 0;

$price_per_day      = !empty($data['price_per_day']) ? $data['price_per_day'] : null;
$price_for_sale     = !empty($data['price_for_sale']) ? $data['price_for_sale'] : null;
$weekend_discount   = $data['weekend_discount'] ?? null;
$created_at         = date('Y-m-d H:i:s');
$host_id            = 1; // ✅ temporairement forcé à 1
$title              = $data['title'] ?? "$marque $modele";
$description        = $data['description'] ?? 'Véhicule disponible';
$address            = $quartier ?? '';
$city               = $ville ?? '';
$country            = $data['country'] ?? 'Congo';
$disponible         = 1;

$stmt = $pdo->prepare("
  INSERT INTO vehicules (
    marque, modele, annee, kilometrage, carburant, transmission,
    nombre_portes, nombre_places, couleur, climatisation, gps, camera_recul,
    etat, type_vehicule, puissance_fiscale, consommation_moyenne, controle_technique,
    disponible, type_location, price_per_day,
    host_id, title, description, address, city, country,
    price_for_sale, weekend_discount
  ) VALUES (
    ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
    ?, ?, ?, ?, ?,
    ?, ?, ?,
    ?, ?, ?, ?, ?, ?,
    ?, ?
  )
");

$success = $stmt->execute([
  $marque, $modele, $annee, $kilometrage, $carburant, $transmission,
  $nombre_portes, $nombre_places, $couleur, $climatisation, $gps, $camera_recul,
  $etat, $type_vehicule, $puissance_fiscale, $consommation, $controle_technique,
  $disponible, $type_location, $price_per_day,
  $host_id, $title, $description, $address, $city, $country,
  $price_for_sale, $weekend_discount
]);


if ($success) {
    $vehicule_id = $pdo->lastInsertId();
    $images = $data['images'] ?? [];

    if (is_array($images)) {
        $stmtImg = $pdo->prepare("INSERT INTO car_images (vehicule_id, image_url, uploaded_at) VALUES (?, ?, NOW())");
        foreach ($images as $img) {
            if (!str_starts_with($img, 'blob:')) {
                $stmtImg->execute([$vehicule_id, $img]);
            }
        }
    }

    echo json_encode(['success' => true, 'message' => '✅ Véhicule enregistré avec succès.']);
    exit;
} else {
    http_response_code(500);
    echo json_encode(['error' => '❌ Échec lors de l’enregistrement du véhicule.']);
    exit;
}
