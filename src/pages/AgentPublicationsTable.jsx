import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaHome, FaUsers, FaChartLine } from 'react-icons/fa';
import './HostDetailsPage.css';

export default function AgentPublicationsTable() {
  const [publications, setPublications] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchPublications();
  }, []);

  const fetchPublications = async () => {
    try {setPublications
      const res = await axios.get('http://localhost/flexii/api/get_agent_publications_details.php');
      if (res.data.rows) {
        setPublications(res.data.rows);
        setTotal(res.data.total_publications);
      } else {
        setPublications([]);
      }
    } catch (error) {
      console.error("Erreur chargement des publications", error);
    }
  };

  return (
    <div className="dashboard-wrapper">
      <aside className="sidebar">
        <h2 className="sidebar-title">Mon espace</h2>
        <nav className="sidebar-nav">
          <ul>
            <li><Link to="/"><FaHome /> Accueil</Link></li>
            <li><Link to="/dashboard_hote"><FaChartLine /> Tableau de bord</Link></li>
            <li><Link to="/agents"><FaUsers /> Agents</Link></li>
          </ul>
        </nav>
      </aside>

      <main className="host-details-container">
        <h1>Publications des Agents (logements)</h1>
        <p>Total de publications : <strong>{total}</strong></p>

        <table className="host-details-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Agent</th>
              <th>Code Agent</th>
              <th>Région</th>
              <th>Total par Agent</th>
              <th>Listing</th>
              <th>ID</th>
              <th>Ville</th>
              <th>Pays</th>
              <th>Prix/Nuit</th>
              <th>Hôte</th>
              <th>Email Hôte</th>
              <th>Commission</th>
              <th>Statut</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {publications.map(p => (
              <tr key={p.publication_id}>
                <td>{p.publication_id}</td>
                <td>{p.agent_name} ({p.agent_phone})</td>
                <td>{p.code_agent}</td>
                <td>{p.agent_region}</td>
                <td>{p.total_by_agent}</td>
                <td>{p.listing_title}</td>
                <td>{p.listing_id}</td>
                <td>{p.listing_city}</td>
                <td>{p.listing_country}</td>
                <td>{parseFloat(p.price_per_night).toLocaleString()} FCFA</td>
                <td>{p.host_name}</td>
                <td>{p.host_email}</td>
                <td>{parseFloat(p.commission_amount).toLocaleString()} FCFA</td>
                <td>{p.status}</td>
                <td>{p.publication_date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
}
