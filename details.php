<?php
// --- Configuration générale ---
$cacheDuration = 900; // 15 minutes
$cacheDir = __DIR__ . '/cache';
if (!is_dir($cacheDir)) mkdir($cacheDir, 0755, true);

// --- Sécurité Clear Cache (facultatif pour admin) ---
if (isset($_GET['clearcache']) && $_GET['clearcache'] == 1) {
    array_map('unlink', glob("$cacheDir/*.json"));
}

// --- Connexion PDO ---
try {
    $pdo = new PDO('mysql:host=localhost;dbname=airbnb_clone;charset=utf8', 'root', '', [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);
} catch (PDOException $e) {
    die("Erreur de connexion : " . htmlspecialchars($e->getMessage()));
}

// --- Sécurité GET id ---
if (!isset($_GET['id'])) die("Aucun logement spécifié.");
$id = (int)$_GET['id'];

// --- Chargement Listing depuis Cache ou DB ---
$listingCacheFile = "$cacheDir/listing_$id.json";
if (file_exists($listingCacheFile) && (time() - filemtime($listingCacheFile)) < $cacheDuration) {
    $listing = json_decode(file_get_contents($listingCacheFile), true);
} else {
    $stmt = $pdo->prepare("SELECT * FROM listings WHERE id = ?");
    $stmt->execute([$id]);
    $listing = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$listing) die("Logement introuvable.");
    file_put_contents($listingCacheFile, json_encode($listing));
}

// --- Images, Hôte et Commentaires en Cache ---
$imagesCacheFile = "$cacheDir/images_$id.json";
if (file_exists($imagesCacheFile) && (time() - filemtime($imagesCacheFile)) < $cacheDuration) {
    $images = json_decode(file_get_contents($imagesCacheFile), true);
} else {
    $stmtImg = $pdo->prepare("SELECT image_url FROM listing_images WHERE listing_id = ?");
    $stmtImg->execute([$id]);
    $images = $stmtImg->fetchAll(PDO::FETCH_COLUMN);
    file_put_contents($imagesCacheFile, json_encode($images));
}

$hostCacheFile = "$cacheDir/host_{$listing['host_id']}.json";
if (file_exists($hostCacheFile) && (time() - filemtime($hostCacheFile)) < $cacheDuration) {
    $host = json_decode(file_get_contents($hostCacheFile), true);
} else {
    $stmtHost = $pdo->prepare("SELECT * FROM hosts WHERE id = ?");
    $stmtHost->execute([$listing['host_id']]);
    $host = $stmtHost->fetch(PDO::FETCH_ASSOC);
    file_put_contents($hostCacheFile, json_encode($host));
}

$commentsCacheFile = "$cacheDir/comments_$id.json";
if (file_exists($commentsCacheFile) && (time() - filemtime($commentsCacheFile)) < $cacheDuration) {
    $comments = json_decode(file_get_contents($commentsCacheFile), true);
} else {
    $stmtComments = $pdo->prepare("SELECT comments.*, users.name, users.avatar_url FROM comments JOIN users ON comments.user_id = users.id WHERE listing_id = ? ORDER BY created_at DESC");
    $stmtComments->execute([$id]);
    $comments = $stmtComments->fetchAll(PDO::FETCH_ASSOC);
    file_put_contents($commentsCacheFile, json_encode($comments));
}


if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['start_date'], $_POST['end_date'], $_POST['listing_id'])) {
        $id = (int) $_POST['listing_id'];
        $start = trim($_POST['start_date']);
        $end = trim($_POST['end_date']);

        // Validation basique des dates
        if (preg_match('/^\d{4}-\d{2}-\d{2}$/', $start) && preg_match('/^\d{4}-\d{2}-\d{2}$/', $end)) {
            // Protection contre l'injection dans l'URL
            $id = urlencode($id);
            $start = urlencode($start);
            $end = urlencode($end);

            header("Location: checkout.php?id=$id&start_date=$start&end_date=$end");
            exit;
        } else {
            // Mauvais format de date
            http_response_code(400);
            die('Format de date invalide.');
        }
    } else {
        http_response_code(400);
        die('Champs manquants.');
    }
}



// --- Gestion Disponibilités calendrier (non cache car modifiable souvent) ---
$stmtDates = $pdo->prepare("SELECT date, is_available FROM availabilities WHERE listing_id = ?");
$stmtDates->execute([$id]);
$availabilities = $stmtDates->fetchAll(PDO::FETCH_ASSOC);
$formatted = [];
foreach ($availabilities as $row) {
    $formatted[$row['date']] = $row['is_available'];
}
?>

