import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import styles from '../styles/Set.module.css';
import './DashboardHote.css';
import { FaHome, FaPlusCircle, FaComments, FaUsers, FaCalendarCheck } from 'react-icons/fa';

function CommentairesLogement() {
  const { id } = useParams();
  const [comments, setComments] = useState([]);

  useEffect(() => {
    fetch(`http://localhost/flexii/api/get_reserved_host_listings_with_reviews.php?listing_id=${id}`)
      .then(res => res.json())
      .then(setComments)
      .catch(err => console.error('Erreur :', err));
  }, [id]);

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
          <h1 className="dashboard-title">Commentaires du logement #{id}</h1>
          <p className="dashboard-subtitle">Consultez les retours des clients</p>
        </header>

        <div className={styles.page}>
          <main className={styles.main}>
            {comments.length === 0 ? (
              <p>Aucun commentaire trouvé pour ce logement.</p>
            ) : (
              <ul className={styles.commentsList}>
                {comments.map((c, i) => (
                  <li key={i} className={styles.commentCard}>
                    <div className={styles.commentHeader}>
                      <strong>{c.name}</strong> — {c.rating} ⭐
                      <span style={{ marginLeft: 'auto', fontSize: '0.9rem', color: '#777' }}>
                        {c.created_at}
                      </span>
                    </div>
                    <p>{c.content}</p>
                  </li>
                ))}
              </ul>
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

export default CommentairesLogement;
