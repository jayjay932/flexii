<?php
session_start();

header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

if (!isset($_GET['listing_id'])) {
    echo json_encode(['error' => 'Missing listing_id']);
    exit;
}

$id = (int)$_GET['listing_id'];

try {
    $pdo = new PDO('mysql:host=localhost;dbname=airbnb_clone;charset=utf8', 'root', '', [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);

    $stmt = $pdo->prepare("SELECT date, is_available FROM availabilities WHERE listing_id = ?");
    $stmt->execute([$id]);
    $availabilities = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($availabilities);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
