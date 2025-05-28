<?php
$pdo = new PDO('mysql:host=localhost;dbname=airbnb_clone;charset=utf8', 'root', '');

if (!isset($_GET['id'], $_GET['start_date'], $_GET['end_date'])) {
  die("Paramètres manquants.");
}

$id = (int) $_GET['id'];
$start = new DateTime($_GET['start_date']);
$end = new DateTime($_GET['end_date']);

$stmt = $pdo->prepare("SELECT * FROM listings WHERE id = ?");
$stmt->execute([$id]);
$listing = $stmt->fetch(PDO::FETCH_ASSOC);
if (!$listing) die("Logement introuvable.");

$stmtImg = $pdo->prepare("SELECT image_url FROM listing_images WHERE listing_id = ? LIMIT 1");
$stmtImg->execute([$id]);
$mainImage = $stmtImg->fetchColumn();

$nbNuits = $start->diff($end)->days;
$totalPrice = $nbNuits * $listing['price_per_night'];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $interval = new DateInterval('P1D');
  $period = new DatePeriod($start, $interval, $end);

  $stmt = $pdo->prepare("INSERT INTO availabilities (listing_id, date, is_available) VALUES (?, ?, 0) ON DUPLICATE KEY UPDATE is_available = 0");
  foreach ($period as $date) {
    $stmt->execute([$id, $date->format('Y-m-d')]);
  }

  $stmt = $pdo->prepare("INSERT INTO bookings (user_id, listing_id, check_in, check_out, total_price) VALUES (?, ?, ?, ?, ?)");
  $stmt->execute([
    1,
    $id,
    $start->format('Y-m-d'),
    $end->format('Y-m-d'),
    $totalPrice
  ]);

  header("Location: listing.php?id=$id&success=1");
  exit;
}
?>

<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Checkout | Oneko</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>

html, body {
  margin: 0;
  padding: 0;
  font-family: 'Segoe UI', sans-serif;
  max-width: 100%;
  overflow-x: hidden;
  background: #fff;
}

.checkout-wrapper {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex-wrap: wrap;
  max-width: 1200px;
  margin: 40px auto;
  gap: 30px;
  padding: 0 20px;
}

.checkout-left, .checkout-right {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.06);
  padding: 25px;
}

.checkout-left {
  flex: 1;
  min-width: 300px;
  display: flex;
  flex-direction: column;
}

.checkout-right {
  width: 370px;
}

.logo {
  width: 100px;
  margin-bottom: 25px;
}

h1 {
  font-size: 28px;
  margin-bottom: 20px;
  color: #111;
}

.section {
  margin-bottom: 30px;
}

.section-title {
  font-weight: bold;
  font-size: 18px;
  margin-bottom: 12px;
}

.payment-method {
  background: #f9f9f9;
  padding: 15px;
  border-radius: 10px;
  margin-bottom: 10px;
  cursor: pointer;
  border: 2px solid transparent;
}

.payment-method:hover {
  border-color: #ff385c;
}

