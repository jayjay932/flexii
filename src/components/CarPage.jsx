import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CalendarModal from './CalendarModal';

export default function CarPage() {
  const { id } = useParams(); // ID du véhicule
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [availabilityMap, setAvailabilityMap] = useState({});
  const [isCalOpen, setCalOpen] = useState(false);

  // Charger les infos véhicule + disponibilités
  useEffect(() => {
    fetch(`http://localhost/flexii/api/car_info.php?id=${id}`, {
      credentials: 'include'
    })
      .then(r => r.json())
      .then(json => {
        setCar(json.car);
        setAvailabilityMap(json.availability); // { "2025-05-06":1, ... }
      });
  }, [id]);

  // Callback de validation des dates
  const handleDatesValidate = (vehiculeId, start, end) => {
    setCalOpen(false);
    navigate(`/checkout-car?id=${vehiculeId}&start_date=${start}&end_date=${end}`);
  };

  if (!car) return <p>Chargement…</p>;

  return (
    <div>
      <h1>{car.title}</h1>
      <img src={car.images?.[0] || '/default-car.jpg'} alt="" style={{ width: '100%' }} />

      {/* bouton calendrier */}
      <button onClick={() => setCalOpen(true)}>
        Réserver ce véhicule
      </button>

      <CalendarModal
        isOpen={isCalOpen}
        onClose={() => setCalOpen(false)}
        listingId={id} // utilisé pour fetch les dispos
        availabilityMap={availabilityMap}
        onValidate={handleDatesValidate}
      />
    </div>
  );
}
