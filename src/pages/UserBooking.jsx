import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../styles/Set.module.css';
import './DashboardHote.css';
import {
  FaHome, FaPlusCircle, FaComments, FaUsers, FaCalendarCheck
} from 'react-icons/fa';

function UserBooking() {
  const [listings, setListings] = useState([]);
  const navigate = useNavigate();

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
    <main className="dashboard-container">
      <header className="dashboard-header">
        <h1 className="dashboard-title">Mes réservations</h1>
        <p className="dashboard-subtitle">Commentez les logements après votre séjour.</p>
      </header>

      <div className={styles.page}>
        <main className={styles.main}>
          <div className={styles.selectionPanel}>
            <h2>Sélectionnez un logement</h2>
            <div className={styles.carousel}>
              {listings.map(listing => {
                const today = new Date();
                const checkInDate = new Date(listing.check_in);
                const checkOutDate = new Date(listing.check_out);
                const peutCommenter = checkOutDate <= today && !listing.has_commented;
                const peutContacter = today >= checkInDate && today <= checkOutDate;

                return (
                  <div key={listing.id} className={styles.carouselItem}>
                    <img src={listing.images[0]} alt={listing.title} />
                    <p>{listing.title}</p>
                    <p style={{ fontSize: '14px', color: '#555' }}>
                      📅 {listing.check_in} → {listing.check_out}
                    </p>

                    {listing.has_commented && (
                      <p style={{ color: 'green', fontWeight: 'bold' }}>
                        ✅ Commentaire déjà envoyé
                      </p>
                    )}

                    {checkOutDate > today && (
                      <p style={{ color: '#999' }}>⏳ Séjour en cours ou à venir</p>
                    )}

                    {/* BOUTON COMMENTER */}
                    {peutCommenter && (
                      <button
                        className="btn-commenter"
                        onClick={() => handleComment(listing)}
                      >
                        📝 Commenter
                      </button>
                    )}

                    {/* BOUTON MESSAGE À L’HÔTE */}
                    {peutContacter && (
                      <Link to={`/messagerie/${listing.booking_id}`} className="btn-contact-hote">

                        ✉️ Envoyer un message à l’hôte
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </main>

        <footer className={styles.footer}>
          <p>© 2025 Flexii - Tous droits réservés</p>
        </footer>
      </div>
    </main>
  );
}

export default UserBooking;
