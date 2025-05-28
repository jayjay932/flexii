
<?php
session_start();
?>

<!DOCTYPE html>

<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>Airbnb Clone</title>

  <!-- Styles externes (CSS) -->
  <link rel="stylesheet" href="styles/styles.css">
  <link rel="stylesheet" href="styles/filter.css">
  <link rel="stylesheet" href="styles/searchbar.css">
  <link rel="stylesheet" href="styles/mobilemenu.css">
  <link rel="stylesheet" href="styles/hidedesk.css">
  <link rel="stylesheet" href="styles/card.css">

  <!-- Icones (CDN) -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css">
  <link href='https://unpkg.com/css.gg@2.0.0/icons/css/chevron-right-o.css' rel='stylesheet'>
  <link href='https://unpkg.com/css.gg@2.0.0/icons/css/chevron-left-o.css' rel='stylesheet'>
</head>

<body>


<?php if (isset($_GET['error'])): ?>
  <div class="alert">
    <?php
    switch ($_GET['error']) {
        case 'email_taken': echo "Email déjà utilisé."; break;
        case 'invalid_email': echo "Adresse email invalide."; break;
        case 'missing_fields': echo "Merci de remplir tous les champs."; break;
        case 'invalid_credentials': echo "Email ou mot de passe incorrect."; break;
    }
    ?>
  </div>
<?php endif; ?>




<!-- Barre mobile -->
<div class="mobile-menu-toggle" onclick="toggleMobileMenu()">
  <i class="bi bi-list"></i>
</div>

<div id="mobileMenu" class="mobile-menu hidden">
  <ul>
    <li><a href="#">Stays</a></li>
    <li><a href="#">Experiences</a></li>
    <li><a href="#">Online Experiences</a></li>
    <li><a href="#">publier une annonce</a></li>
    <li><a href="#">Login</a></li>
    <li><a href="#">Sign up</a></li>
  </ul>
</div>

<div class="bar">
  <div class="f">
    <h1><u>Learn about Guests' favorites, the most loved homes on Airbnb</u></h1>
  </div>
</div>

<div class="combine">
  <div class="flexbox">
    <img src="f.png" class="icon1" alt="Logo">

    <div class="flex1">
      <button class="but1">Logement</button>
      <button class="but1">Voiture</button>
      <button class="but2">Restauration</button>
    </div>

    <div class="flex2">
      <button class="but3">publier une annonce</button>
      <button class="icon2"><i class="bi bi-globe"></i></button>
      <button class="f1" id="profileButton">
  <i class="bi bi-sliders2"></i>
  <?php if (isset($_SESSION['user_avatar'])): ?>
    <img src="<?= htmlspecialchars($_SESSION['user_avatar']) ?>" alt="Avatar" class="avatar-img">
  <?php else: ?>
    <i class="bi bi-person-circle"></i>
  <?php endif; ?>
</button>

    </div>
  </div>
  <div id="profileMenu" class="profile-menu hidden">
  <ul>
    <?php if (isset($_SESSION['user_id'])): ?>
      <!-- CONNECTÉ -->
      <li><a href="#">Messages</a></li>
      <li><a href="#">Notifications <span class="notif-dot"></span></a></li>
      <li><a href="#">Voyages</a></li>
      <li><a href="#">Favoris</a></li>
      <hr>
      <li><a href="#">Gérer mes annonces</a></li>
      <li><a href="#">Créer une expérience</a></li>
      <li><a href="#">Parrainer un hôte</a></li>
      <li><a href="#">Compte</a></li>
      <hr>
      <li><a href="#">Cartes cadeaux</a></li>
      <li><a href="#">Centre d'aide</a></li>
      <li><a href="logout.php">Déconnexion</a></li>
    <?php else: ?>
      <!-- NON CONNECTÉ -->
      <li><a href="#" onclick="openLogin()">Connexion</a></li>
      <li><a href="#" onclick="openSignup()">Inscription</a></li>
      <li><a href="#">Mettre mon logement</a></li>
      <li><a href="#">Créer une expérience</a></li>
      <li><a href="#">Centre d'aide</a></li>
    <?php endif; ?>
  </ul>
</div>



