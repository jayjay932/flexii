import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SetAvailability from '../components/SetAvailability';
import styles from '../styles/Set.module.css';
import './DashboardHote.css';
import { FaHome, FaPlusCircle, FaComments, FaUsers, FaCalendarCheck } from 'react-icons/fa';

function SetAvailabilityPage() {
  const [listings, setListings] = useState([]);
  const [selectedListing, setSelectedListing] = useState(null);

  useEffect(() => {
    fetch('http://localhost/flexii/api/get_host_listings.php', {
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => setListings(data))
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
          <h1 className="dashboard-title">Tableau de bord de l'hôte</h1>
          <p className="dashboard-subtitle">
            Suivez l'activité de vos logements avec précision et professionnalisme
          </p>
        </header>

        <div className={styles.page}>
          <header className={styles.header}>
            <h1>Mes Disponibilités</h1>
          </header>

          <main className={styles.main}>
            {selectedListing ? (
              <>
                <button
                  className={styles.backButton}
                  onClick={() => setSelectedListing(null)}
                >
                  ← Retour à mes logements
                </button>
                <SetAvailability
                  listingId={selectedListing.id}
                  title={selectedListing.title}
                  images={selectedListing.images}
                />
              </>
            ) : (
              <div className={styles.selectionPanel}>
                <h2>Sélectionnez un logement à configurer</h2>
                <div className={styles.carousel}>
                  {listings.map(listing => (
                    <div
                      key={listing.id}
                      className={styles.carouselItem}
                      onClick={() => setSelectedListing(listing)}
                    >
                      <img src={listing.images[0]} alt={listing.title} />
                      <p>{listing.title}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </main>

          <footer className={styles.footer}>
            <p>© 2025 Flexii - Tous droits réservés</p>
          </footer>
        </div>
      </main>
    </div>
  );
}

export default SetAvailabilityPage;
