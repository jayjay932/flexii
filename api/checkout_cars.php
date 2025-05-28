<?php
// checkout.php
session_start();
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
try {
    // Récupère les données JSON envoyées
    $input = json_decode(file_get_contents('php://input'), true);
    if (!isset($input['id'], $input['start_date'], $input['end_date'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Paramètres manquants.']);
        exit;
    }

    $listingId = (int) $input['id'];
    $startDate = DateTime::createFromFormat('Y-m-d', $input['start_date']);
    $endDate   = DateTime::createFromFormat('Y-m-d', $input['end_date']);

    // Connexion à la base
    $pdo = new PDO('mysql:host=localhost;dbname=airbnb_clone;charset=utf8', 'root', '');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->beginTransaction();

    // Récupère le prix par nuit pour calcul
    $stmt = $pdo->prepare('SELECT price_per_day FROM vehicules WHERE id = ?');
    $stmt->execute([$listingId]);
    $pricePerNight = $stmt->fetchColumn();
    if ($pricePerNight === false) {
        throw new Exception('vehicule introuvable.');
    }

    // Calcul du total
    $nights     = $startDate->diff($endDate)->days;
    $totalPrice = $nights * $pricePerNight;

    // Marquer chaque date comme indisponible
    $interval = new DateInterval('P1D');
    $period   = new DatePeriod($startDate, $interval, $endDate);
    $stmtAvail = $pdo->prepare(
        'INSERT INTO availabilities_cars (vehicule_id, date, is_available) VALUES (?, ?, 0)
         ON DUPLICATE KEY UPDATE is_available = 0'
    );
    foreach ($period as $day) {
        $stmtAvail->execute([$listingId, $day->format('Y-m-d')]);
    }

    // Insère la réservation
    session_start();
    if (empty($_SESSION['user_id'])) {
        throw new Exception('Utilisateur non connecté.');
    }
    $userId = (int) $_SESSION['user_id'];

    $stmtBook = $pdo->prepare(
        'INSERT INTO bookings_cars (user_id, vehicule_id, check_in, check_out, total_price)
         VALUES (?, ?, ?, ?, ?)'
    );
    $stmtBook->execute([
        $userId,
        $listingId,
        $startDate->format('Y-m-d'),
        $endDate->format('Y-m-d'),
        $totalPrice
    ]);

    $pdo->commit();

    echo json_encode(['success' => true]);

} catch (Exception $e) {
    if (isset($pdo) && $pdo->inTransaction()) {
        $pdo->rollBack();
    }
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
