<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
session_start();

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Headers: Content-Type');




// Connexion à la base de données
try {
    $pdo = new PDO('mysql:host=localhost;dbname=airbnb_clone;charset=utf8mb4', 'root', '', [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Erreur de connexion à la base de données']);
    exit;
}

// Récupération des données POST
$data = json_decode(file_get_contents("php://input"), true);
$email = filter_var($data['email'] ?? '', FILTER_SANITIZE_EMAIL);
$password = $data['password'] ?? '';





// Validation des champs
if (!$email || !$password) {
    echo json_encode(['success' => false, 'message' => 'Champs manquants']);
    exit;
}

// Rechercher l'utilisateur
$stmt = $pdo->prepare('SELECT id, name, password_hash, avatar_url FROM users WHERE email = ? LIMIT 1');
$stmt->execute([$email]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

// Vérification du mot de passe
if ($user && password_verify($password, $user['password_hash'])) {
    // Connexion réussie
    $_SESSION['user_id'] = $user['id'];
    $_SESSION['user_name'] = $user['name'];
    $_SESSION['user_avatar'] = $user['avatar_url'] ?: 'f.png';

    echo json_encode([
        'success' => true,
        'user' => [
            'id' => $user['id'],
            'name' => $user['name'],
            'avatar' => $_SESSION['user_avatar']
        ]
    ]);
    exit;
} else {
    echo json_encode(['success' => false, 'message' => 'Identifiants invalides']);
    exit;
}
