<?php
// Fichier : api/get_listing_comments.php
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

try {
    $pdo = new PDO('mysql:host=localhost;dbname=airbnb_clone;charset=utf8mb4', 'root', '', [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);

    if (!isset($_GET['listing_id'])) {
        echo json_encode(['error' => 'listing_id manquant']);
        exit;
    }

    $listingId = intval($_GET['listing_id']);

    $stmt = $pdo->prepare("
        SELECT c.content, c.rating, c.created_at, u.name
        FROM comments c
        JOIN users u ON c.user_id = u.id
        WHERE c.listing_id = ?
        ORDER BY c.created_at DESC
    ");
    $stmt->execute([$listingId]);

    $comments = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($comments);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