<?php
// Si la latitude ou la longitude n'est pas définie (NULL), alors on utilise Pointe-Noire par défaut
$defaultLatitude = -4.7821;
$defaultLongitude = 11.8632;

$latitude = $listing['latitude'] !== null ? $listing['latitude'] : $defaultLatitude;
$longitude = $listing['longitude'] !== null ? $listing['longitude'] : $defaultLongitude;
?>



<?php
// Nombre d'évaluations :
$stmtNbEvaluations = $pdo->prepare("SELECT COUNT(*) FROM comments WHERE listing_id = ?");
$stmtNbEvaluations->execute([$id]);
$totalEvaluations = $stmtNbEvaluations->fetchColumn();
?>

<?php
// Moyenne des notes :
$stmtAverageRating = $pdo->prepare("SELECT AVG(rating) FROM comments WHERE listing_id = ?");
$stmtAverageRating->execute([$id]);
$averageRating = $stmtAverageRating->fetchColumn();
?>



<?php
$stmtDates = $pdo->prepare("SELECT date, is_available FROM availabilities WHERE listing_id = ?");
$stmtDates->execute([$id]);
$availabilities = $stmtDates->fetchAll(PDO::FETCH_ASSOC);

$formatted = [];
foreach ($availabilities as $row) {
    $formatted[$row['date']] = $row['is_available'];
}
?>

<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">

<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title><?= htmlspecialchars($listing['title']) ?> | Airbnb Clone</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">

  <link rel="stylesheet" href="styles/detailnav.css">
  <link rel="stylesheet" href="styles/imagegrid.css">
  <link rel="stylesheet" href="styles/detail.css">
  <link rel="stylesheet" href="styles/detailrules.css">
  <link rel="stylesheet" href="styles/detaildescrip.css">
  <link rel="stylesheet" href="styles/detailhost.css">

  </head>
  
  <body>
  <!-- Barre de navigation -->

   <nav class="flexii-navbar">
  <div class="nav-left">
    <img src="f.png" alt="Logo Flexii" class="nav-logo">
  </div>
  
  <div class="nav-center">
    <a href="#" class="nav-link">Logement</a>
    <a href="#" class="nav-link">Voiture</a>
    <a href="#" class="nav-link">Restauration</a>
  </div>

  <div class="nav-right">

    <i class="fas fa-globe globe-icon"></i>
    <div class="nav-profile">
      <i class="fas fa-sliders-h"></i>
      <i class="fas fa-user"></i>
    </div>
  </div>
</nav>






  <!-- Galerie -->

<div class="container">
<div class="gallery-slider">
  <div class="carousel">
  <?php foreach ($images as $index => $img): ?>
          <img src="<?= htmlspecialchars($img) ?>" class="slide-img" style="<?= $index === 0 ? 'display:block;' : 'display:none;' ?>" loading="lazy" onclick="openGallery()">
        <?php endforeach; ?>
    <button class="nav left">&#10094;</button>
    <button class="nav right">&#10095;</button>
  </div>
</div>

    <!-- Galerie pleine page -->
<div id="fullGallery" class="full-gallery" style="display:none;">
  <div class="gallery-header">
    <button onclick="closeGallery()" class="close-gallery-btn">✕</button>
    <h2>Photos du logement</h2>
  </div>
  <div class="gallery-grid">
  <?php foreach ($images as $img): ?>
          <div class="gallery-item">
            <img src="<?= htmlspecialchars($img) ?>" alt="Photo du logement" loading="lazy">
          </div>
        <?php endforeach; ?>
  </div>
