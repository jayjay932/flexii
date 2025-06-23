import React from 'react';

export default function Footer() {
  return (
    <footer className="host-footer">
        <div className="host-footer-content">
            <p>&copy; 2023 Flexii. All rights reserved.</p>
            <nav className="host-footer-nav">
            <a href="/vehicules">Terms of Service</a>
            <a href="/">Privacy Policy</a>
            <a href="/contact">Contact Us</a>
            </nav>
        </div>
    </footer>
  );
}
