import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './DashboardHote.css';
import {
  FaHome, FaClock, FaCalendarAlt, FaCheckCircle, FaHourglassHalf, FaTimesCircle,
  FaEuroSign, FaPlusCircle, FaComments, FaCalendarCheck, FaUsers
} from 'react-icons/fa';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { Link } from 'react-router-dom';

export default function DashboardHote() {
  const [data, setData] = useState(null);
  const hostId = 1; // 🧑 À remplacer par l’ID dynamique de l’hôte connecté

  useEffect(() => {
    axios.get(`http://localhost/flexii/api/get_host_dashboard_data.php?host_id=${hostId}`)
      .then(res => setData(res.data))
      .catch(err => console.error(err));
  }, []);

  const COLORS = ['#e91e63', '#f0f0f0'];

  const renderStatutIcon = (statut) => {
    switch (statut.toLowerCase()) {
      case 'validée': return <FaCheckCircle className="icon success" />;
      case 'refusée': return <FaTimesCircle className="icon error" />;
      case 'en attente': return <FaHourglassHalf className="icon pending" />;
      default: return null;
    }
  };

  const isRefuse = (statut) =>
    statut?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, '') === 'refuse';

  const [motifVisible, setMotifVisible] = useState(false);
  const [motifTexte, setMotifTexte] = useState('');

  const showMotif = (motif) => {
    setMotifTexte(motif);
    setMotifVisible(true);
  };

  const hideMotif = () => {
    setMotifVisible(false);
  };

  if (!data) return <div>Chargement...</div>;

  const {
    totalLogements,
    logementsCetteSemaine,
    logementsCeMois,
    chiffreAffaires,
    logementsOccupes,
    demandes,
    logements,
    revenusData
  } = data;

  const occupationData = [
    { name: 'Occupés', value: logementsOccupes },
    { name: 'Disponibles', value: totalLogements - logementsOccupes },
  ];

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
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={occupationData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
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
          <h2>Statuts des demandes de publication</h2>
          <ul className="list">
            {demandes.map((d) => (
              <li key={d.id} className={`list-item ${d.statut.toLowerCase().replace(' ', '-')}`}>
                <span className="list-icon">{renderStatutIcon(d.statut)}</span>
                <div className="list-content">
                  <strong>{d.titre}</strong>
                  <span className="badge-status">{d.statut}</span>
                  {isRefuse(d.statut) && d.motif && (
                    <button className="eye-button" onClick={() => showMotif(d.motif)}>
                      <i className="fas fa-eye"></i> Voir le motif
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="section">
          <h2>Vos logements</h2>
          <div className="table-container">
            <table className="logement-table">
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Voyageurs</th>
                  <th>Prix / nuit</th>
                  <th>Statut</th>
                </tr>
              </thead>
              <tbody>
                {logements.map((l) => (
                  <tr key={l.id}>
                    <td>{l.titre}</td>
                    <td>{l.voyageurs}</td>
                    <td>{l.prix} €</td>
                    <td><span className={`status-badge ${l.statut.toLowerCase()}`}>{l.statut}</span></td>
                  </tr>
                ))}
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
      </main>
    </div>
  );
}
