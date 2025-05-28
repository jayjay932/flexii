<?php
session_start();

header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

try {
  $pdo = new PDO('mysql:host=localhost;dbname=airbnb_clone;charset=utf8', 'root', '', [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
  ]);


  $allowedSorts = ['price_low', 'price_high', 'newest'];
$orderBy = 'created_at DESC'; // Valeur par défaut

if (isset($_GET['sort']) && in_array($_GET['sort'], $allowedSorts)) {
  switch ($_GET['sort']) {
    case 'price_low':
      $orderBy = 'price_per_night ASC';
      break;
    case 'price_high':
      $orderBy = 'price_per_night DESC';
      break;
    case 'newest':
    default:
      $orderBy = 'created_at DESC';
      break;
  }
}

$stmt = $pdo->query("SELECT * FROM listings ORDER BY $orderBy");

  $listings = $stmt->fetchAll(PDO::FETCH_ASSOC);

  if (!$listings) {
    echo json_encode([]);
    exit;
  }

  $ids = array_column($listings, 'id');
  $idsStr = implode(',', array_map('intval', $ids));

  // 2. Récupérer les images
  $stmtImg = $pdo->query("SELECT listing_id, image_url FROM listing_images WHERE listing_id IN ($idsStr)");
  $allImages = [];
  foreach ($stmtImg as $row) {
    $allImages[$row['listing_id']][] = $row['image_url'];
  }

  // 3. Récupérer les ratings
  $stmtRating = $pdo->query("SELECT listing_id, AVG(rating) as avg_rating FROM comments WHERE listing_id IN ($idsStr) GROUP BY listing_id");
  $allRatings = [];
  foreach ($stmtRating as $row) {
    $allRatings[$row['listing_id']] = round($row['avg_rating'], 1);
  }

  // 4. Récupérer les favoris si connecté
  $userId = $_SESSION['user_id'] ?? null;
  $favoritedIds = [];

  if ($userId) {
    $stmtFav = $pdo->query("SELECT listing_id FROM favorites WHERE user_id = " . (int)$userId);
    $favoritedIds = array_column($stmtFav->fetchAll(PDO::FETCH_ASSOC), 'listing_id');
    
  }

  // 5. Ajouter toutes les données aux listings
  foreach ($listings as &$listing) {
    $listing['images'] = $allImages[$listing['id']] ?? [];
    $listing['rating'] = $allRatings[$listing['id']] ?? 0;
    $listing['is_favorited'] = in_array($listing['id'], $favoritedIds);
  }

  echo json_encode($listings);
} catch (PDOException $e) {
  http_response_code(500);
  echo json_encode(["error" => $e->getMessage()]);
}