<!-- Formulaire d'Inscription Modernisé -->
<div id="signupModal" class="modal hidden">
  <div class="modal-content login-style">
    <img src="f.png" alt="Logo" class="logo-modal">
    <h2 class="modal-title">Inscription</h2>
    <form action="signup.php" method="POST" class="signup-form">
      <div class="input-group">
        <i class="bi bi-person"></i>
        <input type="text" name="lastname" placeholder="Nom" required>
      </div>
      <div class="input-group">
        <i class="bi bi-person"></i>
        <input type="text" name="firstname" placeholder="Prénom" required>
      </div>
      <div class="input-group">
        <i class="bi bi-envelope"></i>
        <input type="email" name="email" placeholder="Adresse email" required>
      </div>
      <div class="input-group">
        <i class="bi bi-telephone"></i>
        <input type="text" name="phone" placeholder="Téléphone" required>
      </div>
      <div class="input-group">
        <i class="bi bi-lock"></i>
        <input type="password" name="password" placeholder="Mot de passe" required>
      </div>
      <button type="submit" class="btn-login">S'inscrire</button>
    </form>
    <p class="login-link">Déjà inscrit ? <a href="#" onclick="openLogin()">Se connecter</a></p>
    <button class="close-button" onclick="closeSignup()">✖</button>
  </div>
</div>




<!-- Formulaire Connexion Modernisé -->
<div id="loginModal" class="modal hidden">
  <div class="modal-content login-style">
    <img src="f.png" alt="Logo" class="logo-modal">
    <h2 class="modal-title">Se connecter</h2>
    <form action="login.php" method="POST" class="login-form">
      <div class="input-group">
        <i class="bi bi-envelope"></i>
        <input type="email" name="email" placeholder="Adresse email" required>
      </div>
      <div class="input-group">
        <i class="bi bi-lock"></i>
        <input type="password" name="password" placeholder="Mot de passe" required>
      </div>
      <button type="submit" class="btn-login">Connexion</button>
    </form>
    <p class="login-link">Pas encore inscrit ? <a href="#" onclick="openSignup()">Créer un compte</a></p>
    <button class="close-button" onclick="closeLogin()">✖</button>
  </div>
</div>







  <!-- Navigation par catégories -->

  <div class=flexbox3>
    <div class="icon4"><i class="bi bi-caret-left-fill"></i></div>
    <div class="Allicons">
      <!-- catégories ici -->
      <div class="icon3"><img src="https://a0.muscache.com/pictures/3fb523a0-b622-4368-8142-b5e03df7549b.jpg" alt=""><br><p5>Iconic cities</p5></div>
      <div class="icon3"><img src="https://a0.muscache.com/pictures/4221e293-4770-4ea8-a4fa-9972158d4004.jpg" alt=""><br><p5>Countryside</p5></div>
      <div class="icon3"><img src="https://a0.muscache.com/pictures/3fb523a0-b622-4368-8142-b5e03df7549b.jpg" alt=""><br><p5>Earth homes</p5></div>
      <div class="icon3"><img src="https://a0.muscache.com/pictures/3fb523a0-b622-4368-8142-b5e03df7549b.jpg" alt=""><br><p5>Amazing views</p5></div>
      <div class="icon3"><img src="https://a0.muscache.com/pictures/3fb523a0-b622-4368-8142-b5e03df7549b.jpg" alt=""><br><p5>OMG!</p5></div>
      <div class="icon3"><img src="https://a0.muscache.com/pictures/3fb523a0-b622-4368-8142-b5e03df7549b.jpg" alt=""><br><p5>Domes</p5></div>
      <div class="icon3"><img src="https://a0.muscache.com/pictures/3fb523a0-b622-4368-8142-b5e03df7549b.jpg" alt=""><br><p5>Creative spaces</p5></div>
      <div class="icon3"><img src="https://a0.muscache.com/pictures/3fb523a0-b622-4368-8142-b5e03df7549b.jpg" alt=""><br><p5>Trending</p5></div>
      <div class="icon3"><img src="https://a0.muscache.com/pictures/3fb523a0-b622-4368-8142-b5e03df7549b.jpg" alt=""><br><p5>Castles</p5></div>
    </div>
    <div class="f2">
      <div class="icon4"><i class="bi bi-caret-right-fill"></i></div>
      <button class="fl2" onclick="toggleFilterOptions()">
        <i class="bi bi-sliders2"></i><h4>Filters</h4>
      </button>
      <div class="sort-container">
        <i class="bi bi-arrow-down-up"></i>
        <select class="sort-select" onchange="sortListings(this.value)">
          <option value="">Sort by</option>
          <option value="price_low">Low to High</option>
          <option value="price_high">High to Low</option>
          <option value="newest">Newest</option>
        </select>
      </div>
    </div>
  </div>
