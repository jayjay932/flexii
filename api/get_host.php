<?php
session_start();

header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

// Supposons que l'API attend un `listing_id`
$listing_id = isset($_GET['listing_id']) ? (int)$_GET['listing_id'] : 0;

// Vérifier si `listing_id` est valide
if (!$listing_id) {
    echo json_encode(['error' => 'Missing listing_id']);
    exit;
}

// Connexion à la base de données
$pdo = new PDO('mysql:host=localhost;dbname=airbnb_clone;charset=utf8', 'root', '', [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
]);

// Récupérer le `host_id` de la table `listings`
$stmt = $pdo->prepare("SELECT host_id FROM listings WHERE id = ?");
$stmt->execute([$listing_id]);
$listing = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$listing) {
    echo json_encode(['error' => 'Listing not found']);
    exit;
}

// Récupérer les informations de l'hôte à partir du `host_id`
$host_id = $listing['host_id'];
$stmtHost = $pdo->prepare("SELECT id, name, avatar_url, birth_year, profession, total_reviews, rating, years_as_host, superhost FROM hosts WHERE id = ?");
$stmtHost->execute([$host_id]);
$host = $stmtHost->fetch(PDO::FETCH_ASSOC);

// Vérification si l'hôte existe
if (!$host) {
    echo json_encode(['error' => 'Host not found']);
    exit;
}

// Retourner les informations de l'hôte
echo json_encode($host);
