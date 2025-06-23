import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function RecapReservationVente() {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) {
      setError("Identifiant de réservation manquant.");
      return;
    }

    fetch(`http://localhost/flexii/api/get_booking_vente.php?id=${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) throw new Error(data.error);
        setBooking(data.booking);
      })
      .catch(err => setError(err.message));
  }, [id]);

  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!booking) return <p>Chargement…</p>;

  return (
    <div style={{ padding: 20 }}>
      <h2>🎉 Votre demande d’achat a été enregistrée !</h2>
      <p><strong>Code réservation :</strong> {booking.code_reservation}</p>
      <p><strong>Nom expéditeur :</strong> {booking.nom || "—"}</p>
      <p><strong>Date de visite :</strong> {booking.date_visite}</p>
      <p><strong>Heure de visite :</strong> {booking.heure_visite}</p>
      <p><strong>Logement :</strong> {booking.listing_title || "—"}</p>
      <p>🔒 <strong>Montant à payer maintenant :</strong> {booking.total_price} FCFA</p>
      <p>💬 Un agent vous contactera pour organiser la visite.</p>
    </div>
  );
}