</div>


    <!-- Détails logement -->

 <h1><?= htmlspecialchars($listing['title']) ?></h1>
  <div class="location"><?= htmlspecialchars($listing['city']) ?>, <?= htmlspecialchars($listing['country']) ?></div>

  <div class="details">
    <div class="tag"><?= $listing['max_guests'] ?> voyageurs</div>
    <div class="tag"><?= $listing['num_bedrooms'] ?> chambre(s)</div>
    <div class="tag"><?= $listing['num_bathrooms'] ?> salle(s) de bain</div>
  </div>

    <!-- Prix et réservation -->
  <div class="price-booking">
    <div class="price"><?= number_format($listing['price_per_night'], 0) ?>€ / nuit</div>
    <button class="btn" onclick="openCalendar()">Réserver</button>
  </div>



      <!-- Calendrier Modal -->

  <div id="calendarModal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); z-index:9999; justify-content:center; align-items:center;">
  <div style="background:white; padding:20px; border-radius:12px; width:90%; max-width:600px;">
    <div style="display:flex; justify-content:space-between; align-items:center;">
      <button onclick="changeMonth(-1)">&#10094;</button>
      <h2 id="calendarTitle">Mois Année</h2>
      <button onclick="changeMonth(1)">&#10095;</button>
    </div>
    <div id="calendarDays" style="display:grid; grid-template-columns: repeat(7, 1fr); font-weight:bold; text-align:center; margin-top:10px;">
      <div>Dim</div><div>Lun</div><div>Mar</div><div>Mer</div><div>Jeu</div><div>Ven</div><div>Sam</div>
    </div>
  
  <!-- Calendrier -->
  <!-- Calendrier --><div style="display: flex; flex-wrap: wrap; gap: 20px; margin-top: 20px; max-width: 100%; overflow-x: hidden;">

  <!-- Calendrier -->
  <div id="calendar" style="
      display: grid;
      grid-template-columns: repeat(7, minmax(30px, 1fr));
      gap: 5px;
      flex: 1 1 300px;
      max-width: 100%;
    ">
  </div>

  <!-- Formulaire de validation -->
  <form method="POST" action="" style="display: flex; flex-direction: column; flex: 0 1 200px; margin-top: 20px; width: 100%;">
    <input type="hidden" name="listing_id" value="<?= $id ?>">
    <input type="hidden" name="start_date" id="startDateInput">
    <input type="hidden" name="end_date" id="endDateInput">

    <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; padding: 0 10px;">
      <button type="button" onclick="closeCalendar()" class="btn" style="background-color: gray; padding: 8px 12px; font-size: 14px;">Fermer</button>
      <button type="submit" class="btn" style="padding: 8px 12px; font-size: 14px;">Valider</button>
    </div>
  </form>

</div>

</div>

 


</div>




  <!-- Section équipements -->

  <div class="equipments">
    <h3>Équipements</h3>
    <ul>
      <li><i class="fas fa-wifi"></i> WiFi : <?= $listing['has_wifi'] ? 'Oui' : 'Non' ?></li>
      <li><i class="fas fa-car"></i> Parking : <?= $listing['has_parking'] ? 'Oui' : 'Non' ?></li>
      <li><i class="fas fa-utensils"></i> Cuisine : <?= $listing['has_kitchen'] ? 'Oui' : 'Non' ?></li>
      <li><i class="fas fa-home"></i> Adresse : <?= htmlspecialchars($listing['address']) ?></li>
    </ul>
  </div>

    <!-- Description -->

  <div class="card" style="margin-top: 50px;">
  <h2 class="section-title">Description</h2>
  <div class="description-container" id="descriptionContainer">
    <p class="section-text" id="description"><?= nl2br(htmlspecialchars($listing['description'])) ?></p>
  </div>
  <button id="readMoreBtn" class="btn-readmore" style="display:none;" onclick="toggleDescription()">Lire la suite</button>
</div>
  <!-- Règlement intérieur -->
<div class="rules-card" style="margin-top: 50px;">
  <h2 class="section-title">Règlement intérieur</h2>
  <ul class="rules-list">
    <li><i class="fas fa-clock"></i> Arrivée après 15h00</li>
    <li><i class="fas fa-door-closed"></i> Départ avant 11h00</li>
    <li><i class="fas fa-smoking-ban"></i> Non fumeur</li>
    <li><i class="fas fa-paw"></i> Animaux acceptés sur demande</li>
  </ul>
</div>

 


<div id="map" style="width:100%;height:400px;margin-top:30px;border-radius:12px;overflow:hidden;"></div>

   <!-- Commentaires -->
