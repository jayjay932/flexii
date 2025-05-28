<?php
session_start();
ini_set('display_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

try {
    $pdo = new PDO('mysql:host=localhost;dbname=airbnb_clone;charset=utf8', 'root', '', [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Connexion échouée : ' . $e->getMessage()]);
    exit;
}

// Dossier de destination
$uploadDir = __DIR__ . '/uploads/';
$avatarUrl = null;
$identityUrl = null;

// Upload avatar
if (isset($_FILES['avatar']) && $_FILES['avatar']['error'] === 0) {
    $avatarName = uniqid() . '_' . basename($_FILES['avatar']['name']);
    $avatarPath = $uploadDir . $avatarName;
    move_uploaded_file($_FILES['avatar']['tmp_name'], $avatarPath);
    $avatarUrl = 'uploads/' . $avatarName;
}

// Upload pièce d’identité
if (isset($_FILES['identity']) && $_FILES['identity']['error'] === 0) {
    $identityName = uniqid() . '_' . basename($_FILES['identity']['name']);
    $identityPath = $uploadDir . $identityName;
    move_uploaded_file($_FILES['identity']['tmp_name'], $identityPath);
    $identityUrl = 'uploads/' . $identityName;
}

// Champs du formulaire
$name        = $_POST['name'] ?? '';
$email       = $_POST['email'] ?? '';
$passwordRaw = $_POST['password'] ?? '';
$birth_year  = $_POST['birth_year'] ?? null;
$profession  = $_POST['profession'] ?? '';
$description = $_POST['description'] ?? '';
$host_type   = $_POST['host_type'] ?? '';

// Validation minimale
if (empty($name) || empty($email) || empty($passwordRaw)) {
    http_response_code(400);
    echo json_encode(['error' => 'Nom, email et mot de passe sont requis.']);
    exit;
}

// Vérifier si l’email existe déjà
$stmt = $pdo->prepare("SELECT id FROM hosts WHERE email = ?");
$stmt->execute([$email]);
if ($stmt->fetch()) {
    http_response_code(409);
    echo json_encode(['error' => 'Cet email est déjà utilisé.']);
    exit;
}

// Hacher le mot de passe
$passwordHashed = password_hash($passwordRaw, PASSWORD_DEFAULT);

// Enregistrement
try {
    $stmt = $pdo->prepare("
        INSERT INTO hosts (name, email, password, avatar_url, identity_url, birth_year, profession, description, total_reviews, rating, years_as_host, superhost, host_type)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, 0, 0, 0, ?)
    ");
    $stmt->execute([
        $name,
        $email,
        $passwordHashed,
        $avatarUrl,
        $identityUrl,
        $birth_year,
        $profession,
        $description,
        $host_type
    ]);

    echo json_encode(['success' => true, 'message' => 'Profil enregistré avec succès.']);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Erreur lors de l’enregistrement : ' . $e->getMessage()]);
}
