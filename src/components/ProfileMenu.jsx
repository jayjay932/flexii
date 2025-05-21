// src/components/ProfileMenu.jsx
import React from 'react';
import './card.css';
import './filter.css';
import './searchbar.css';
import './imagegrid.css';
import './mobilemenu.css';

function ProfileMenu({ isLoggedIn, onLoginClick, onSignupClick, visible, onClose }) {
    if (!visible) return null;

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
            {/* Bouton fermer en haut à droite */}
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
                        <li><a href="#">Messages</a></li>
                        <li><a href="#">Notifications <span className="notif-dot"></span></a></li>
                        <li><a href="#">Voyages</a></li>
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
                    </>
                ) : (
                    <>
                        <li><a href="#" onClick={onLoginClick}>Connexion</a></li>
                        <li><a href="#" onClick={onSignupClick}>Inscription</a></li>
                        <li><a href="#">Mettre mon logement</a></li>
                        <li><a href="#">Créer une expérience</a></li>
                        <li><a href="#">Centre d'aide</a></li>
                    </>
                )}
            </ul>
        </div>
    );
}

export default ProfileMenu;
