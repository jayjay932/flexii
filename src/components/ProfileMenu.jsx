// src/components/ProfileMenu.jsx

import React from 'react';
import { Link } from 'react-router-dom'; // ✅ Pour navigation SPA
import './card.css';
import './filter.css';
import './searchbar.css';
import './imagegrid.css';
import './mobilemenu.css';

function ProfileMenu({ isLoggedIn, onLoginClick, onSignupClick, visible, onClose }) {
  if (!visible) return null;

  const handleClick = (callback) => {
    if (onClose) onClose(); // Ferme le menu
    if (callback) callback(); // Exécute callback (login/signup)
  };

  return (
    <div
      id="profileMenu"
      className="profile-menu"
      style={{
        display: 'block',
        background: 'white',
        position: 'absolute',
        top: '60px',
        right: '20px',
        zIndex: 1000,
        padding: '16px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      }}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Fermer le menu"
        style={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          background: 'transparent',
          border: 'none',
          width: '32px',
          height: '32px',
          padding: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px',
          fontWeight: 'bold',
          color: 'red',
          cursor: 'pointer',
          lineHeight: '1',
          boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
        }}
      >
        ×
      </button>

      <ul style={{ margin: 0, padding: 0, listStyle: 'none', marginTop: '32px' }}>
        {isLoggedIn ? (
          <>
            <li><Link to="/messages" onClick={onClose}>Messages</Link></li>
            <li><Link to="/notifications" onClick={onClose}>Notifications <span className="notif-dot"></span></Link></li>
            <li><Link to="/user-booking" onClick={onClose}>Mes réservations</Link></li>
            <li><Link to="/favoris" onClick={onClose}>Favoris</Link></li>
            <hr />
            <li><Link to="/gerer-logements" onClick={onClose}>Gérer mes annonces</Link></li>
            <li><Link to="/dashboard_hote" onClick={onClose}>Publier une annonce</Link></li>
            <li><Link to="/user-profile" onClick={onClose}>Compte</Link></li>
            <hr />
            <li><Link to="/contact" onClick={onClose}>Nous contacter</Link></li>
            <li><a href="http://localhost/flexii/api/logout.php">Déconnexion</a></li>
          </>
        ) : (
          <>
            <li><a href="#" onClick={() => handleClick(onLoginClick)}>Connexion</a></li>
            <li><a href="#" onClick={() => handleClick(onSignupClick)}>Inscription</a></li>
            <li><Link to="/publier" onClick={onClose}>Publier une annonce</Link></li>
            <li><Link to="/experience" onClick={onClose}>Créer une expérience</Link></li>
            <li><Link to="/aide" onClick={onClose}>Centre d'aide</Link></li>
          </>
        )}
      </ul>
    </div>
  );
}

export default ProfileMenu;
