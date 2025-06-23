import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaHome, FaUsers, FaChartLine } from 'react-icons/fa';
import './HostDetailsPage.css';

export default function AgentCodeUsageTable() {
  const [agents, setAgents] = useState([]);

  useEffect(() => {
    fetchUsages();
  }, []);

  const fetchUsages = async () => {
    try {
      const res = await axios.get('http://localhost/flexii/api/get_all_agent_code_usages.php');
      setAgents(res.data);
    } catch (error) {
      console.error("Erreur chargement des agents", error);
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
        <h1>Utilisation des Codes Agents</h1>
        <table className="host-details-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nom</th>
              <th>Téléphone</th>
              <th>Région</th>
              <th>Code Agent</th>
              <th>Solde</th>
              <th>Statut</th>
              <th>Date d'ajout</th>
              <th>Utilisations</th>
            </tr>
          </thead>
          <tbody>
            {agents.map(agent => (
              <tr key={agent.agent_id}>
                <td>{agent.agent_id}</td>
                <td>{agent.full_name}</td>
                <td>{agent.phone}</td>
                <td>{agent.region}</td>
                <td>{agent.code_agent}</td>
                <td>{parseFloat(agent.solde).toLocaleString()} FCFA</td>
                <td>{agent.status}</td>
                <td>{agent.created_at}</td>
                <td><strong>{agent.nb_utilisations}</strong></td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
}
