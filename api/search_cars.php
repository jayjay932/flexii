<?php
// CORS & headers
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

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

    // 🔍 Récupération des paramètres
    $location = $_GET['location'] ?? '';
    $start    = $_GET['start'] ?? null;
    $end      = $_GET['end'] ?? null;

    if (!$start || !$end) {
        echo json_encode(["error" => "Dates manquantes"]);
        exit;
    }

    // 🧾 Requête principale : voitures disponibles dans la ville/pays
    $sql = "
        SELECT v.*
        FROM vehicules v
        WHERE (v.city LIKE :loc OR v.country LIKE :loc)
          AND NOT EXISTS (
            SELECT 1 FROM availabilities_cars a
            WHERE a.vehicule_id = v.id
              AND a.date BETWEEN :start AND :end
              AND a.is_available = 0
          )
        ORDER BY v.created_at DESC
        LIMIT 50
    ";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':loc' => '%' . $location . '%',
        ':start' => $start,
        ':end' => $end
    ]);
    $cars = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (empty($cars)) {
        echo json_encode([]);
        exit;
    }

    // 🖼️ Images
    $ids = array_column($cars, 'id');
    $placeholders = implode(',', array_fill(0, count($ids), '?'));

    $sqlImg = "SELECT vehicule_id, image_url FROM car_images WHERE vehicule_id IN ($placeholders)";
    $stmtImg = $pdo->prepare($sqlImg);
    $stmtImg->execute($ids);
    $allImages = [];
    while ($row = $stmtImg->fetch(PDO::FETCH_ASSOC)) {
        $allImages[$row['vehicule_id']][] = $row['image_url'];
    }

    // ⭐ Ratings
    $sqlRating = "SELECT vehicule_id, AVG(rating) AS avg_rating FROM car_comments WHERE vehicule_id IN ($placeholders) GROUP BY vehicule_id";
    $stmtRating = $pdo->prepare($sqlRating);
    $stmtRating->execute($ids);
    $allRatings = [];
    while ($row = $stmtRating->fetch(PDO::FETCH_ASSOC)) {
        $allRatings[$row['vehicule_id']] = round($row['avg_rating'], 1);
    }

    // 🔄 Injection des données dans les résultats
    foreach ($cars as &$car) {
        $id = $car['id'];
        $car['images'] = $allImages[$id] ?? [];
        $car['rating'] = $allRatings[$id] ?? 0;
    }
    unset($car);

    echo json_encode($cars);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
