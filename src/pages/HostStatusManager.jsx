import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaHome, FaPlusCircle, FaComments, FaCalendarCheck, FaUsers } from 'react-icons/fa';
import './HostDetailsPage.css';

export default function HostStatusManager() {
  const [hostId, setHostId] = useState('');
  const [host, setHost] = useState(null);
  const [error, setError] = useState('');

  const fetchHostById = async () => {
    try {
      const res = await axios.get(`http://localhost/flexii/api/get_host_by_id.php?host_id=${hostId}`);
      setHost(res.data);
      setError('');
    } catch (err) {
      setHost(null);
      setError("Hôte non trouvé ou erreur serveur.");
    }
  };

  const updateAccountStatut = async (newStatut) => {
    try {
      await axios.post('http://localhost/flexii/api/update_host_account_status.php', {
        host_id: host.id,
        account_statut: newStatut
      });
      setHost({ ...host, account_statut: newStatut });
      alert(`Compte ${newStatut === 'active' ? 'activé' : 'désactivé'} avec succès.`);
    } catch (err) {
      alert("Erreur lors de la mise à jour du compte.");
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

      <main className="host-status-container">
        <h1>Activer / Désactiver un hôte</h1>

        <input
          type="number"
          placeholder="ID de l'hôte"
          value={hostId}
          onChange={(e) => setHostId(e.target.value)}
        />
        <button onClick={fetchHostById}>Rechercher</button>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        {host && (
          <div className="host-info-box">
            <p><strong>ID:</strong> {host.id}</p>
            <p><strong>Nom:</strong> {host.name}</p>
            <p><strong>Email:</strong> {host.email}</p>
            <p><strong>Compte :</strong> {host.account_statut === 'active' ? 'Actif' : 'Désactivé'}</p>

            <div className="host-actions">
              <button onClick={() => updateAccountStatut('active')}>Activer</button>
              <button onClick={() => updateAccountStatut('desactive')}>Désactiver</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
