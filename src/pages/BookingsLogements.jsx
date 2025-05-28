import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../styles/Set.module.css';
import './DashboardHote.css';
import { FaHome, FaPlusCircle, FaComments, FaUsers, FaCalendarCheck } from 'react-icons/fa';

function BookingsLogements() {
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost/flexii/api/get_host_bookings.php', {
      credentials: 'include'
    })
      .then(res => res.json())
      .then(setBookings)
      .catch(err => console.error('Erreur:', err));
  }, []);

  return (
    <div className="dashboard-wrapper">
      <aside className="sidebar">
        <h2 className="sidebar-title">Mon espace</h2>
        <nav className="sidebar-nav">
          <ul>
            <li><Link to="/"><FaHome /> Accueil</Link></li>
            <li><Link to="/dashboard_hote"><FaHome /> Tableau de bord</Link></li>
            <li><Link to="/new-logement-etape1"><FaPlusCircle /> Ajouter un logement</Link></li>
            <li><Link to="/edit-listing"><FaHome /> Gérer les logements</Link></li>
            <li><Link to="/comment-host"><FaComments /> Voir les commentaires</Link></li>
            <li><Link to="/repondre-clients"><FaUsers /> Répondre aux clients</Link></li>
            <li><Link to="/set-availability"><FaCalendarCheck /> Gérer les disponibilités</Link></li>
          </ul>
        </nav>
      </aside>

      <main className="dashboard-container">
        <header className="dashboard-header">
          <h1 className="dashboard-title">Réservations de mes logements</h1>
          <p className="dashboard-subtitle">
            Visualisez les séjours passés ou en cours de vos logements
          </p>
        </header>

        <div className={styles.page}>
          <main className={styles.main}>
            <h2>Réservations</h2>
            <div className={styles.carousel}>
              {bookings.length === 0 ? (
                <p>Aucune réservation trouvée.</p>
              ) : (
                bookings.map(booking => (
                  <div
                    key={booking.booking_id}
                    className={styles.carouselItem}
                    onClick={() => navigate(`/commentaires-logement/${booking.listing_id}`)}
                  >
                    <img
                      src={booking.image_url || '/no-img.png'}
                      alt={booking.title}
                    />
                    <p><strong>{booking.title}</strong></p>
                    <p>Du {booking.check_in} au {booking.check_out}</p>
                  </div>
                ))
              )}
            </div>
          </main>

          <footer className={styles.footer}>
            <p>© 2025 Flexii - Tous droits réservés</p>
          </footer>
        </div>
      </main>
    </div>
  );
}

export default BookingsLogements;