.btn-submit {
  background: #222;
  color: white;
  padding: 14px;
  width: 100%;
  font-size: 16px;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.cancel-link {
  display: block;
  margin-top: 15px;
  text-align: center;
  text-decoration: none;
  color: #ff385c;
  font-weight: bold;
}

.summary-image {
  width: 100%;
  height: 180px;
  border-radius: 12px;
  background: url('<?= $mainImage ?>') center/cover no-repeat;
  margin-bottom: 15px;
}

.price-detail p {
  margin: 6px 0;
  font-size: 15px;
  color: #555;
}

.price-detail strong {
  color: #111;
}

/* -------- RESPONSIVE -------- */
@media screen and (max-width: 768px) {
  .checkout-wrapper {
    flex-direction: column;
    padding: 15px;
  }

  .checkout-left, .checkout-right {
    width: 100%;
    box-sizing: border-box;
  }

  /* RÉORDONNANCEMENT sur mobile */
  .checkout-left {
    order: 2;
    padding: 20px 15px;
  }

  .checkout-right {
    order: 1;
    padding: 20px 15px;
  }

  .logo {
    width: 90px;
    margin: 0 auto 20px auto;
    display: block;
  }

  h1 {
    font-size: 22px;
    text-align: center;
  }

  .section-title {
    font-size: 16px;
  }

  .btn-submit {
    font-size: 15px;
    padding: 12px;
  }

  .payment-method {
    font-size: 14px;
  }

  .summary-image {
    height: 160px;
  }

  .cancel-link {
    font-size: 14px;
  }
}

@media screen and (max-width: 480px) {
  .logo {
    width: 80px;
  }

  .payment-method {
    font-size: 13px;
    padding: 12px;
  }

  .price-detail p {
    font-size: 14px;
  }

  .cancel-link {
    font-size: 13px;
  }
}
/* -------- NAVBAR -------- */
.navbar {
  background: linear-gradient(to right, #FF385C, #FFC1D3);
  padding: 12px 20px;
  display: flex;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.navbar-container {
  width: 100%;
  max-width: 1200px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}

.navbar-left {
  display: flex;
  align-items: center;
}

.navbar-logo {
  width: 38px;
  height: auto;
  margin-right: 10px;
}

.navbar-title {
  font-size: 20px;
  font-weight: bold;
  color: white;
}

.navbar-links {
  list-style: none;
  display: flex;
  gap: 18px;
  margin: 0;
  padding: 0;
  flex-wrap: wrap;
}

.navbar-links li a {
  color: white;
  text-decoration: none;
  font-weight: 500;
  font-size: 15px;
  transition: opacity 0.2s ease;
  white-space: nowrap;
}

.navbar-links li a:hover {
  opacity: 0.8;
}

/* ---- RESPONSIVE ---- */
@media screen and (max-width: 768px) {
  .navbar-container {
    flex-direction: row;
    justify-content: space-between;
  }

  .navbar-links {
    justify-content: flex-end;
    flex-wrap: nowrap;
    overflow-x: auto;
  }

  .navbar-links::-webkit-scrollbar {
    display: none; /* cache la scrollbar */
  }
}

/* -------- FOOTER -------- */
.footer {
  background: #f9f9f9;
  text-align: center;
  padding: 20px 10px;
  font-size: 14px;
  color: #777;
  border-top: 1px solid #eee;
  margin-top: 40px;
}

@media screen and (max-width: 768px) {
  .navbar-title {
    font-size: 18px;
  }
}


  </style>
</head>
<body>
    <!-- Navbar -->
<!-- Navbar -->
<nav class="navbar">
  <div class="navbar-container">
    <div class="navbar-left">
      <img src="f.png" alt="Oneko Logo" class="navbar-logo">
      <span class="navbar-title">flexii</span>
    </div>
    <ul class="navbar-links">
      <li><a href="index.php">Accueil</a></li>
      <li><a href="bookings.php">Mes réservations</a></li>
      <li><a href="messages.php">Messages</a></li>
      <li><a href="profile.php">Profil</a></li>
    </ul>
  </div>
</nav>


  <div class="checkout-wrapper">
    <div class="checkout-left">
      <img src="f.png" class="logo" alt="Oneko Logo">
      <h1>Demande de réservation</h1>

      <div class="section">
        <div class="section-title">1. Choisissez quand vous souhaitez payer</div>
        <div class="payment-method">Payer <?= number_format($totalPrice, 2) ?> € maintenant</div>
        <div class="payment-method">Payer en 3 fois sans frais<br><small>3 x <?= number_format($totalPrice / 3, 2) ?> €</small></div>
        <form method="POST">
          <button type="submit" class="btn-submit">Suivant</button>
        </form>
        <a href="listing.php?id=<?= $id ?>" class="cancel-link">Annuler</a>
      </div>

      <div class="section">
        <div class="section-title">2. Ajoutez un mode de paiement</div>
        <div class="payment-method">Carte Visa / Mastercard</div>
        <div class="payment-method">PayPal</div>
      </div>

      <div class="section">
        <div class="section-title">3. Vérifiez votre demande</div>
        <p>Vous serez prélevé uniquement si votre demande est acceptée par l'hôte.</p>
      </div>
    </div>

    <div class="checkout-right">
      <div class="summary-image"></div>
      <div class="section">
        <div><strong><?= htmlspecialchars($listing['title']) ?></strong></div>
        <small><?= htmlspecialchars($listing['address']) ?></small>
        <p style="margin-top: 8px; color: green; font-size: 14px;">Annulation gratuite jusqu'à 3 jours avant l'arrivée.</p>
      </div>

      <div class="section">
        <div class="section-title">Informations sur le voyage</div>
        <p><?= $start->format('j') ?>–<?= $end->format('j F Y') ?><br>1 adulte</p>
      </div>

      <div class="section">
        <div class="section-title">Détail du prix</div>
        <div class="price-detail">
          <p>Prix : <?= number_format($listing['price_per_night'], 2) ?> € x <?= $nbNuits ?> nuits</p>
          <p>Frais de ménage : 40,00 €</p>
          <p>Taxes : 8,50 €</p>
          <hr>
          <p><strong>Total : <?= number_format($totalPrice + 48.5, 2) ?> €</strong></p>
        </div>
      </div>
    </div>
  </div>
  <!-- Footer -->
<footer class="footer">
  <p>© <?= date('Y') ?> Oneko. Tous droits réservés.</p>
</footer>

</body>
</html>
