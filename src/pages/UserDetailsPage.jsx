import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaHome, FaPlusCircle, FaComments, FaCalendarCheck, FaUsers } from 'react-icons/fa';
import './HostDetailsPage.css';

export default function UserDetailsPage() {
  const [users, setUsers] = useState([]);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    axios.get('http://localhost/flexii/api/get_all_users.php')
      .then(res => setUsers(res.data))
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
        <h1>Liste des utilisateurs</h1>
        <table className="host-details-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nom</th>
              <th>Email</th>
              <th>Téléphone</th>
              <th>Date de naissance</th>
              <th>Ville</th>
              <th>Rôle</th>
              <th>Solde</th>
              <th>Avatar</th>
              <th>Pièce ID</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.phone || '—'}</td>
                <td>{user.date_naissance || '—'}</td>
                <td>{user.ville || '—'}</td>
                <td>{user.role}</td>
                <td>{parseFloat(user.soldes).toLocaleString()} FCFA</td>
                <td>
                  {user.avatar_url ? (
                    <button onClick={() => handleImageClick(user.avatar_url)}>Voir</button>
                  ) : 'Non fourni'}
                </td>
                <td>
                  {user.id_url ? (
                    <button onClick={() => handleImageClick(user.id_url)}>Voir</button>
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
