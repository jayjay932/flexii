import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styles from '../styles/Set.module.css';
import './DashboardHote.css';
import { FaHome, FaPlusCircle, FaComments, FaUsers, FaCalendarCheck } from 'react-icons/fa';

function EditListing() {
  const [listings, setListings] = useState([]);
  const [selectedListing, setSelectedListing] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost/flexii/api/get_host_listings.php', {
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => setListings(data))
      .catch(err => console.error('Erreur:', err));
  }, []);

  const handleDelete = (id) => {
    if (window.confirm("Voulez-vous vraiment supprimer ce logement ?")) {
      fetch(`http://localhost/flexii/api/delete_listing.php?id=${id}`, {
        method: 'DELETE',
        credentials: 'include'
      })
        .then(res => res.json())
        .then(() => {
          alert("Logement supprimé !");
          setSelectedListing(null);
          setListings(prev => prev.filter(l => l.id !== id));
        })
        .catch(err => console.error("Erreur suppression:", err));
    }
  };

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
        </header>

        <div className={styles.page}>
          <header className={styles.header}>
            <h1>Mes Disponibilités</h1>
          </header>

          <main className={styles.main}>
            {selectedListing ? (
              <>
                <button className={styles.backButton} onClick={() => setSelectedListing(null)}>
                  ← Retour
                </button>

                <div className={styles.listingDetails}>
                  <h2>{selectedListing.title}</h2>
                  <img src={selectedListing.images?.[0]} alt={selectedListing.title} className={styles.image} />

                  <p><strong>Description :</strong> {selectedListing.description}</p>
                  <p><strong>Adresse :</strong> {selectedListing.address}, {selectedListing.city}, {selectedListing.country}</p>
                  <p><strong>Prix :</strong> {selectedListing.price_per_night} FCFA</p>
                  <p><strong>Capacité :</strong> {selectedListing.max_guests} pers.</p>
                  <p><strong>Statut :</strong> {selectedListing.statut}</p>
                  {selectedListing.motif && <p><strong>Motif :</strong> {selectedListing.motif}</p>}

                  <h3>Équipements :</h3>
                  <ul>
                    <li><i className="fas fa-couch"></i> Salon : {selectedListing.has_living_room ? 'Oui' : 'Non'}</li>
                    <li><i className="fas fa-tree"></i> Jardin : {selectedListing.has_garden ? 'Oui' : 'Non'}</li>
                    <li><i className="fas fa-chair"></i> Balcon : {selectedListing.has_balcony ? 'Oui' : 'Non'}</li>
                    <li><i className="fas fa-umbrella-beach"></i> Terrasse : {selectedListing.has_terrace ? 'Oui' : 'Non'}</li>
                    <li><i className="fas fa-swimming-pool"></i> Piscine : {selectedListing.has_pool ? 'Oui' : 'Non'}</li>
                    <li><i className="fas fa-cube"></i> Meublé : {selectedListing.is_furnished ? 'Oui' : 'Non'}</li>
                  </ul>

                  <div className={styles.details}>
                    <div className={styles.tag}>{selectedListing.max_guests} voyageurs</div>
                    <div className={styles.tag}>{selectedListing.num_bedrooms} chambre(s)</div>
                    <div className={styles.tag}>{selectedListing.num_bathrooms} salle(s) de bain</div>
                  </div>

                  <div className={styles.actions}>
                    <button onClick={() => navigate(`/modifier-logement/${selectedListing.id}`)} className={styles.editButton}>Modifier</button>
                    <button onClick={() => handleDelete(selectedListing.id)} className={styles.deleteButton}>Supprimer</button>
                  </div>
                </div>
              </>
            ) : (
              <div className={styles.selectionPanel}>
                <h2>Sélectionnez un logement</h2>
                <div className={styles.carousel}>
                  {listings.map((listing) => (
                    <div key={listing.id} className={styles.carouselItem} onClick={() => setSelectedListing(listing)}>
                      <img src={listing.images?.[0]} alt={listing.title} />
                      <p>{listing.title}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </main>

          <footer className={styles.footer}>
            <p>© 2025 Flexii</p>
          </footer>
        </div>
      </main>
    </div>
  );
}

export default EditListing;
