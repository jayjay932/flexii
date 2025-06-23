import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminDashboard.css';
import {
  FaHome, FaClock, FaCalendarAlt, FaCheckCircle, FaHourglassHalf, FaTimesCircle,
  FaEuroSign, FaPlusCircle, FaComments, FaCalendarCheck, FaUsers, FaClipboardList, FaEye
} from 'react-icons/fa';

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { Link } from 'react-router-dom';

export default function DashboardHote() {
  const [data, setData] = useState(null);
  const [motifVisible, setMotifVisible] = useState(false);
  const [motifTexte, setMotifTexte] = useState('');
  const [refuseModalVisible, setRefuseModalVisible] = useState(false);
  const [motifRefus, setMotifRefus] = useState('');
  const [refuseListingId, setRefuseListingId] = useState(null);
  const hostId = 1;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    axios.get(`http://localhost/flexii/api/admin_dashboard_data.php?host_id=${hostId}`)
      .then(res => setData(res.data))
      .catch(err => console.error(err));
  };

  const updateStatut = async (listingId, newStatut) => {
    try {
      await axios.post('http://localhost/flexii/api/update_listing_status.php', {
        listing_id: listingId,
        statut: newStatut
      });
      fetchData();
    } catch (error) {
      console.error('Erreur statut:', error);
    }
  };

  const openRefuseModal = (listingId) => {
    setRefuseListingId(listingId);
    setMotifRefus('');
    setRefuseModalVisible(true);
  };

  const submitRefuse = async () => {
    if (!motifRefus.trim()) return alert("Veuillez saisir un motif de refus.");
    try {
      await axios.post('http://localhost/flexii/api/update_listing_status.php', {
        listing_id: refuseListingId,
        statut: 'refuse',
        motif: motifRefus
      });
      setRefuseModalVisible(false);
      fetchData();
    } catch (error) {
      console.error('Erreur refus:', error);
    }
  };

  const COLORS = ['#e91e63', '#f0f0f0'];

  const isRefuse = (statut) => statut === 'refuse';

  const showMotif = (motif) => {
    setMotifTexte(motif);
    setMotifVisible(true);
  };

  const hideMotif = () => {
    setMotifVisible(false);
  };

  if (!data) return <div>Chargement...</div>;

  const {
    totalLogements = 0,
    logementsCetteSemaine = 0,
    logementsCeMois = 0,
    chiffreAffaires = 0,
    logementsOccupes = 0,
    totalUsers = 0,
    totalHosts = 0,
    totalAgents = 0,
    totalReservations = 0,
    joursParListing = {},
    logements = [],
    revenusData = [],
    chiffresPerListing = [],
    likesPerListing = {}
  } = data || {};

  const occupationData = [
    { name: 'Occupés', value: logementsOccupes },
    { name: 'Disponibles', value: 100 - logementsOccupes },
  ];

  return (
    <div className="dashboard-wrapper">
      <aside className="sidebar">
        <h2 className="sidebar-title">Mon espace</h2>
        <nav className="sidebar-nav">
          <ul>
            <li><Link to="/"><FaHome /> Accueil</Link></li>
            <li><Link to="/AdminDashboard"><FaHome /> Tableau de bord</Link></li>
            <li><Link to="/new-logement-etape1"><FaPlusCircle /> Ajouter un logement</Link></li>
            <li><Link to="/booking-admin"><FaHome /> Gérer les réservations</Link></li>
            <li><Link to="/host-details"><FaComments /> Voir les hosts</Link></li>
            <li><Link to="/host-status"><FaUsers /> Gérer les hosts</Link></li>
               <li><Link to="/transaction-admin"><FaUsers /> Gérer les transaction</Link></li>
            <li><Link to="/agent-admin"><FaUsers /> Gérer les agents</Link></li>
            <li><Link to="/agent-code-usage"><FaClipboardList /> Gérer l'usage des code agent</Link></li>
            <li><Link to="/agent-publications"><FaComments /> gerer les publication des agent</Link></li>

            <li><Link to="/HostApprovalDashboard"><FaCalendarCheck /> HostApprovalDashboard</Link></li>
          </ul>
        </nav>
      </aside>

      <main className="dashboard-container">
        <header className="dashboard-header">
          <h1 className="dashboard-title">Tableau de bord de l'hôte</h1>
          <p className="dashboard-subtitle">Suivez l'activité de vos logements avec précision et professionnalisme</p>
        </header>

        <div className="statistiques">
          {[{
            icon: <FaHome className="stat-icon" />, label: 'Total logements', value: totalLogements
          }, {
            icon: <FaClock className="stat-icon" />, label: 'Cette semaine', value: logementsCetteSemaine
          }, {
            icon: <FaCalendarAlt className="stat-icon" />, label: 'Ce mois', value: logementsCeMois
          }, {
            icon: <FaEuroSign className="stat-icon" />, label: "Chiffre d'affaires mensuel", value: chiffreAffaires + ' €'
          }, {
            icon: <FaUsers className="stat-icon" />, label: 'Utilisateurs inscrits', value: totalUsers
          }, {
            icon: <FaUsers className="stat-icon" />, label: 'Nombre d’hôtes', value: totalHosts
          }, {
            icon: <FaClipboardList className="stat-icon" />, label: 'Réservations totales', value: totalReservations
          }, {
            icon: <FaUsers className="stat-icon" />, label: 'Nombre d’agents', value: totalAgents
          }].map((item, idx) => (
            <div className="card-stat" key={idx}>
              {item.icon}
              <div>
                <h3>{item.label}</h3>
                <p>{item.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="charts-grid">
          <div className="chart-box">
            <h3>Revenus par semaine</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={revenusData}>
                <XAxis dataKey="name" stroke="#999" />
                <YAxis stroke="#999" />
                <Tooltip />
                <Bar dataKey="revenu" fill="#e91e63" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="chart-box">
            <h3>Taux d'occupation</h3>
            <p style={{ marginBottom: '0.5rem' }}>{logementsOccupes}% des nuits occupées ce mois-ci</p>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={occupationData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {occupationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <section className="section">
          <h2>Vos logements</h2>
          <div className="table-container">
            <table className="logement-table">
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Voyageurs</th>
                  <th>Prix / nuit</th>
                  <th>CA (mois)</th>
                  <th>Likes</th>
                  <th>Jours réservés</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {logements.map((l) => {
                  const ca = chiffresPerListing?.find((item) => item.listing_id === l.id)?.total || 0;
                  const likes = likesPerListing[l.id] || 0;
                  const jours = joursParListing[l.id] || 0;

                  return (
                    <tr key={l.id}>
                      <td>{l.titre}</td>
                      <td>{l.voyageurs}</td>
                      <td>{l.prix} €</td>
                      <td>{ca} €</td>
                      <td>{likes}</td>
                      <td>{jours} jours</td>
                      <td>
                        <div className="list-content">
                          <span className={`badge-status ${l.statut}`}>
                            {l.statut === 'valide' ? 'Validé' : l.statut === 'refuse' ? 'Refusé' : 'En attente'}
                          </span>
                          {l.statut === 'refuse' && l.motif && (
                            <button className="eye-button" onClick={() => showMotif(l.motif)}>
                              <FaEye /> Voir le motif
                            </button>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button className="btn-valid" onClick={() => updateStatut(l.id, 'valide')}>Valider</button>
                          <button className="btn-refuse" onClick={() => openRefuseModal(l.id)}>Refuser</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {motifVisible && (
          <div className="modal-overlay" onClick={hideMotif}>
            <div className="modal-box" onClick={(e) => e.stopPropagation()}>
              <h3>Motif du refus</h3>
              <p>{motifTexte}</p>
              <button className="btn-main" onClick={hideMotif}>Fermer</button>
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
                <button className="btn-refuse" onClick={submitRefuse}>
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
