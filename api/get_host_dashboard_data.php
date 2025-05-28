<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');


// Connexion DB
$pdo = new PDO("mysql:host=localhost;dbname=airbnb_clone;charset=utf8", "root", "");


// host_id à recevoir depuis le frontend (ex: ?host_id=1)
$host_id = isset($_GET['host_id']) ? intval($_GET['host_id']) : 0;

// Nombre total de logements de l’hôte
$stmt = $pdo->prepare("SELECT COUNT(*) FROM listings WHERE host_id = ?");
$stmt->execute([$host_id]);
$totalLogements = $stmt->fetchColumn();

// Logements créés cette semaine
$stmt = $pdo->prepare("SELECT COUNT(*) FROM listings WHERE host_id = ? AND WEEK(created_at) = WEEK(NOW())");
$stmt->execute([$host_id]);
$logementsCetteSemaine = $stmt->fetchColumn();

// Logements créés ce mois
$stmt = $pdo->prepare("SELECT COUNT(*) FROM listings WHERE host_id = ? AND MONTH(created_at) = MONTH(NOW())");
$stmt->execute([$host_id]);
$logementsCeMois = $stmt->fetchColumn();

// Chiffre d'affaires réel basé sur les réservations
$stmt = $pdo->prepare("
    SELECT SUM(b.total_price) AS total
    FROM bookings b
    JOIN listings l ON b.listing_id = l.id
    WHERE l.host_id = ?
");
$stmt->execute([$host_id]);
$chiffreAffaires = $stmt->fetchColumn() ?: 0;



// Chiffre d'affaires TOTAL (sur l’année) basé sur check_in
$stmt = $pdo->prepare("
    SELECT SUM(b.total_price) AS total
    FROM bookings b
    JOIN listings l ON b.listing_id = l.id
    WHERE l.host_id = ?
    AND YEAR(b.check_in) = YEAR(NOW())
");
$stmt->execute([$host_id]);
$chiffreAffairesTotalAnnee = $stmt->fetchColumn() ?: 0;


// Chiffre d'affaires CETTE SEMAINE
$stmt = $pdo->prepare("
    SELECT SUM(b.total_price) AS total
    FROM bookings b
    JOIN listings l ON b.listing_id = l.id
    WHERE l.host_id = ?
    AND WEEK(b.created_at, 1) = WEEK(NOW(), 1)
    AND YEAR(b.created_at) = YEAR(NOW())
");
$stmt->execute([$host_id]);
$chiffreAffairesSemaine = $stmt->fetchColumn() ?: 0;

// Chiffre d'affaires CE MOIS
$stmt = $pdo->prepare("
    SELECT SUM(b.total_price) AS total
    FROM bookings b
    JOIN listings l ON b.listing_id = l.id
    WHERE l.host_id = ?
    AND MONTH(b.created_at) = MONTH(NOW())
    AND YEAR(b.created_at) = YEAR(NOW())
");
$stmt->execute([$host_id]);
$chiffreAffairesMois = $stmt->fetchColumn() ?: 0;



// Logements occupés simulés (par ex. 70% des logements pour la démo)
$logementsOccupes = round($totalLogements * 0.7);

// Demandes (statuts)
$stmt = $pdo->prepare("SELECT id, title AS titre, statut, motif FROM listings WHERE host_id = ?");

$stmt->execute([$host_id]);
$demandes = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Détail logements
$stmt = $pdo->prepare("SELECT id, title AS titre, max_guests AS voyageurs, price_per_night AS prix, statut FROM listings WHERE host_id = ?");
$stmt->execute([$host_id]);
$logements = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Données de revenus simulées (exemple sur 4 semaines)
// Vrais revenus par semaine de l'année en cours (basé sur check_in)
$stmt = $pdo->prepare("
    SELECT WEEK(b.check_in, 1) AS semaine, SUM(b.total_price) AS revenu
    FROM bookings b
    JOIN listings l ON b.listing_id = l.id
    WHERE l.host_id = ?
    AND YEAR(b.check_in) = YEAR(NOW())
    GROUP BY semaine
    ORDER BY semaine ASC
");
$stmt->execute([$host_id]);
$revenusParSemaine = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Formatter les semaines sous forme lisible
$revenusData = [];
foreach ($revenusParSemaine as $row) {
    $revenusData[] = [
        "name" => "Semaine " . $row['semaine'],
        "revenu" => (float) $row['revenu']
    ];
}

// Nombre de logements réservés CETTE SEMAINE
$stmt = $pdo->prepare("
    SELECT COUNT(DISTINCT b.listing_id) 
    FROM bookings b
    JOIN listings l ON b.listing_id = l.id
    WHERE l.host_id = ?
    AND WEEK(b.created_at, 1) = WEEK(NOW(), 1)
    AND YEAR(b.created_at) = YEAR(NOW())
");
$stmt->execute([$host_id]);
$logementsReservesSemaine = $stmt->fetchColumn() ?: 0;

// Nombre de logements réservés CE MOIS
$stmt = $pdo->prepare("
    SELECT COUNT(DISTINCT b.listing_id) 
    FROM bookings b
    JOIN listings l ON b.listing_id = l.id
    WHERE l.host_id = ?
    AND MONTH(b.created_at) = MONTH(NOW())
    AND YEAR(b.created_at) = YEAR(NOW())
");
$stmt->execute([$host_id]);
$logementsReservesMois = $stmt->fetchColumn() ?: 0;


// Nombre de réservations CETTE SEMAINE (basé sur check_in)
$stmt = $pdo->prepare("
    SELECT COUNT(*) 
    FROM bookings b
    JOIN listings l ON b.listing_id = l.id
    WHERE l.host_id = ?
    AND WEEK(b.check_in, 1) = WEEK(NOW(), 1)
    AND YEAR(b.check_in) = YEAR(NOW())
");
$stmt->execute([$host_id]);
$reservationsSemaine = $stmt->fetchColumn() ?: 0;

// Nombre de réservations CE MOIS (basé sur check_in)
$stmt = $pdo->prepare("
    SELECT COUNT(*) 
    FROM bookings b
    JOIN listings l ON b.listing_id = l.id
    WHERE l.host_id = ?
    AND MONTH(b.check_in) = MONTH(NOW())
    AND YEAR(b.check_in) = YEAR(NOW())
");
$stmt->execute([$host_id]);
$reservationsMois = $stmt->fetchColumn() ?: 0;

// Chiffre d'affaires CE MOIS (basé sur check_in, non created_at)
$stmt = $pdo->prepare("
    SELECT SUM(b.total_price) AS total
    FROM bookings b
    JOIN listings l ON b.listing_id = l.id
    WHERE l.host_id = ?
    AND MONTH(b.check_in) = MONTH(NOW())
    AND YEAR(b.check_in) = YEAR(NOW())
");
$stmt->execute([$host_id]);
$chiffresAffairesMois = $stmt->fetchColumn() ?: 0;

// Réponse JSON
echo json_encode([
    "totalLogements" => $totalLogements,
    "logementsCetteSemaine" => $reservationsSemaine,
    "logementsCeMois" => $reservationsMois,
    "chiffreAffaires" => $chiffresAffairesMois,
    "chiffreAffairesSemaine" => $chiffreAffairesSemaine,
        "chiffreAffairesMois" => $chiffreAffairesMois,
          "logementsReservesSemaine" => $logementsReservesSemaine,
    "logementsReservesMois" => $logementsReservesMois,
    "logementsOccupes" => $logementsOccupes,
    "demandes" => $demandes,
    "logements" => $logements,
    "revenusData" => $revenusData,
]);
