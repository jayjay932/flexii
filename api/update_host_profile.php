<?php
session_start();
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

$uploadDir = __DIR__ . '/../uploads/';
$baseUrl = 'uploads/';
$allowedFields = ['name', 'email', 'birth_year', 'profession', 'host_type', 'description', 'password'];

try {
    $pdo = new PDO("mysql:host=localhost;dbname=airbnb_clone;charset=utf8", "root", "", [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);

    $host_id = $_SESSION['host_id'] ?? 1;

    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        echo json_encode(['error' => 'Méthode non autorisée']);
        exit;
    }

    if (!isset($_FILES) && empty($_POST)) {
        echo json_encode(['error' => 'Requête vide']);
        exit;
    }

    $updates = [];
    $params = [];

    foreach ($allowedFields as $field) {
        if (!empty($_POST[$field])) {
            if ($field === 'password') {
                $updates[] = "$field = ?";
                $params[] = password_hash($_POST[$field], PASSWORD_DEFAULT);
            } else {
                $updates[] = "$field = ?";
                $params[] = $_POST[$field];
            }
        }
    }

    // Handle avatar
    if (isset($_FILES['avatar']) && $_FILES['avatar']['error'] === 0) {
        $ext = pathinfo($_FILES['avatar']['name'], PATHINFO_EXTENSION);
        $fileName = uniqid() . "_avatar.$ext";
        move_uploaded_file($_FILES['avatar']['tmp_name'], $uploadDir . $fileName);
        $updates[] = "avatar_url = ?";
        $params[] = $baseUrl . $fileName;
    }

    // Handle identity
    if (isset($_FILES['identity']) && $_FILES['identity']['error'] === 0) {
        $ext = pathinfo($_FILES['identity']['name'], PATHINFO_EXTENSION);
        $fileName = uniqid() . "_identity.$ext";
        move_uploaded_file($_FILES['identity']['tmp_name'], $uploadDir . $fileName);
        $updates[] = "identity_url = ?";
        $params[] = $baseUrl . $fileName;
    }

    if (!empty($updates)) {
        $sql = "UPDATE hosts SET " . implode(", ", $updates) . " WHERE id = ?";
        $params[] = $host_id;
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['error' => 'Aucune modification détectée.']);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Erreur serveur : ' . $e->getMessage()]);
}
