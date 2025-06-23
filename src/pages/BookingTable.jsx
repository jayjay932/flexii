import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaHome, FaPlusCircle, FaComments, FaCalendarCheck, FaUsers } from 'react-icons/fa';
import './HostDetailsPage.css';

export default function BookingTable() {
  const [bookings, setBookings] = useState([]);
  const [cancelMotif, setCancelMotif] = useState('');
  const [cancelBookingId, setCancelBookingId] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await axios.get('http://localhost/flexii/api/get_all_bookings.php');
      setBookings(res.data);
    } catch (error) {
      console.error("Erreur chargement des réservations", error);
    }
  };

  const updateBookingStatus = async (id, newStatus, motif = '') => {
    try {
      await axios.post('http://localhost/flexii/api/update_all_booking_status.php', {
        booking_id: id,
        status: newStatus,
        motif: motif
      });
      setCancelBookingId(null);
      setCancelMotif('');
      fetchBookings();
    } catch (error) {
      console.error("Erreur mise à jour du statut", error);
    }
  };

  const updateBookingPaymentStatus = async (id, newEtat) => {
    try {
      await axios.post('http://localhost/flexii/api/update_booking_payment_status.php', {
        booking_id: id,
        etat: newEtat
      });
      fetchBookings();
    } catch (error) {
      console.error("Erreur mise à jour du paiement", error);
    }
  };

  const handleCancelClick = (id) => {
    setCancelBookingId(id);
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
        <h1>Réservations</h1>
        <table className="host-details-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>User ID</th>
              <th>Listing ID</th>
              <th>Check-in</th>
              <th>Check-out</th>
              <th>Total</th>
              <th>code_reservation</th>
               <th>code_agent</th>
              <th>Status</th>
              <th>État</th>
              <th>Motif</th>
              <th>Créé le</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(b => (
              <tr key={b.id}>
                <td>{b.id}</td>
                <td>{b.user_id}</td>
                <td>{b.listing_id}</td>
                <td>{b.check_in}</td>
                <td>{b.check_out}</td>
                <td>{b.total_price} FCFA</td>
                    <td>{b.code_reservation}</td>
                      <td>{b.code_agent}</td>
                <td>{b.status}</td>
                <td>{b.etat}</td>
                <td>{b.status === 'cancelled' ? b.motif : '—'}</td>
                <td>{b.created_at}</td>
                <td>
                  <button onClick={() => updateBookingStatus(b.id, 'confirmed')}>Confirmer</button>
                  <button onClick={() => handleCancelClick(b.id)} style={{ marginLeft: '8px' }}>Annuler</button>
                  <div style={{ marginTop: '8px' }}>
                    <select
                      value={b.etat}
                      onChange={(e) => updateBookingPaymentStatus(b.id, e.target.value)}
                    >
                      <option value="non_payer">Non payé</option>
                      <option value="partiel">Partiel</option>
                      <option value="payer">Payé</option>
                    </select>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {cancelBookingId && (
          <div className="modal-overlay" onClick={() => setCancelBookingId(null)}>
            <div className="modal-box" onClick={e => e.stopPropagation()}>
              <h3>Motif de l'annulation</h3>
              <textarea
                rows="4"
                placeholder="Indiquez le motif de l'annulation..."
                value={cancelMotif}
                onChange={(e) => setCancelMotif(e.target.value)}
                style={{ width: '100%', marginBottom: '1rem' }}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button onClick={() => setCancelBookingId(null)} style={{ marginRight: '10px' }}>Annuler</button>
                <button onClick={() => updateBookingStatus(cancelBookingId, 'cancelled', cancelMotif)}>Confirmer l'annulation</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
