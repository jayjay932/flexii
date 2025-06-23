import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

import Head from '../components/Head';
import ProfileMenu from '../components/ProfileMenu';
import BottomNav from '../components/BottomNav';
import LoginModal from '../components/LoginModal';
import SignupModal from '../components/SignupModal';
import { AuthContext } from '../App';

import './UserBooking.css';

function UserBooking() {
  const [listings, setListings] = useState([]);
  const navigate = useNavigate();

  const [menuVisible, setMenuVisible] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [signupOpen, setSignupOpen] = useState(false);

  const { auth } = useContext(AuthContext);
  const { loggedIn, user } = auth;

  useEffect(() => {
    fetch('http://localhost/flexii/api/get_user_bookings.php', {
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => setListings(data))
      .catch(err => console.error('Erreur:', err));
  }, []);

  const handleComment = (listing) => {
    navigate(`/noter-logement/${listing.id}`);
  };

  return (
 <>
     <Head
        isLoggedIn={loggedIn}
        avatarUrl={user?.avatar || '/flexii.png'}
        onAvatarClick={() => setMenuVisible(true)}
      />
    <main className="user-booking-container">
     

      <ProfileMenu
        isLoggedIn={loggedIn}
        onLoginClick={() => setLoginOpen(true)}
        onSignupClick={() => setSignupOpen(true)}
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
      />

      <div className="back-button-wrapper">
        <button className="back-button" onClick={() => navigate(-1)}>
          <FaArrowLeft /> Retour
        </button>
      </div>

      <header className="user-booking-header">
        <h1>Mes réservations</h1>
        <p>Commentez les logements après votre séjour</p>
      </header>

      <section className="booking-list">
        {listings.map((listing, index) => {
          const today = new Date();
          const checkInDate = new Date(listing.check_in);
          const checkOutDate = new Date(listing.check_out);
          const peutCommenter = checkOutDate <= today && !listing.has_commented;
          const peutContacter = today >= checkInDate && today <= checkOutDate;

          const imageUrl = listing.images?.[0] || '/default.jpg';

          return (
            <div
              key={`${listing.id || index}-${listing.booking_id || index}`}
              className="booking-card"
            >
              <img src={imageUrl} alt={listing.title} className="booking-image" />

              <div className="booking-info">
                <h2>{listing.title}</h2>
                <p className="booking-dates">{listing.check_in} → {listing.check_out}</p>

                {listing.has_commented && (
                  <p className="comment-status green">✅ Commentaire déjà envoyé</p>
                )}

                {checkOutDate > today && (
                  <p className="comment-status grey">⏳ Séjour en cours ou à venir</p>
                )}

                {peutCommenter && (
                  <button
                    className="btn-pink"
                    onClick={() => handleComment(listing)}
                  >
                    📝 Commenter
                  </button>
                )}

                {peutContacter && (
                  <Link to={`/messagerie/${listing.booking_id}`} className="btn-outline-pink">
                    ✉️ Contacter l’hôte
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </section>

      <footer className="user-booking-footer">
        <p>© 2025 Flexii - Tous droits réservés</p>
      </footer>

      <LoginModal
        visible={loginOpen}
        onClose={() => setLoginOpen(false)}
        onSwitch={() => {
          setLoginOpen(false);
          setSignupOpen(true);
        }}
        onLoginSuccess={() => setLoginOpen(false)}
      />

      <SignupModal
        visible={signupOpen}
        onClose={() => setSignupOpen(false)}
        onSignupSuccess={() => setSignupOpen(false)}
      />

      <BottomNav
        isLoggedIn={loggedIn}
        onLoginClick={() => setLoginOpen(true)}
        onSignupClick={() => setSignupOpen(true)}
      />
    </main>
    </>
  );
}

export default UserBooking;
