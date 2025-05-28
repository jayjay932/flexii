// src/components/MobileMenu.jsx

import './card.css';
import './filter.css';
import './searchbar.css';
import './imagegrid.css';
import './mobilemenu.css';

import { useState } from 'react';
import { Link } from 'react-router-dom'; // ✅ Importer Link

function MobileMenu({ isLoggedIn, onLoginClick, onSignupClick }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(prev => !prev);
  const closeMenu = () => setMenuOpen(false);

  const handleClick = (callback) => {
    closeMenu();
    if (callback) callback();
  };

  return (
    <>
      <div className="mobile-menu-toggle" onClick={toggleMenu}>
        <i className="bi bi-list"></i>
      </div>

      <div id="mobileMenu" className={`mobile-menu ${menuOpen ? 'show' : 'hidden'}`}>
        <div className="mobile-menu-header">
          <span className="close-button" onClick={closeMenu}>×</span>
        </div>

        <ul style={{ margin: 0, padding: 0, listStyle: 'none', marginTop: '32px' }}>
          {isLoggedIn ? (
            <>
              <li><Link to="/messages" onClick={closeMenu}>Messages</Link></li>
              <li><Link to="/notifications" onClick={closeMenu}>Notifications <span className="notif-dot"></span></Link></li>
              <li><Link to="/user-booking" onClick={closeMenu}>Mes réservations</Link></li>
              <li><Link to="/favoris" onClick={closeMenu}>Favoris</Link></li>
              <hr />
            
              <li><Link to="/dashboard_hote" onClick={closeMenu}>Publier une annonce</Link></li>
              <li><Link to="/user-profile" onClick={closeMenu}>Compte</Link></li>
              <hr />
              <li><Link to="/contact" onClick={closeMenu}>Nous contacter</Link></li>
              <li><a href="http://localhost/flexii/api/logout.php">Déconnexion</a></li>
            </>
          ) : (
            <>
              <li><a href="#" onClick={() => handleClick(onLoginClick)}>Connexion</a></li>
              <li><a href="#" onClick={() => handleClick(onSignupClick)}>Inscription</a></li>
              <li><Link to="/dashboard_hote" onClick={closeMenu}>Publier une annonce</Link></li>
             
              <li><Link to="/aide" onClick={closeMenu}>Centre d'aide</Link></li>
            </>
          )}
        </ul>
      </div>
    </>
  );
}

export default MobileMenu;
