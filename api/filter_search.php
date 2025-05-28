<?php
// CORS headers
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

session_start();
header('Content-Type: application/json');

try {
    $pdo = new PDO("mysql:host=localhost;dbname=airbnb_clone;charset=utf8mb4", "root", "", [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);

    // Paramètres principaux
    $location = $_GET['location'] ?? '';
    $guests = (int)($_GET['guests'] ?? 1);
    $start = $_GET['start'] ?? null;
    $end = $_GET['end'] ?? null;

    if (!$start || !$end) {
        echo json_encode(["error" => "Dates manquantes"]);
        exit;
    }

    // Filtres secondaires
    $filters = [
        'typeLogement' => $_GET['typeLogement'] ?? '',
        'nbChambres' => $_GET['nbChambres'] ?? '',
        'salon' => isset($_GET['salon']),
        'cuisine' => isset($_GET['cuisine']),
        'meuble' => $_GET['meuble'] ?? '',
        'typeLocation' => $_GET['typeLocation'] ?? '',
        'prixMin' => $_GET['prixMin'] ?? '',
        'prixMax' => $_GET['prixMax'] ?? '',
        'jardin' => isset($_GET['jardin']),
        'balcon' => isset($_GET['balcon']),
        'terrasse' => isset($_GET['terrasse']),
        'piscine' => isset($_GET['piscine'])
    ];

    // Construction de la requête SQL
    $sql = "SELECT * FROM listings WHERE max_guests >= :guests AND (city LIKE :loc OR country LIKE :loc)";
    $params = [
        ':guests' => $guests,
        ':loc' => "%$location%"
    ];

    if ($filters['typeLogement']) {
        $sql .= " AND (title LIKE :typeLogement OR description LIKE :typeLogement)";
        $params[':typeLogement'] = "%{$filters['typeLogement']}%";
    }

    if ($filters['nbChambres']) {
        $sql .= " AND num_bedrooms >= :nbChambres";
        $params[':nbChambres'] = $filters['nbChambres'];
    }

    if ($filters['salon']) {
        $sql .= " AND has_living_room = 1";
    }

    if ($filters['cuisine']) {
        $sql .= " AND has_kitchen = 1";
    }

    if ($filters['meuble'] === 'meuble') {
        $sql .= " AND is_furnished = 1";
    } elseif ($filters['meuble'] === 'non-meuble') {
        $sql .= " AND is_furnished = 0";
    }

    if ($filters['typeLocation']) {
        $sql .= " AND rental_type = :typeLocation";
        $params[':typeLocation'] = $filters['typeLocation'];
    }

    if ($filters['prixMin'] !== '') {
        $sql .= " AND price_per_night >= :prixMin";
        $params[':prixMin'] = $filters['prixMin'];
    }

    if ($filters['prixMax'] !== '') {
        $sql .= " AND price_per_night <= :prixMax";
        $params[':prixMax'] = $filters['prixMax'];
    }

    if ($filters['jardin']) $sql .= " AND has_garden = 1";
    if ($filters['balcon']) $sql .= " AND has_balcony = 1";
    if ($filters['terrasse']) $sql .= " AND has_terrace = 1";
    if ($filters['piscine']) $sql .= " AND has_pool = 1";

    // Disponibilité sur la période
    $sql .= " AND NOT EXISTS (
        SELECT 1 FROM availabilities a
        WHERE a.listing_id = listings.id
        AND a.date BETWEEN :start AND :end
        AND a.is_available = 0
    ) ORDER BY created_at DESC LIMIT 50";

    $params[':start'] = $start;
    $params[':end'] = $end;

    // Exécution
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $listings = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (empty($listings)) {
        echo json_encode([]);
        exit;
    }

    // Images associées
    $ids = array_column($listings, 'id');
    $placeholders = implode(',', array_fill(0, count($ids), '?'));
    $stmtImg = $pdo->prepare("SELECT listing_id, image_url FROM listing_images WHERE listing_id IN ($placeholders)");
    $stmtImg->execute($ids);
    $images = [];
    while ($row = $stmtImg->fetch(PDO::FETCH_ASSOC)) {
        $images[$row['listing_id']][] = $row['image_url'];
    }

    // Notes moyennes
    $stmtRating = $pdo->prepare("SELECT listing_id, AVG(rating) AS avg_rating FROM comments WHERE listing_id IN ($placeholders) GROUP BY listing_id");
    $stmtRating->execute($ids);
    $ratings = [];
    while ($row = $stmtRating->fetch(PDO::FETCH_ASSOC)) {
        $ratings[$row['listing_id']] = round($row['avg_rating'], 1);
    }

    // Annonces favorites
    $userId = $_SESSION['user_id'] ?? null;
    $favorited = [];
    if ($userId) {
        $stmtFav = $pdo->prepare("SELECT listing_id FROM favorites WHERE user_id = ?");
        $stmtFav->execute([$userId]);
        $favorited = array_column($stmtFav->fetchAll(PDO::FETCH_ASSOC), 'listing_id');
    }

    // Finalisation des données
    foreach ($listings as &$listing) {
        $id = $listing['id'];
        $listing['images'] = $images[$id] ?? [];
        $listing['rating'] = $ratings[$id] ?? 0;
        $listing['is_favorited'] = in_array($id, $favorited);
    }

    echo json_encode($listings);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
