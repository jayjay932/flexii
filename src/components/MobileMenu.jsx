// src/components/MobileMenu.jsx
import './card.css';
import './filter.css';
import './searchbar.css';
import './imagegrid.css';
import './mobilemenu.css';  // Import the CSS file for mobile menu styles


import { useState } from 'react';

function MobileMenu() {
  const [visible, setVisible] = useState(false);

  const toggleMenu = () => {
    setVisible(!visible);
  };

  return (
    <>
      <div className="mobile-menu-toggle" onClick={toggleMenu}>
        <i className="bi bi-list"></i>
      </div>

      <div id="mobileMenu" className={`mobile-menu ${visible ? '' : 'hidden'}`}>
        <ul>
          <li><a href="#">Stays</a></li>
          <li><a href="#">Experiences</a></li>
          <li><a href="#">Online Experiences</a></li>
          <li><a href="#">Airbnb your home</a></li>
          <li><a href="#">Login</a></li>
          <li><a href="#">Sign up</a></li>
        </ul>
      </div>
    </>
  );
}

export default MobileMenu;
