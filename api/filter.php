<?php
// 1) Headers CORS
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
    $pdo = new PDO(
        "mysql:host=localhost;dbname=airbnb_clone;charset=utf8mb4",
        "root", "",
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );

    $location = $_GET['location'] ?? '';
    $guests   = (int)($_GET['guests'] ?? 1);
    $start    = $_GET['start'] ?? null;
    $end      = $_GET['end'] ?? null;

    // Nouveaux filtres
    $filters = [
        'meuble'        => $_GET['meuble'] ?? '',
        'salon'         => $_GET['salon'] ?? '',
        'cuisine'       => $_GET['cuisine'] ?? '',
        'jardin'        => $_GET['jardin'] ?? '',
        'balcon'        => $_GET['balcon'] ?? '',
        'terrasse'      => $_GET['terrasse'] ?? '',
        'piscine'       => $_GET['piscine'] ?? '',
        'typeLocation'  => $_GET['typeLocation'] ?? '',
        'nbChambres'    => $_GET['nbChambres'] ?? '',
        'prixMin'       => $_GET['prixMin'] ?? '',
        'prixMax'       => $_GET['prixMax'] ?? '',
    ];

    if (!$start || !$end) {
        echo json_encode(["error" => "Dates manquantes"]);
        exit;
    }

    $sql = "SELECT * FROM listings WHERE max_guests >= :guests AND (city LIKE :loc OR country LIKE :loc)";
    $params = [
        ':guests' => $guests,
        ':loc'    => "%$location%"
    ];

    // Ajouter les filtres dynamiquement
    if ($filters['meuble'] === 'meuble') $sql .= " AND is_furnished = 1";
    if ($filters['meuble'] === 'non-meuble') $sql .= " AND is_furnished = 0";
    if ($filters['salon']) $sql .= " AND has_living_room = 1";
    if ($filters['cuisine']) $sql .= " AND has_kitchen = 1";
    if ($filters['jardin']) $sql .= " AND has_garden = 1";
    if ($filters['balcon']) $sql .= " AND has_balcony = 1";
    if ($filters['terrasse']) $sql .= " AND has_terrace = 1";
    if ($filters['piscine']) $sql .= " AND has_pool = 1";
    if ($filters['typeLocation']) $sql .= " AND rental_type = :rentalType";
    if ($filters['nbChambres']) $sql .= " AND num_bedrooms >= :nbChambres";
    if ($filters['prixMin']) $sql .= " AND price_per_night >= :prixMin";
    if ($filters['prixMax']) $sql .= " AND price_per_night <= :prixMax";

    if ($filters['typeLocation']) $params[':rentalType'] = $filters['typeLocation'];
    if ($filters['nbChambres']) $params[':nbChambres'] = (int)$filters['nbChambres'];
    if ($filters['prixMin']) $params[':prixMin'] = (float)$filters['prixMin'];
    if ($filters['prixMax']) $params[':prixMax'] = (float)$filters['prixMax'];

    $sql .= " AND NOT EXISTS (
        SELECT 1 FROM availabilities a
        WHERE a.listing_id = listings.id
          AND a.date BETWEEN :start AND :end
          AND a.is_available = 0
    ) ORDER BY created_at DESC LIMIT 50";

    $params[':start'] = $start;
    $params[':end'] = $end;

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($results);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
