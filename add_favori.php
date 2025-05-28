<?php
session_start();

// Vérifications de sécurité
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Méthode non autorisée']);
    exit;
}

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'error' => 'Utilisateur non connecté']);
    exit;
}

if (!isset($_POST['listing_id']) || !is_numeric($_POST['listing_id'])) {
    echo json_encode(['success' => false, 'error' => 'ID invalide']);
    exit;
}

$listingId = (int) $_POST['listing_id'];
$userId = (int) $_SESSION['user_id'];

try {
    $pdo = new PDO('mysql:host=localhost;dbname=airbnb_clone;charset=utf8', 'root', '', [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);

    // Vérifie si l'annonce existe vraiment (sécurité supplémentaire)
    $stmt = $pdo->prepare("SELECT id FROM listings WHERE id = ?");
    $stmt->execute([$listingId]);
    if (!$stmt->fetch()) {
        echo json_encode(['success' => false, 'error' => 'Annonce inexistante']);
        exit;
    }

    // Vérifie si déjà liké
    $stmt = $pdo->prepare("SELECT id FROM favorites WHERE user_id = ? AND listing_id = ?");
    $stmt->execute([$userId, $listingId]);
    $existing = $stmt->fetch();

    if ($existing) {
        // Déjà liké -> On retire le favori
        $pdo->prepare("DELETE FROM favorites WHERE id = ?")->execute([$existing['id']]);
        $action = 'removed';
    } else {
        // Pas encore liké -> On ajoute le favori
        $pdo->prepare("INSERT INTO favorites (user_id, listing_id) VALUES (?, ?)")->execute([$userId, $listingId]);
        $action = 'added';
    }

    // Met à jour le cache favoris pour cet utilisateur
    $cacheDir = __DIR__ . '/cache';
    if (!is_dir($cacheDir)) {
        mkdir($cacheDir, 0755, true);
    }
    $cacheFile = $cacheDir . '/favorites_user_' . $userId . '.json';
    $stmt = $pdo->prepare("SELECT listing_id FROM favorites WHERE user_id = ?");
    $stmt->execute([$userId]);
    $favorites = array_column($stmt->fetchAll(), 'listing_id');
    file_put_contents($cacheFile, json_encode([
        'timestamp' => time(),
        'favorites' => $favorites
    ]));

    echo json_encode(['success' => true, 'action' => $action]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Erreur serveur']);
    // Ne JAMAIS envoyer $e->getMessage() directement en prod pour éviter fuite info !
}
?>
