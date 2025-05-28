<?php
session_start();

header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

// Tri et utilisateur
$sort = $_GET['sort'] ?? 'newest';
$userId = $_SESSION['user_id'] ?? 0;
$cacheKey = "vehicules_{$sort}_user_{$userId}";
$cacheTTL = 60; // secondes

// Nettoyage manuel possible : décommenter la ligne suivante pour forcer un reset
// if (function_exists('apcu_delete')) apcu_delete($cacheKey);

// ✅ Si cache existe et APCu actif, retourner immédiatement
if (function_exists('apcu_fetch') && apcu_exists($cacheKey)) {
  echo apcu_fetch($cacheKey);
  exit;
}

try {
  // Connexion BDD
  $pdo = new PDO('mysql:host=localhost;dbname=airbnb_clone;charset=utf8', 'root', '', [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
  ]);

  // Tri valide
  $allowedSorts = ['price_low', 'price_high', 'newest'];
  if (!in_array($sort, $allowedSorts)) {
    $sort = 'newest';
  }

  // Ordre SQL
  switch ($sort) {
    case 'price_low':
      $orderBy = 'price_per_day ASC';
      break;
    case 'price_high':
      $orderBy = 'price_per_day DESC';
      break;
    case 'newest':
    default:
      $orderBy = 'id DESC';
      break;
  }

  // Récupérer les véhicules
  $stmt = $pdo->query("SELECT * FROM vehicules ORDER BY $orderBy");
  $vehicules = $stmt->fetchAll(PDO::FETCH_ASSOC);

  if (!$vehicules) {
    $emptyJson = json_encode([]);
    if (function_exists('apcu_store')) apcu_store($cacheKey, $emptyJson, $cacheTTL);
    echo $emptyJson;
    exit;
  }

  // Récupérer les images associées
  $ids = array_column($vehicules, 'id');
  $idsStr = implode(',', array_map('intval', $ids));

  $stmtImg = $pdo->query("SELECT vehicule_id, image_url FROM car_images WHERE vehicule_id IN ($idsStr)");
  $allImages = [];
  foreach ($stmtImg as $row) {
    $allImages[$row['vehicule_id']][] = $row['image_url'];
  }

  // Récupérer les favoris de l'utilisateur
  $favoritedIds = [];
  if ($userId) {
    $stmtFav = $pdo->prepare("SELECT vehicule_id FROM favorite_cars WHERE user_id = ?");
    $stmtFav->execute([$userId]);
    $favoritedIds = array_column($stmtFav->fetchAll(PDO::FETCH_ASSOC), 'vehicule_id');
  }

  // Intégrer images et favoris
  foreach ($vehicules as &$v) {
    $v['images'] = $allImages[$v['id']] ?? [];
    $v['is_favorited'] = in_array($v['id'], $favoritedIds);
  }

  $finalJson = json_encode($vehicules);
  if (function_exists('apcu_store')) apcu_store($cacheKey, $finalJson, $cacheTTL);

  echo $finalJson;

} catch (PDOException $e) {
  http_response_code(500);
  echo json_encode(["error" => $e->getMessage()]);
  error_log("Erreur PDO : " . $e->getMessage());
}
