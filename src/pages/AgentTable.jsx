import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaHome, FaPlusCircle, FaComments, FaCalendarCheck, FaUsers } from 'react-icons/fa';
import './HostDetailsPage.css';

export default function AgentTable() {
  const [agents, setAgents] = useState([]);
  const [statusChanges, setStatusChanges] = useState({});
  const [codeChanges, setCodeChanges] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      const res = await axios.get('http://localhost/flexii/api/get_all_agents.php');
      setAgents(res.data);
    } catch (error) {
      console.error("Erreur chargement des agents", error);
    }
  };

  const updateAgentCodeAndStatus = async (id) => {
    const newStatus = statusChanges[id];
    const newCode = codeChanges[id];

    if (!newStatus && !newCode) return;

    try {
      setErrorMessage('');
      setSuccessMessage('');

      const res = await axios.post('http://localhost/flexii/api/update_agent_status.php', {
        agent_id: id,
        status: newStatus || null,
        code_agent: newCode || null
      });

      setSuccessMessage('Mise à jour réussie.');
      fetchAgents();
    } catch (error) {
      if (error.response && error.response.data?.error) {
        setErrorMessage(error.response.data.error);
      } else {
        setErrorMessage("Erreur réseau ou serveur.");
      }
    }
  };

  const handleStatusChange = (id, value) => {
    setStatusChanges(prev => ({ ...prev, [id]: value }));
  };

  const handleCodeChange = (id, value) => {
    setCodeChanges(prev => ({ ...prev, [id]: value }));
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

      <main className="host-details-container">
        <h1>Agents</h1>

        {errorMessage && (
          <div style={{ color: 'red', marginBottom: '1rem' }}>{errorMessage}</div>
        )}
        {successMessage && (
          <div style={{ color: 'green', marginBottom: '1rem' }}>{successMessage}</div>
        )}

        <table className="host-details-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>User ID</th>
              <th>Nom</th>
              <th>Téléphone</th>
              <th>Email</th>
              <th>Région</th>
              <th>Code Agent</th>
              <th>Solde</th>
              <th>Statut</th>
                  <th>Statut code </th>
              <th>Créé le</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {agents.map(agent => (
              <tr key={agent.id}>
                <td>{agent.id}</td>
                <td>{agent.user_id}</td>
                <td>{agent.full_name}</td>
                <td>{agent.phone}</td>
                <td>{agent.email}</td>
                <td>{agent.region}</td>
                <td>
                  <input
                    type="text"
                    defaultValue={agent.code_agent}
                    onChange={(e) => handleCodeChange(agent.id, e.target.value)}
                  />
                </td>
                <td>{agent.solde} FCFA</td>
                <td>
                  <select
                    value={statusChanges[agent.id] || agent.status}
                    onChange={(e) => handleStatusChange(agent.id, e.target.value)}
                  >
                    <option value="actif">Actif</option>
                    <option value="inactif">Inactif</option>
                  </select>
                </td>
                  <td>{agent.statut_code}</td>
                <td>{agent.created_at}</td>
                <td>
                  <button onClick={() => updateAgentCodeAndStatus(agent.id)}>
                    Mettre à jour
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
}