</div>

<!-- Barre de recherche mobile -->
<div id="mobileSearchBar" class="mobile-search-bar-collapsed" onclick="toggleSearchBar()">
  <div class="search-summary">
    <span>Where</span> — <span>Add dates</span> — <span>Add guests</span>
    <i class="bi bi-search" style="margin-left:auto; color: #FF385C;"></i>
  </div>
</div>

<!-- Filtres pour mobile -->
<div class="mobile-filter-sort">
  <button onclick="toggleFilterOptions()" class="filter-toggle">
    <i class="bi bi-sliders"></i> Filters
  </button>
  <div class="sort-wrapper">
    <i class="bi bi-arrow-down-up"></i>
    <select class="sort-select" onchange="sortListings(this.value)">
      <option value="">Sort by</option>
      <option value="price_low">Low to High</option>
      <option value="price_high">High to Low</option>
      <option value="newest">Newest</option>
    </select>
  </div>
</div>

<div class="filter-options hidden"></div>
<?php
// -------------------------------
// Partie PHP avec Cache optimisé
// -------------------------------
try {
  $pdo = new PDO('mysql:host=localhost;dbname=airbnb_clone;charset=utf8', 'root', '', [
      PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
  ]);
} catch (PDOException $e) {
  die("Erreur de connexion : " . htmlspecialchars($e->getMessage()));
}

// Config générale
$cacheDuration = 900; // 15 minutes = 900 secondes
$cacheDir = __DIR__ . '/cache';
if (!is_dir($cacheDir)) mkdir($cacheDir, 0755, true);

// Gestion du ClearCache ?clearcache=1
if (isset($_GET['clearcache']) && $_GET['clearcache'] == 1) {
    array_map('unlink', glob("$cacheDir/*.json"));
}

// Sécurité du tri
$orderBy = "created_at DESC";
if (!empty($_GET['sort'])) {
    $sort = $_GET['sort'];
    $allowedSorts = ['price_low', 'price_high', 'newest'];
    if (in_array($sort, $allowedSorts)) {
        switch ($sort) {
            case 'price_low': $orderBy = "price_per_night ASC"; break;
            case 'price_high': $orderBy = "price_per_night DESC"; break;
            case 'newest': default: $orderBy = "created_at DESC"; break;
        }
    }
}

// Chargement Listings depuis le cache ou DB
$listings = [];
$cacheFileListings = $cacheDir . '/listings_' . md5($orderBy) . '.json';

if (file_exists($cacheFileListings) && (time() - filemtime($cacheFileListings)) < $cacheDuration) {
    $data = @file_get_contents($cacheFileListings);
    $listings = json_decode($data, true);
    if (!$listings) {
        unlink($cacheFileListings); // Fichier corrompu → suppression
        $listings = [];
    }
}

if (empty($listings)) {
    try {
        $pdo = new PDO('mysql:host=localhost;dbname=airbnb_clone;charset=utf8', 'root', '', [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
        ]);
        $stmt = $pdo->query("SELECT * FROM listings ORDER BY $orderBy");
        $listings = $stmt->fetchAll(PDO::FETCH_ASSOC);
        file_put_contents($cacheFileListings, json_encode($listings));
    } catch (PDOException $e) {
        die("Erreur de connexion : " . htmlspecialchars($e->getMessage()));
    }
}

// Pré-chargement des IMAGES et RATINGS en 1 seule fois
$allImages = [];
$allRatings = [];

try {
    if (!empty($listings)) {
        $ids = array_column($listings, 'id');
        $idsStr = implode(',', array_map('intval', $ids));
        
        // Images
        $stmt = $pdo->query("SELECT listing_id, image_url FROM listing_images WHERE listing_id IN ($idsStr)");
        foreach ($stmt as $row) {
            $allImages[$row['listing_id']][] = $row['image_url'];
        }
        
        // Ratings
        $stmt = $pdo->query("SELECT listing_id, AVG(rating) as avg_rating FROM comments WHERE listing_id IN ($idsStr) GROUP BY listing_id");
        foreach ($stmt as $row) {
            $allRatings[$row['listing_id']] = $row['avg_rating'] ?: 0.0;
        }
    }
} catch (PDOException $e) {
    // continue sans images ni ratings en cas d'erreur
}




