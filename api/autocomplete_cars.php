<?php
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

    $q = trim($_GET['q'] ?? '');
    if (mb_strlen($q) < 2) {
        echo json_encode([]);
        exit;
    }

    $sql = "
      SELECT DISTINCT city AS label FROM vehicules WHERE city LIKE :q
      UNION
      SELECT DISTINCT country AS label FROM vehicules WHERE country LIKE :q
      LIMIT 10
    ";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([':q' => $q . '%']);
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([]);
}
