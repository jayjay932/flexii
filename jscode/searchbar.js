
  function toggleSearchBar() {
  const expanded = document.querySelector('.search-expanded');
  expanded.classList.toggle('hidden');
}

document.addEventListener('DOMContentLoaded', function() {
  const profileButton = document.querySelector('.bi bi-sliders2');
  const profileMenu = document.getElementById('profileMenu');

  profileButton.addEventListener('click', function(e) {
    e.stopPropagation(); // Empêche la fermeture immédiate
    profileMenu.classList.toggle('hidden');
  });

  // Fermer si on clique en dehors
  document.addEventListener('click', function(e) {
    if (!profileMenu.contains(e.target)) {
      profileMenu.classList.add('hidden');
    }
  });
});

function openSignup() {
  document.getElementById('loginModal').classList.add('hidden'); // Fermer Login si ouvert
  document.getElementById('signupModal').classList.remove('hidden'); // Ouvrir Signup
}

function closeSignup() {
  document.getElementById('signupModal').classList.add('hidden');
}

function openLogin() {
  document.getElementById('signupModal').classList.add('hidden'); // Fermer Signup si ouvert
  document.getElementById('loginModal').classList.remove('hidden'); // Ouvrir Login
}

function closeLogin() {
  document.getElementById('loginModal').classList.add('hidden');
}



const profileButton = document.getElementById('profileButton');
const profileMenu = document.getElementById('profileMenu');

// Fonction ouvrir / fermer le menu
profileButton.addEventListener('click', function(e) {
  e.stopPropagation(); // Empêche de fermer immédiatement
  profileMenu.classList.toggle('hidden');
  if (profileMenu.classList.contains('hidden')) {
    profileMenu.style.display = 'none';
  } else {
    profileMenu.style.display = 'block';
  }
});

// Fermer si on clique ailleurs
document.addEventListener('click', function(e) {
  if (!profileMenu.contains(e.target) && !profileButton.contains(e.target)) {
    profileMenu.classList.add('hidden');
    profileMenu.style.display = 'none';
  }
});