?><!-- Listings affichés -->
<div class="flexbox4">

<?php
$favoritedListings = [];

if (isset($_SESSION['user_id'])) {
  try {
    $stmt = $pdo->prepare("SELECT listing_id FROM favorites WHERE user_id = ?");
    $stmt->execute([$_SESSION['user_id']]);
    $favoritedListings = array_column($stmt->fetchAll(PDO::FETCH_ASSOC), 'listing_id');
  } catch (PDOException $e) {
    // Ignore en cas d'erreur
  }
}
?>

  
  <?php foreach ($listings as $listing): ?>
    <div class="card1">
      <div class="carousel">
        <button class="prev">&#10094;</button>

        <?php
        $images = $allImages[$listing['id']] ?? [];
        foreach ($images as $index => $img): ?>
          <a href="details.php?id=<?= (int)$listing['id'] ?>">
            <img src="<?= htmlspecialchars($img) ?>" class="img1" alt="Image logement" style="<?= $index === 0 ? 'display:block;' : 'display:none;' ?>">
          </a>
        <?php endforeach; ?>

        <button class="next">&#10095;</button>
      </div>

      <div class="like <?= in_array($listing['id'], $favoritedListings) ? 'active' : '' ?>" data-id="<?= (int)$listing['id'] ?>">
  <i class="bi bi-suit-heart-fill <?= in_array($listing['id'], $favoritedListings) ? 'liked' : '' ?>"></i>
</div>


      <div class="set">
        <div class="lef">
          <h7>
            <a href="details.php?id=<?= (int)$listing['id'] ?>" style="text-decoration:none; color:inherit;">
              <?= htmlspecialchars($listing['title']) ?>
            </a>
          </h7>
          <p7><br><?= htmlspecialchars($listing['city']) . ', ' . htmlspecialchars($listing['country']) ?><br><?= date('d-m-Y', strtotime($listing['created_at'])) ?><br></p7>
          <div class="h"><strong>€<?= number_format($listing['price_per_night'], 0) ?></strong> / night</div>
        </div>

        <div class="rate">
          <i class="bi bi-star-fill"></i>
          <?= number_format((float)($allRatings[$listing['id']] ?? 0.0), 1) ?>
        </div>
      </div>
    </div>
  <?php endforeach; ?>
</div>

<!-- Footer et scripts inchangés -->

<!-- Footer -->
<div class="last">
  <div><b>Support</b><br>Help Centre<br>AirCover<br>Anti-discrimination<br>Disability support<br>Cancellation options<br>Report neighbourhood concern</div>
  <div><b>Hosting</b><br>publier une annonce<br>AirCover for Hosts<br>Hosting resources<br>Community forum<br>Hosting responsibly</div>
  <div><b>Airbnb</b><br>Newsroom<br>New features<br>Careers<br>Investors<br>Airbnb.org emergency stays</div>
</div>

<div class="la">
  <div>© 2024 Airbnb, Inc. Privacy | Terms | Sitemap | Company details</div>
</div>

<!-- Scripts -->
<script src="jscode/filter.js" defer></script>
<script src="jscode/searchbar.js" defer></script>
<script src="jscode/mobilemenu.js" defer></script>
<script src="jscode/card.js" defer></script>


<script>


document.addEventListener('DOMContentLoaded', function () {
  const likeButtons = document.querySelectorAll('.like');

  likeButtons.forEach(button => {
    button.addEventListener('click', function (e) {
      e.preventDefault();

      const isLoggedIn = <?= isset($_SESSION['user_id']) ? 'true' : 'false' ?>;

      if (!isLoggedIn) {
        openLogin();
        return;
      }

      const listingId = this.getAttribute('data-id');
      const heartIcon = this.querySelector('i');

      fetch('add_favori.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'listing_id=' + encodeURIComponent(listingId)
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          heartIcon.classList.toggle('liked');
          this.classList.toggle('active');
        } else {
          alert('Erreur lors du traitement du like.');
        }
      })
      .catch(error => {
        console.error('Erreur:', error);
      });
    });
  });
});
  
</script>
</body>
</html>
