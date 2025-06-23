import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaHome, FaPlusCircle, FaComments, FaCalendarCheck, FaUsers } from 'react-icons/fa';
import './HostDetailsPage.css';

export default function HostDetailsPage() {
  const [hosts, setHosts] = useState([]);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    axios.get('http://localhost/flexii/api/get_all_hosts.php')
      .then(res => setHosts(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleImageClick = (url) => {
    setPreview(`http://localhost/flexii/api/${url}`);
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

      <div className="host-details-container">
        <h1>Liste des hôtes</h1>
        <table className="host-details-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nom</th>
              <th>Email</th>
              <th>Type</th>
              <th>Superhôte</th>
              <th>Statut</th>
              <th>Motif</th>
              <th>Description</th>
              <th>Profession</th>
              <th>Naissance</th>
              <th>Avatar</th>
              <th>Identité</th>
            </tr>
          </thead>
          <tbody>
            {hosts.map(host => (
              <tr key={host.id}>
                <td>{host.id}</td>
                <td>{host.name}</td>
                <td>{host.email}</td>
                <td>{host.host_type}</td>
                <td>{host.superhost ? 'Oui' : 'Non'}</td>
                <td>{host.statut}</td>
                <td>{host.motif || '—'}</td>
                <td>{host.description || '—'}</td>
                <td>{host.profession || '—'}</td>
                <td>{host.birth_year || '—'}</td>
                <td>
                  {host.avatar_url ? (
                    <button onClick={() => handleImageClick(host.avatar_url)}>
                      Voir
                    </button>
                  ) : 'Non fourni'}
                </td>
                <td>
                  {host.identity_url ? (
                    <button onClick={() => handleImageClick(host.identity_url)}>
                      Voir
                    </button>
                  ) : 'Non fournie'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {preview && (
          <div className="modal-overlay" onClick={() => setPreview(null)}>
            <div className="modal-image" onClick={e => e.stopPropagation()}>
              <button className="close-btn" onClick={() => setPreview(null)}>X</button>
              <img src={preview} alt="Aperçu" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
