// src/pages/NoterLogement.jsx

import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import './NoterLogement.css';

function NoterLogement() {
  const { id } = useParams(); // ID du logement
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('http://localhost/flexii/api/post_review.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          listing_id: id,
          rating,
          comment
        })
      });

      const data = await res.json();
      if (res.ok) {
        setMessage('Merci pour votre avis !');
        setTimeout(() => navigate('/set-availability'), 1500);
      } else {
        setMessage(data.error || 'Erreur lors de l’envoi');
      }
    } catch (error) {
      console.error(error);
      setMessage('Erreur serveur.');
    }

    setLoading(false);
  };

  return (
    <div className="noter-logement-wrapper">
      <h1>Noter le logement</h1>

      <form className="noter-form" onSubmit={handleSubmit}>
        <label>Note (1 à 5) :</label>
        <input
          type="number"
          min="1"
          max="5"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          required
        />

        <label>Commentaire :</label>
        <textarea
          rows="5"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Partagez votre expérience..."
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Envoi...' : 'Soumettre'}
        </button>
      </form>

      {message && <p className="message">{message}</p>}
    </div>
  );
}

export default NoterLogement;
