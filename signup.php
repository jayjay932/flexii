<?php
session_start();

// 1. Connexion sécurisée à la base de données
try {
    $pdo = new PDO('mysql:host=localhost;dbname=airbnb_clone;charset=utf8mb4', 'root', '', [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);
} catch (PDOException $e) {
    die('Erreur de connexion sécurisée.');
}

// 2. Récupérer et nettoyer les données
function cleanInput($data) {
    return htmlspecialchars(trim($data), ENT_QUOTES, 'UTF-8');
}

$lastname = cleanInput($_POST['lastname'] ?? '');
$firstname = cleanInput($_POST['firstname'] ?? '');
$email = cleanInput($_POST['email'] ?? '');
$phone = cleanInput($_POST['phone'] ?? '');
$password = $_POST['password'] ?? '';

// Vérification des champs obligatoires
if (empty($lastname) || empty($firstname) || empty($email) || empty($phone) || empty($password)) {
    header('Location: index.php?error=missing_fields');
    exit;
}

// Vérifier email valide
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    header('Location: index.php?error=invalid_email');
    exit;
}

// 3. Vérifier si l'email est déjà utilisé
$stmt = $pdo->prepare('SELECT id FROM users WHERE email = ? LIMIT 1');
$stmt->execute([$email]);
if ($stmt->fetch()) {
    header('Location: index.php?error=email_taken');
    exit;
}

// 4. Sécuriser le mot de passe
$passwordHash = password_hash($password, PASSWORD_BCRYPT);

// 5. Créer le champ "name" combiné prénom + nom
$fullName = $firstname . ' ' . $lastname;

// 6. Insérer l'utilisateur dans la BDD
$stmt = $pdo->prepare('INSERT INTO users (name, email, password_hash, phone, avatar_url, created_at) VALUES (?, ?, ?, ?, ?, NOW())');
$stmt->execute([
    $fullName,
    $email,
    $passwordHash,
    $phone,
    'f.png' // Avatar par défaut
]);

// 7. Auto-login direct après inscription
$_SESSION['user_id'] = $pdo->lastInsertId();
$_SESSION['user_name'] = $fullName;
$_SESSION['user_avatar'] = 'f.png';

// 8. Rediriger vers la page d'accueil
header('Location: index.php');
exit;
?>
