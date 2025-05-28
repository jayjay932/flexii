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
    $pdo = new PDO("mysql:host=localhost;dbname=airbnb_clone;charset=utf8mb4", "root", "", [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);

    // Récupération des paramètres
    $filters = [
        'marque' => $_GET['marque'] ?? '',
        'modele' => $_GET['modele'] ?? '',
        'carburant' => $_GET['carburant'] ?? '',
        'transmission' => $_GET['transmission'] ?? '',
        'kilometrageMax' => $_GET['kilometrageMax'] ?? '',
        'climatisation' => isset($_GET['climatisation']),
        'gps' => isset($_GET['gps']),
        'prixMin' => $_GET['prixMin'] ?? '',
        'prixMax' => $_GET['prixMax'] ?? '',
        'ville' => $_GET['ville'] ?? ''
    ];

    // Requête
    $sql = "SELECT * FROM vehicules WHERE 1=1";
    $params = [];

    if ($filters['marque']) {
        $sql .= " AND marque LIKE :marque";
        $params[':marque'] = "%{$filters['marque']}%";
    }

    if ($filters['modele']) {
        $sql .= " AND modele LIKE :modele";
        $params[':modele'] = "%{$filters['modele']}%";
    }

    if ($filters['carburant']) {
        $sql .= " AND carburant = :carburant";
        $params[':carburant'] = $filters['carburant'];
    }

    if ($filters['transmission']) {
        $sql .= " AND transmission = :transmission";
        $params[':transmission'] = $filters['transmission'];
    }

    if ($filters['kilometrageMax']) {
        $sql .= " AND kilometrage <= :kmMax";
        $params[':kmMax'] = $filters['kilometrageMax'];
    }

    if ($filters['climatisation']) {
        $sql .= " AND climatisation = 1";
    }

    if ($filters['gps']) {
        $sql .= " AND gps = 1";
    }

    if ($filters['prixMin']) {
        $sql .= " AND prix >= :prixMin";
        $params[':prixMin'] = $filters['prixMin'];
    }

    if ($filters['prixMax']) {
        $sql .= " AND prix <= :prixMax";
        $params[':prixMax'] = $filters['prixMax'];
    }

    if ($filters['ville']) {
        $sql .= " AND city = :ville";
        $params[':ville'] = $filters['ville'];
    }
    

    $sql .= " ORDER BY id DESC LIMIT 50";
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $vehicles = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (empty($vehicles)) {
        echo json_encode([]);
        exit;
    }

    $ids = array_column($vehicles, 'id');
    $placeholders = implode(',', array_fill(0, count($ids), '?'));

    // Images
    $stmtImg = $pdo->prepare("SELECT vehicule_id, image_url FROM car_images WHERE vehicule_id IN ($placeholders)");
    $stmtImg->execute($ids);
    $images = [];
    while ($row = $stmtImg->fetch(PDO::FETCH_ASSOC)) {
        $images[$row['vehicule_id']][] = $row['image_url'];
    }

    // Favoris
    $userId = $_SESSION['user_id'] ?? null;
    $favorited = [];
    if ($userId) {
        $stmtFav = $pdo->prepare("SELECT vehicule_id FROM favorite_cars WHERE user_id = ?");
        $stmtFav->execute([$userId]);
        $favorited = array_column($stmtFav->fetchAll(PDO::FETCH_ASSOC), 'vehicule_id');
    }

    foreach ($vehicles as &$v) {
        $id = $v['id'];
        $v['images'] = $images[$id] ?? [];
        $v['is_favorited'] = in_array($id, $favorited);
    }
    unset($v);

    echo json_encode($vehicles);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
