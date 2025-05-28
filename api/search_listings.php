<?php
// 1) Headers CORS
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// 2) Pré-vol OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

session_start();
header('Content-Type: application/json');

try {
    // Connexion PDO
    $pdo = new PDO(
      "mysql:host=localhost;dbname=airbnb_clone;charset=utf8mb4",
      "root", "",
      [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );

    // Récupération des paramètres
    $location = $_GET['location'] ?? '';
    $guests   = (int)($_GET['guests'] ?? 1);
    $start    = $_GET['start'] ?? null;
    $end      = $_GET['end'] ?? null;
    if (!$start || !$end) {
        echo json_encode(["error" => "Dates manquantes"]);
        exit;
    }

    // 3) Requête principale
    $sql = "
      SELECT l.* 
      FROM listings l
      WHERE l.max_guests >= :guests
        AND (l.city LIKE :loc OR l.country LIKE :loc)
        AND NOT EXISTS (
          SELECT 1 FROM availabilities a
          WHERE a.listing_id = l.id
            AND a.date BETWEEN :start AND :end
            AND a.is_available = 0
        )
      ORDER BY l.created_at DESC
      LIMIT 50
    ";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
      ':guests' => $guests,
      ':loc'    => '%' . $location . '%',
      ':start'  => $start,
      ':end'    => $end
    ]);
    $listings = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Si aucune annonce, on renvoie un tableau vide
    if (empty($listings)) {
        echo json_encode([]);
        exit;
    }

    // 4) Préparer la liste d'IDs pour les IN-clauses
    $ids = array_column($listings, 'id');
    $placeholders = implode(',', array_fill(0, count($ids), '?'));

    // 5) Enrichir les images
    $sqlImg = "SELECT listing_id, image_url FROM listing_images WHERE listing_id IN ($placeholders)";
    $stmtImg = $pdo->prepare($sqlImg);
    $stmtImg->execute($ids);

    $allImages = [];
    while ($row = $stmtImg->fetch(PDO::FETCH_ASSOC)) {
        // Si nécessaire, préfixer l'URL : 
        // $row['image_url'] = 'http://localhost/flexii' . $row['image_url'];
        $allImages[$row['listing_id']][] = $row['image_url'];
    }

    // 6) Enrichir les ratings
    $sqlRating = "
      SELECT listing_id, AVG(rating) AS avg_rating
      FROM comments
      WHERE listing_id IN ($placeholders)
      GROUP BY listing_id
    ";
    $stmtRating = $pdo->prepare($sqlRating);
    $stmtRating->execute($ids);

    $allRatings = [];
    while ($row = $stmtRating->fetch(PDO::FETCH_ASSOC)) {
        $allRatings[$row['listing_id']] = round($row['avg_rating'], 1);
    }

    // 7) Enrichir les favoris (si user connecté)
    $userId = $_SESSION['user_id'] ?? null;
    $favorited = [];
    if ($userId) {
        $sqlFav = "SELECT listing_id FROM favorites WHERE user_id = ?";
        $stmtFav = $pdo->prepare($sqlFav);
        $stmtFav->execute([$userId]);
        $favorited = array_column($stmtFav->fetchAll(PDO::FETCH_ASSOC), 'listing_id');
    }

    // 8) Injecter tout dans $listings
    foreach ($listings as &$listing) {
        $id = $listing['id'];
        $listing['images']       = $allImages[$id] ?? [];
        $listing['rating']       = $allRatings[$id] ?? 0;
        $listing['is_favorited'] = in_array($id, $favorited);
    }
    unset($listing);

    // 9) Retour JSON final
    echo json_encode($listings);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
