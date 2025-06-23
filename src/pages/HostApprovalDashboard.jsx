import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  FaHome, FaPlusCircle, FaComments, FaCalendarCheck, FaUsers,
  FaCheckCircle, FaHourglassHalf, FaTimesCircle
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './DashboardHote.css';

export default function HostApprovalDashboard() {
  const [hosts, setHosts] = useState([]);
  const [motifVisible, setMotifVisible] = useState(false);
  const [motifTexte, setMotifTexte] = useState('');
  const [refuseModalVisible, setRefuseModalVisible] = useState(false);
  const [motifRefus, setMotifRefus] = useState('');
  const [refuseHostId, setRefuseHostId] = useState(null);
  const [selectedHost, setSelectedHost] = useState(null);

  useEffect(() => {
    fetchHosts();
  }, []);

  const fetchHosts = async () => {
    try {
      const res = await axios.get('http://localhost/flexii/api/get_pending_hosts.php');
      setHosts(res.data);
    } catch (err) {
      console.error('Erreur chargement hosts', err);
    }
  };

  const updateHostStatut = async (hostId, statut, motif = '') => {
    try {
      await axios.post('http://localhost/flexii/api/update_host_status.php', {
        host_id: hostId,
        statut,
        motif
      });
      fetchHosts();
      setRefuseModalVisible(false);
      setSelectedHost(null);
    } catch (err) {
      console.error('Erreur mise à jour statut', err);
    }
  };

  const renderStatutIcon = (statut) => {
    switch (statut) {
      case 'valide': return <FaCheckCircle className="icon success" />;
      case 'refuse': return <FaTimesCircle className="icon error" />;
      case 'en_attente': return <FaHourglassHalf className="icon pending" />;
      default: return null;
    }
  };

  const showMotif = (motif) => {
    setMotifTexte(motif);
    setMotifVisible(true);
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
          <h1 className="dashboard-title">Validation des hôtes</h1>
          <p className="dashboard-subtitle">Validez ou refusez les hôtes en attente d'approbation</p>
        </header>

        <section className="section">
          <h2>Liste des hôtes</h2>
          <ul className="list">
            {hosts.map((host) => (
              <li key={host.id} className={`list-item ${host.statut}`}>
                <span className="list-icon">{renderStatutIcon(host.statut)}</span>
                <div className="list-content">
                  <strong>{host.name}</strong>
                  <span className="badge-status">
                    {host.statut === 'valide' ? 'Validé' : host.statut === 'refuse' ? 'Refusé' : 'En attente'}
                  </span>
                  <button className="btn-main" onClick={() => setSelectedHost(host)}>Voir les détails</button>
                  {host.motif && host.statut === 'refuse' && (
                    <button className="eye-button" onClick={() => showMotif(host.motif)}>
                      <i className="fas fa-eye"></i> Voir le motif
                    </button>
                  )}
                  <div className="action-buttons">
                    <button className="btn-valid" onClick={() => updateHostStatut(host.id, 'valide')}>Valider</button>
                    <button className="btn-refuse" onClick={() => {
                      setRefuseModalVisible(true);
                      setRefuseHostId(host.id);
                      setMotifRefus('');
                    }}>Refuser</button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {selectedHost && (
          <div className="modal-overlay" onClick={() => setSelectedHost(null)}>
            <div className="modal-box" onClick={(e) => e.stopPropagation()}>
              <h3>Détails de l'hôte</h3>
              <ul>
                <li><strong>Nom :</strong> {selectedHost.name}</li>
                <li><strong>Email :</strong> {selectedHost.email}</li>
                <li><strong>Profession :</strong> {selectedHost.profession}</li>
                <li><strong>Année de naissance :</strong> {selectedHost.birth_year}</li>
                <li><strong>Type :</strong> {selectedHost.host_type}</li>
                <li><strong>Superhôte :</strong> {selectedHost.superhost ? 'Oui' : 'Non'}</li>
                <li><strong>Description :</strong> {selectedHost.description}</li>
                <li><strong>Identité :</strong><br />
                  {selectedHost.identity_url && (
                    <img src={`http://localhost/flexii/api/${selectedHost.identity_url}`} alt="Pièce d'identité" style={{ maxWidth: '100%', marginTop: '0.5rem' }} />
                  )}
                </li>
              </ul>
              <button className="btn-main" onClick={() => setSelectedHost(null)}>Fermer</button>
            </div>
          </div>
        )}

        {motifVisible && (
          <div className="modal-overlay" onClick={() => setMotifVisible(false)}>
            <div className="modal-box" onClick={(e) => e.stopPropagation()}>
              <h3>Motif du refus</h3>
              <p>{motifTexte}</p>
              <button className="btn-main" onClick={() => setMotifVisible(false)}>Fermer</button>
            </div>
          </div>
        )}

        {refuseModalVisible && (
          <div className="modal-overlay" onClick={() => setRefuseModalVisible(false)}>
            <div className="modal-box" onClick={(e) => e.stopPropagation()}>
              <h3>Motif du refus</h3>
              <textarea
                rows="4"
                placeholder="Indiquez le motif du refus..."
                value={motifRefus}
                onChange={(e) => setMotifRefus(e.target.value)}
                style={{ width: '100%', marginBottom: '1rem' }}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button className="btn-main" onClick={() => setRefuseModalVisible(false)} style={{ marginRight: '10px' }}>
                  Annuler
                </button>
                <button className="btn-refuse" onClick={() => updateHostStatut(refuseHostId, 'refuse', motifRefus)}>
                  Refuser
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
