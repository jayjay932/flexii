<?php
session_start();


header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

// Ajouter ces en-têtes au début de votre script PHP
  // Remplacez par l'URL de votre frontend
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Le reste de votre code PHP...



$pdo = new PDO('mysql:host=localhost;dbname=airbnb_clone;charset=utf8', 'root', '', [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
]);
// Vérifier si le listing_id est bien passé
$listing_id = isset($_GET['listing_id']) ? (int)$_GET['listing_id'] : 0;
if (!$listing_id) {
  echo json_encode(['error' => 'Aucun listing spécifié']);
  exit;
}

// Récupérer les commentaires
$stmt = $pdo->prepare("
    SELECT comments.*, users.name, users.avatar_url
    FROM comments
    JOIN users ON comments.user_id = users.id
    WHERE listing_id = ?
    ORDER BY created_at DESC
");
$stmt->execute([$listing_id]);
$comments = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Vérifier si des commentaires sont récupérés
if (empty($comments)) {
  echo json_encode([]);  // Renvoie un tableau vide si aucun commentaire n'est trouvé
} else {
  echo json_encode($comments, JSON_PRETTY_PRINT);  // Renvoie les commentaires en format JSON
}