<div style="margin-top: 50px;">
  <h2 style="font-size: 28px; font-weight: bold; margin-bottom: 20px;">Coup de cœur voyageurs</h2>
  <p style="font-size: 16px; color: #666; margin-bottom: 30px; max-width: 650px;">
    Ce logement fait partie des Coups de cœur voyageurs, à partir des évaluations, commentaires et de la fiabilité des annonces selon les voyageurs.
  </p>
  <div class="comments-section">
  <?php foreach ($comments as $comment): ?>
    <div class="comment-card">
      <div class="comment-header">
        <span class="comment-rating"><?= htmlspecialchars($comment['rating']) ?>★</span>
        <span class="comment-date"><?= date('F Y', strtotime($comment['created_at'])) ?></span>
      </div>

      <div class="comment-text">
        <?= nl2br(htmlspecialchars($comment['content'])) ?>
        <?php if (strlen($comment['content']) > 1): ?>
          <br>
          <a href="#" style="font-size: 14px; color: #e61e4d; text-decoration: underline;"
           onclick="event.preventDefault(); this.parentElement.style.webkitLineClamp = 'unset'; this.style.display='none';">
            Lire la suite
        </a>
        <?php endif; ?>
      </div>

      <div class="comment-author-container">
        <img src="<?= htmlspecialchars($comment['avatar_url']) ?>" alt="avatar" class="comment-avatar">
        <div>
          <div class="comment-author"><?= htmlspecialchars($comment['name']) ?></div>
          <div class="comment-meta">Voyageur Airbnb</div>
        </div>
      </div>
    </div>
  <?php endforeach; ?>
</div>

<div style="text-align: center; margin-top: 40px;">
    <button style="padding: 14px 28px; border: 1px solid #ccc; background: white; border-radius: 14px; font-size: 16px; cursor: pointer;">
    <a href="afficher_commentaires.php?id=<?= $listing['id'] ?>">Voir tous les commentaires</a>
</button>
  </div>

    <!-- hote -->

<?php if ($host): ?>
  <div class="host-card">
    <div class="host-left">
      <div class="host-avatar-container">
        <img src="<?= htmlspecialchars($host['avatar_url']) ?>" alt="Photo de <?= htmlspecialchars($host['name']) ?>" class="host-avatar">
        <?php if (!empty($host['superhost'])): ?>
          <div class="superhost-badge">★</div>
        <?php endif; ?>
      </div>
      <div class="host-name"><?= htmlspecialchars($host['name']) ?></div>
      <?php if (!empty($host['superhost'])): ?>
        <div class="superhost-text">Superhôte</div>
      <?php endif; ?>
    </div>

    <div class="host-right">
      <h3><?= htmlspecialchars($host['name']) ?> est Superhôte</h3>
      <p>Les Superhôtes sont des hôtes expérimentés qui bénéficient de très bonnes évaluations et qui s'engagent à offrir d'excellents séjours.</p>

      <div class="host-info">
        <div><strong><?= $totalEvaluations ?></strong> évaluations</div>
        <div><strong><?= number_format($averageRating, 2) ?></strong> note globale</div>
        <div><strong><?= $host['years_as_host'] ?></strong> ans en tant qu'hôte</div>
      </div>

      <div class="host-extra">
        <p><i class="fas fa-birthday-cake"></i> Né dans les années <?= $host['birth_year'] ?></p>
        <p><i class="fas fa-briefcase"></i> Profession : <?= htmlspecialchars($host['profession']) ?></p>
      </div>

      <a href="#" class="btn-message">Envoyer un message à l'hôte</a>
    </div>
  </div>
<?php else: ?>
  <p style="margin-top: 40px; color: grey;">Aucun hôte trouvé pour ce logement.</p>
<?php endif; ?>

</div>







 
  


<script>
function initMap() {
  const listingLocation = { lat: <?= $latitude ?>, lng: <?= $longitude ?> };

  const map = new google.maps.Map(document.getElementById("map"), {
    center: listingLocation,
    zoom: 13, // Niveau de zoom ajusté pour voir Pointe-Noire correctement
  });

  new google.maps.Marker({
    position: listingLocation,
    map: map,
    title: "Emplacement du logement"
  });
}
</script>

<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyANC5-Qo3NebRXGc6lazv4R__w7TYVFB0s&callback=initMap" async defer></script>


<!-- Script Google Maps -->
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyANC5-Qo3NebRXGc6lazv4R__w7TYVFB0s&callback=initMap" async defer></script>




<script>
let isExpanded = false;

function toggleDescription() {
  const container = document.getElementById('descriptionContainer');
  const btn = document.getElementById('readMoreBtn');

  if (!isExpanded) {
    container.style.maxHeight = "1000px"; // ✅ aucune limite
    btn.textContent = "Réduire";
  } else {
    container.style.maxHeight = window.innerWidth <= 768 ? "180px" : "250px";
    btn.textContent = "Lire la suite";
  }

  isExpanded = !isExpanded;
}

