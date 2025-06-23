import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './BottomNav.css';

function BottomNav({ isLoggedIn, onLoginClick, onSignupClick }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    if (!isLoggedIn) {
      onLoginClick();
    } else {
      setMenuOpen(open => !open);
    }
  };

  const closeMenu = () => setMenuOpen(false);

  const handleLogout = async () => {
    try {
      await fetch('http://localhost/flexii/api/logout.php', {
        method: 'GET',
        credentials: 'include', // pour inclure les cookies si nécessaire
      });
      // Recharge la page et redirige vers /vehicules
      window.location.href = '/vehicules';
    } catch (error) {
      console.error('Erreur lors de la déconnexion :', error);
    }
  };

  return (
    <>
      <nav className="bottom-nav">
        <Link to="/" className="nav-item active">
          <i className="bi bi-house-door"></i>
          <span>Accueil</span>
        </Link>
        <Link to="/dashboard_hote" className="nav-item active">
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
            <li>
              <a
                href="https://wa.me/+330753770441"
                target="_blank"
                rel="noopener noreferrer"
                onClick={closeMenu}
              >
                Nous contacter
              </a>
            </li>
            <li><Link to="/notifications">Notifications <span className="notif-dot"></span></Link></li>
            <li><Link to="/user-booking">Mes réservations</Link></li>
            <li><Link to="/favoris">Favoris</Link></li>
            <hr />
            <li><Link to="/dashboard_hote">Publier une annonce</Link></li>
            <li><Link to="/user-profile">Compte</Link></li>
            <hr />
            <li><button className="no-style-button" onClick={handleLogout}>Déconnexion</button></li>
          </ul>
        </div>
      )}
    </>
  );
}

export default BottomNav;
