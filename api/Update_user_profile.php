<?php
session_start();

// CORS headers
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

header('Content-Type: application/json');

try {
    $pdo = new PDO("mysql:host=localhost;dbname=airbnb_clone;charset=utf8mb4", "root", "", [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);

    $data = json_decode(file_get_contents('php://input'), true);

    $user_id = $_SESSION['user_id'] ?? 1; // 👈 utilisateur 1 par défaut

    if (!isset($data['field']) || !isset($data['value'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Requête invalide']);
        exit;
    }

    $allowed_fields = ['name', 'email', 'phone', 'date_naissance', 'ville'];

    if (!in_array($data['field'], $allowed_fields)) {
        http_response_code(400);
        echo json_encode(['error' => 'Champ non autorisé']);
        exit;
    }

    $sql = "UPDATE users SET {$data['field']} = ? WHERE id = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$data['value'], $user_id]);

    echo json_encode(['success' => true]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Erreur serveur : ' . $e->getMessage()]);
}
?>
