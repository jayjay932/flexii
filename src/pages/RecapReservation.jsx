import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import './RecapReservation.css';

export default function RecapReservation() {
  const { booking_id } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`http://localhost/flexii/api/get_booking.php?id=${booking_id}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.error) throw new Error(json.error);
        setData(json);
      })
      .catch((err) => setError(err.message));
  }, [booking_id]);

  if (error) return <div className="recap-container"><p className="error">{error}</p></div>;
  if (!data) return <div className="recap-container"><p>Chargement…</p></div>;

  const { listing, booking, transaction } = data;

  return (
    <div className="recap-container">
      <div className="recap-card">
        <h1>🎉 Réservation confirmée !</h1>
        <p className="subtitle">Merci pour votre confiance. Voici les détails :</p>

        <div className="recap-details">
          <div className="recap-row">
            <span className="label">Code réservation :</span>
            <span className="value">{booking.code_reservation}</span>
          </div>
          <div className="recap-row">
            <span className="label">Logement :</span>
            <span className="value">{listing.title}</span>
          </div>
          <div className="recap-row">
            <span className="label">Adresse :</span>
            <span className="value">{listing.address}</span>
          </div>
          <div className="recap-row">
            <span className="label">Dates :</span>
            <span className="value">{booking.check_in} → {booking.check_out}</span>
          </div>
          <div className="recap-row">
            <span className="label">Montant total :</span>
            <span className="value">{booking.total_price.toLocaleString()} FCFA</span>
          </div>
          <div className="recap-row">
            <span className="label">Payé via Mobile Money :</span>
            <span className="value">{transaction.montant.toLocaleString()} FCFA</span>
          </div>
          <div className="recap-row highlight">
            <span className="label">Reste à payer à l’arrivée :</span>
            <span className="value strong">{(booking.total_price - transaction.montant).toLocaleString()} FCFA</span>
          </div>
        </div>

        <div className="recap-buttons">
          <Link to={`/listing/${listing.id}`} className="btn-main">Voir le logement</Link>
          <Link to="/" className="btn-secondary">Retour au tableau de bord</Link>
        </div>
      </div>
    </div>
  );
}
