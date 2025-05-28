import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // ✅ Ajouté
import './BottomNav.css';

function BottomNavCar({ isLoggedIn, onLoginClick, onSignupClick }) {
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
        <Link to="/vehicules" className="nav-item active">
          <i className="bi bi-house-door"></i>
          <span>Accueil</span>
        </Link>
        <Link to="/dashboard_hote_car" className="nav-item active">
        <i className="bi bi-plus-circle"></i>
          <span>Publier une annonce</span>
        </Link>
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
            <li><Link to="/messages">Messages</Link></li>
            <li><Link to="/notifications">Notifications <span className="notif-dot"></span></Link></li>
            <li><Link to="/user-booking">Mes réservations</Link></li>
            <li><Link to="/favoris">Favoris</Link></li>
            <hr />
            <li><Link to="/experience">Créer une expérience</Link></li>
            <li><Link to="/dashboard_hote">Publier une annonce</Link></li>
            <li><Link to="/user-profile">Compte</Link></li>
            <hr />
            <li><Link to="/contact">Nous contacter</Link></li>
            <li><a href="http://localhost/flexii/api/logout.php">Déconnexion</a></li> {/* externe */}
          </ul>
        </div>
      )}
    </>
  );
}

export default BottomNavCar;
