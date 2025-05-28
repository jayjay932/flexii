
<?php


session_start();


header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

// Ajouter ces en-têtes au début de votre script PHP
  // Remplacez par l'URL de votre frontend
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

$pdo = new PDO('mysql:host=localhost;dbname=airbnb_clone;charset=utf8', 'root', '');

if (!isset($_GET['id'])) die("Aucun logement spécifié.");
$id = (int) $_GET['id'];

$stmt = $pdo->prepare("SELECT title FROM listings WHERE id = ?");
$stmt->execute([$id]);
$listing = $stmt->fetch(PDO::FETCH_ASSOC);
if (!$listing) die("Logement introuvable.");

$stmtComments = $pdo->prepare("SELECT comments.*, users.name, users.avatar_url FROM comments JOIN users ON comments.user_id = users.id WHERE listing_id = ? ORDER BY created_at DESC");
$stmtComments->execute([$id]);
$comments = $stmtComments->fetchAll(PDO::FETCH_ASSOC);

header('Content-Type: application/json');
echo json_encode([
    'listingTitle' => $listing['title'],
    'comments' => $comments
]);
