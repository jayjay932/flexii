<?php
// Headers CORS
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Pré-vol OPTIONS
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

    // Récupérer et sécuriser les données
    $listing_id   = (int) ($_POST['listing_id'] ?? 0);
    $check_in     = $_POST['check_in'] ?? '';
    $check_out    = $_POST['check_out'] ?? '';
    $is_available = isset($_POST['is_available']) ? (int) $_POST['is_available'] : 1;
    $custom_price = isset($_POST['custom_price']) && $_POST['custom_price'] !== '' ? (float) $_POST['custom_price'] : null;

    if (!$listing_id || !$check_in || !$check_out) {
        echo json_encode(['error' => 'Données manquantes']);
        exit;
    }

    $start = new DateTime($check_in);
    $end = new DateTime($check_out);
    if ($start > $end) {
        echo json_encode(['error' => 'Plage de dates invalide']);
        exit;
    }

    // Supprimer les anciennes dispos sur la plage si elles existent déjà
    $stmtDelete = $pdo->prepare("DELETE FROM availabilities WHERE listing_id = ? AND date BETWEEN ? AND ?");
    $stmtDelete->execute([$listing_id, $check_in, $check_out]);

    // Insérer pour chaque jour de la plage
    $stmtInsert = $pdo->prepare("
        INSERT INTO availabilities (listing_id, date, is_available, custom_price)
        VALUES (?, ?, ?, ?)
    ");

    $interval = new DateInterval('P1D');
    $period = new DatePeriod($start, $interval, $end->modify('+1 day'));
    foreach ($period as $date) {
        $stmtInsert->execute([
            $listing_id,
            $date->format('Y-m-d'),
            $is_available,
            $custom_price
        ]);
    }

    echo json_encode(['success' => true, 'message' => 'Disponibilité mise à jour avec succès.']);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Erreur serveur: ' . $e->getMessage()]);
}
