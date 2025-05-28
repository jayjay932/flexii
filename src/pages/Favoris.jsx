import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/Set.module.css';
import BottomNav from '../components/BottomNav';
import ProfileMenu from '../components/ProfileMenu';
import Head from '../components/Head';
import { AuthContext } from '../App';

function Favoris() {
  const [favoris, setFavoris] = useState([]);
  const navigate = useNavigate();

  const { auth, setAuth } = useContext(AuthContext);
  const { loggedIn, user } = auth;

  const [menuVisible, setMenuVisible] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [signupOpen, setSignupOpen] = useState(false);

  const openLogin = () => setLoginOpen(true);
  const closeLogin = () => setLoginOpen(false);
  const openSignup = () => setSignupOpen(true);
  const closeSignup = () => setSignupOpen(false);
  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  useEffect(() => {
    const userId = user?.id || 1; // Fallback si user non connecté
    fetch(`http://localhost/flexii/api/get_favorites.php?user_id=${userId}`)
      .then(res => res.json())
      .then(data => setFavoris(data.favoris || []))
      .catch(err => console.error('Erreur lors du chargement des favoris :', err));
  }, [user]);

  return (
    <div className={styles.page}>
      {/* Barre supérieure avec avatar */}
      <Head
        isLoggedIn={loggedIn}
        avatarUrl={user?.avatar || '/flexii.png'}
        onAvatarClick={openMenu}
      />

      {/* Menu Profil */}
      <ProfileMenu
        isLoggedIn={loggedIn}
        onLoginClick={openLogin}
        onSignupClick={openSignup}
        visible={menuVisible}
        onClose={closeMenu}
      />

      {/* Bouton retour */}
      <button
        className={styles.backButton}
        onClick={() => (window.location.href = 'http://localhost:5173/')}
      >
        ← Retour à l'accueil
      </button>

      {/* Titre */}
      <header className={styles.header}>
        <h1>Mes Favoris</h1>
      </header>

      {/* Contenu */}
      <main className={styles.main}>
        {favoris.length === 0 ? (
          <p className="no-favorites">Aucun logement en favori pour le moment.</p>
        ) : (
          <div className={styles.carousel}>
            {favoris.map((listing) => (
              <div key={listing.id} className={styles.carouselItem}>
                <img src={listing.images[0]} alt={listing.title} />
                <p>{listing.title}</p>
                <p className="price">{listing.price_per_night} € / nuit</p>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Pied de page */}
      <footer className={styles.footer}>
        <p>© 2025 Flexii - Tous droits réservés</p>
      </footer>

      {/* Navigation mobile */}
      <BottomNav
        isLoggedIn={loggedIn}
        onLoginClick={openLogin}
        onSignupClick={openSignup}
      />
    </div>
  );
}

export default Favoris;
