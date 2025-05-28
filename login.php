<?php
session_start();

// Connexion sécurisée
try {
    $pdo = new PDO('mysql:host=localhost;dbname=airbnb_clone;charset=utf8mb4', 'root', '', [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);
} catch (PDOException $e) {
    die('Erreur de connexion sécurisée.');
}

// Récupération des données sécurisées
function cleanInput($data) {
    return htmlspecialchars(trim($data), ENT_QUOTES, 'UTF-8');
}

$email = cleanInput($_POST['email'] ?? '');
$password = $_POST['password'] ?? '';

if (empty($email) || empty($password)) {
    header('Location: index.php?error=missing_fields');
    exit;
}

// Vérifier que l'email est valide
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    header('Location: index.php?error=invalid_email');
    exit;
}

// Chercher l'utilisateur
$stmt = $pdo->prepare('SELECT id, name, password_hash, avatar_url FROM users WHERE email = ? LIMIT 1');
$stmt->execute([$email]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

// Vérifier le mot de passe
if ($user && password_verify($password, $user['password_hash'])) {
    // Connexion réussie
    $_SESSION['user_id'] = $user['id'];
    $_SESSION['user_name'] = $user['name'];
    $_SESSION['user_avatar'] = $user['avatar_url'] ?: 'f.png';
    
    header('Location: index.php');
    exit;
} else {
    // Mauvais identifiants
    header('Location: index.php?error=invalid_credentials');
    exit;
}
?>
