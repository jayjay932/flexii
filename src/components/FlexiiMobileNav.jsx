// src/components/FlexiiMobileNav.jsx
import React from 'react';
import './FlexiiMobileNav.css';

export default function FlexiiMobileNav() {
  return (
    <nav className="flexii-navbar">
      <div className="nav-left">
        <img src="/f.png" alt="Logo Flexii" className="nav-logo" />
      </div>
      <div className="nav-center">
        <a href="#" className="nav-link">Logement</a>
        <a href="#" className="nav-link">Voiture</a>
        <a href="#" className="nav-link">Restauration</a>
      </div>
      <div className="nav-right">
        <i className="bi bi-globe globe-icon"></i>
        <div className="nav-profile">
          <i className="bi bi-sliders2"></i>
          <i className="bi bi-person-circle"></i>
        </div>
      </div>
    </nav>
  );
}