// ✅ Dès que la page charge, on vérifie s'il faut afficher "Lire la suite"
window.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('descriptionContainer');
  const btn = document.getElementById('readMoreBtn');

  if (container.scrollHeight > container.clientHeight) {
    btn.style.display = 'inline-block'; // ✅ afficher seulement si nécessaire
  }
});
</script>


<script>
function updateTotalPrice() {
  if (selectedStartDate && selectedEndDate) {
    const start = new Date(selectedStartDate);
    const end = new Date(selectedEndDate);
    const days = Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;
    const pricePerNight = <?= (int)$listing['price_per_night'] ?>;
    const totalPrice = days * pricePerNight;

    alert('Total pour ' + days + ' nuit(s) : ' + totalPrice + '€');
  }
}
</script>









<script>
let selectedStartDate = null;
let selectedEndDate = null;
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

const availabilityMap = <?= json_encode($formatted) ?>;

function openCalendar() {
  document.getElementById('calendarModal').style.display = 'flex';
  renderCalendar();
}

function closeCalendar() {
  document.getElementById('calendarModal').style.display = 'none';
}

function changeMonth(offset) {
  currentMonth += offset;
  if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  } else if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  }
  renderCalendar();
}

function renderCalendar() {
  const container = document.getElementById('calendar');
  container.innerHTML = '';

  const title = document.getElementById('calendarTitle');
  title.innerText = getMonthName(currentMonth) + ' ' + currentYear;

  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  for (let i = 0; i < firstDay; i++) {
    container.appendChild(document.createElement('div'));
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const isAvailable = availabilityMap[dateStr];

    const box = document.createElement('div');
    box.innerText = day;
    box.dataset.date = dateStr;
    box.style.padding = '10px';
    box.style.textAlign = 'center';
    box.style.border = '1px solid #ccc';
    box.style.borderRadius = '6px';
    box.style.cursor = 'pointer';
    const today = new Date();
today.setHours(0, 0, 0, 0);
const currentDate = new Date(dateStr);

if (isAvailable === 0 || currentDate < today) {
  box.style.textDecoration = 'line-through';
  box.style.color = 'red';
  box.style.backgroundColor = '#fbeaea';
  box.style.cursor = 'not-allowed';
} else {
  box.addEventListener('click', () => handleDateClick(dateStr));
}


    // Appliquer coloration si dans la plage sélectionnée
    if (selectedStartDate && selectedEndDate) {
      const current = new Date(dateStr);
      const start = new Date(selectedStartDate);
      const end = new Date(selectedEndDate);

      if (current >= start && current <= end) {
        box.style.backgroundColor = '#d4edda';
        box.style.borderColor = '#28a745';
        box.style.color = '#155724';
      }
    } else if (selectedStartDate === dateStr) {
      box.style.backgroundColor = '#d4edda';
      box.style.borderColor = '#28a745';
      box.style.color = '#155724';
    }

    container.appendChild(box);
  }

  document.getElementById('startDateInput').value = selectedStartDate || '';
  document.getElementById('endDateInput').value = selectedEndDate || '';
}

function handleDateClick(dateStr) {
  if (!selectedStartDate || selectedEndDate) {
    selectedStartDate = dateStr;
    selectedEndDate = null;
  } else {
    const newDate = new Date(dateStr);
    const startDate = new Date(selectedStartDate);
    if (newDate < startDate) {
      selectedEndDate = selectedStartDate;
      selectedStartDate = dateStr;
    } else {
      selectedEndDate = dateStr;
    }
  }

  renderCalendar();
}

function getMonthName(index) {
  return ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
          'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'][index];
}
</script>




<script src="jscode/gallery.js" defer></script>






<script>
  const slides = document.querySelectorAll(".slide-img");
  let current = 0;

  document.querySelector(".nav.right").addEventListener("click", () => {
    slides[current].style.display = "none";
    current = (current + 1) % slides.length;
    slides[current].style.display = "block";
  });

  document.querySelector(".nav.left").addEventListener("click", () => {
    slides[current].style.display = "none";
    current = (current - 1 + slides.length) % slides.length;
    slides[current].style.display = "block";
  });
</script>



</body>



</html>
