<?php


session_start();

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Si la requête est une pré-vérification CORS (OPTIONS), on répond 200 directement
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

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

// Sécurité
function clean($val) {
    return htmlspecialchars(trim($val), ENT_QUOTES, 'UTF-8');
}

$lastname = clean($data['lastname'] ?? '');
$firstname = clean($data['firstname'] ?? '');
$email = filter_var($data['email'] ?? '', FILTER_SANITIZE_EMAIL);
$phone = clean($data['phone'] ?? '');
$password = $data['password'] ?? '';

// Vérifications
if (!$lastname || !$firstname || !$email || !$phone || !$password) {
    echo json_encode(['success' => false, 'message' => 'Tous les champs sont requis']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Email invalide']);
    exit;
}

// Vérifier si l'email existe déjà
$stmt = $pdo->prepare('SELECT id FROM users WHERE email = ?');
$stmt->execute([$email]);
if ($stmt->fetch()) {
    echo json_encode(['success' => false, 'message' => 'Email déjà utilisé']);
    exit;
}

// Insérer dans la base
$hash = password_hash($password, PASSWORD_BCRYPT);
$fullname = "$firstname $lastname";
$avatar = 'flexii.png';

$stmt = $pdo->prepare("INSERT INTO users (name, email, password_hash, phone, avatar_url, created_at)
                       VALUES (?, ?, ?, ?, ?, NOW())");

$stmt->execute([$fullname, $email, $hash, $phone, $avatar]);

// Auto-login
$userId = $pdo->lastInsertId();
$_SESSION['user_id'] = $userId;
$_SESSION['user_name'] = $fullname;
$_SESSION['user_avatar'] = $avatar;

echo json_encode([
    'success' => true,
    'user' => [
        'id' => $userId,
        'name' => $fullname,
        'avatar' => $avatar
    ]
]);
