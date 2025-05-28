import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/Set.module.css';

function HostReservedListings() {
  const [listings, setListings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost/flexii/api/get_reserved_host_listings_with_reviews.php', {
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => setListings(data))
      .catch(err => console.error('Erreur:', err));
  }, []);

  const handleClick = (listingId) => {
    navigate(`/commentaires-logement/${listingId}`);
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1 className="dashboard-title">Mes logements réservés</h1>
        <p className="dashboard-subtitle">Consultez les avis reçus sur vos logements</p>
      </header>

      <div className={styles.page}>
        <main className={styles.main}>
          <div className={styles.selectionPanel}>
            <h2>Vos logements ayant reçu des réservations</h2>
            <div className={styles.carousel}>
              {listings.map((listing) => (
                <div
                  key={listing.id}
                  className={styles.carouselItem}
                  onClick={() => handleClick(listing.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <img src={listing.images[0]} alt={listing.title} />
                  <p>{listing.title}</p>
                  <p style={{ fontSize: '14px', color: '#777' }}>
                    🔁 Réservations : {listing.nb_reservations}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default HostReservedListings;
