import { useState } from 'react';
import styles from './SetAvailability.module.css';

function SetAvailability({ listingId, title, images }) {
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);
  const [customPrice, setCustomPrice] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!checkIn || !checkOut) return alert('Veuillez sélectionner une plage de dates');

    const formData = new FormData();
    formData.append('listing_id', listingId);
    formData.append('check_in', checkIn);
    formData.append('check_out', checkOut);
    formData.append('is_available', isAvailable ? 1 : 0);
    if (customPrice) formData.append('custom_price', customPrice);

    const res = await fetch('http://localhost/flexii/api/set_availability.php', {
      method: 'POST',
      body: formData
    });

    const data = await res.json();
    setMessage(data.message || 'Opération terminée');
  };

  return (
    <div className={styles.availabilityWrapper}>
      <h2 className={styles.title}>{title}</h2>

      <div className={styles.imageCarousel}>
        {images.map((url, i) => (
          <img key={i} src={url} alt="Logement" className={styles.carouselImage} />
        ))}
      </div>

      <form onSubmit={handleSubmit} className={styles.availabilityForm}>
        <div className={styles.formRow}>
          <label>Date de début :</label>
          <input type="date" value={checkIn} onChange={e => setCheckIn(e.target.value)} />

          <label>Date de fin :</label>
          <input type="date" value={checkOut} onChange={e => setCheckOut(e.target.value)} />
        </div>

        <div className={styles.formRow}>
          <label>Disponibilité :</label>
          <select value={isAvailable} onChange={e => setIsAvailable(e.target.value === 'true')}>
            <option value="true">Disponible</option>
            <option value="false">Indisponible</option>
          </select>
        </div>

        <div className={styles.formRow}>
          <label>Prix personnalisé (optionnel) :</label>
          <input
            type="number"
            value={customPrice}
            onChange={e => setCustomPrice(e.target.value)}
            placeholder="Ex : 10000"
          />
        </div>

        <button type="submit" className={styles.submitButton}>Appliquer</button>

        {message && <p className={styles.successMessage}>{message}</p>}
      </form>
    </div>
  );
}

export default SetAvailability;
