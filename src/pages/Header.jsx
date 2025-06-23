import React from 'react';
import { FaBars } from 'react-icons/fa';

export default function Header() {
  return (
    <header className="host-header">
      <div className="host-header-left">
        <img src="/flexii.png" alt="logo" className="host-logo" />
      </div>
      <div className="host-header-right">
        <span className="host-mode">Mode hôte</span>
        <div className="host-avatar">J</div>
        <FaBars className="host-menu-icon" />
      </div>
    </header>
  );
}
