import React, { useState } from 'react';
import './BottomNav.css';

function BottomNav({ isLoggedIn, onLoginClick, onSignupClick }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    if (!isLoggedIn) {
      onLoginClick();
    } else {
      setMenuOpen(open => !open);
    }
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <nav className="bottom-nav">
        <a href="http://localhost:5173/vehicules" className="nav-item active">
          <i className="bi bi-house-door"></i>
          <span>Accueil</span>
        </a>
        <a href="#" className="nav-item">
          <i className="bi bi-heart"></i>
          <span>Favoris</span>
        </a>
        <button
          className="nav-item no-style-button"
          onClick={toggleMenu}
        >
          <i className={`bi ${isLoggedIn ? 'bi-person' : 'bi-box-arrow-in-right'}`}></i>
          <span>{isLoggedIn ? 'Profil' : 'Connexion'}</span>
        </button>
      </nav>

      {menuOpen && isLoggedIn && (
        <div className="bottom-profile-menu">
          <button
            className="profile-menu-close"
            onClick={closeMenu}
            aria-label="Fermer"
          >
            ✕
          </button>
          <ul>
            <li><a href="#">Messages</a></li>
            <li>
              <a href="#">
                Notifications <span className="notif-dot"></span>
              </a>
            </li>
            <li><a href="#">Cars</a></li>
            <li><a href="#">Favoris</a></li>
            <hr />
            <li><a href="#">Gérer mes annonces</a></li>
            <li><a href="#">Créer une expérience</a></li>
            <li><a href="#">Parrainer un hôte</a></li>
            <li><a href="#">Compte</a></li>
            <hr />
            <li><a href="#">Cartes cadeaux</a></li>
            <li><a href="#">Centre d'aide</a></li>
            <li><a href="http://localhost/flexii/api/logout.php">Déconnexion</a></li>
          </ul>
        </div>
      )}
    </>
  );
}

export default BottomNav;
