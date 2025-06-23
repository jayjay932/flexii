import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaHome, FaPlusCircle, FaComments, FaCalendarCheck, FaUsers } from 'react-icons/fa';
import './HostDetailsPage.css';

export default function TransactionTable() {
  const [transactions, setTransactions] = useState([]);
  const [statusChanges, setStatusChanges] = useState({});

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await axios.get('http://localhost/flexii/api/get_all_transactions.php');
      setTransactions(res.data);
    } catch (error) {
      console.error("Erreur chargement des transactions", error);
    }
  };

  const updateTransactionStatus = async (id) => {
    try {
      const newStatus = statusChanges[id];
      if (!newStatus) return;

      await axios.post('http://localhost/flexii/api/update_transaction_status.php', {
        transaction_id: id,
        statut: newStatus
      });

      fetchTransactions();
    } catch (error) {
      console.error("Erreur mise à jour du statut", error);
    }
  };

  const handleStatusChange = (id, value) => {
    setStatusChanges(prev => ({ ...prev, [id]: value }));
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
        <h1>Transactions</h1>
        <table className="host-details-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>ID Booking</th>
              <th>Type</th>
              <th>Mobile Money</th>
              <th>Numéro</th>
              <th>Référence</th>
              <th>Montant</th>
              <th>Devise</th>
              <th>Statut</th>
              <th>Date</th>
              <th>Commentaire</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(t => (
              <tr key={t.id}>
                <td>{t.id}</td>
                <td>{t.id_booking}</td>
                <td>{t.type_transaction}</td>
                <td>{t.nom_mobile_money}</td>
                <td>{t.numero_mobile_money}</td>
                <td>{t.reference_transaction}</td>
                <td>{t.montant}</td>
                <td>{t.devise}</td>
                <td>{t.statut}</td>
                <td>{t.date_transaction}</td>
                <td>{t.commentaire || '—'}</td>
                <td>
                  <select
                    value={statusChanges[t.id] || t.statut}
                    onChange={(e) => handleStatusChange(t.id, e.target.value)}
                  >
                    <option value="en attente">En attente</option>
                    <option value="réussi">Réussi</option>
                    <option value="échoué">Échoué</option>
                  </select>
                  <button onClick={() => updateTransactionStatus(t.id)} style={{ marginTop: '6px' }}>
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
