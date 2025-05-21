import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './NewLogementEtape7.css';

function NewLogementEtape7() {
  const navigate = useNavigate();
  const location = useLocation();
  const previousData = location.state || {};

  const [price, setPrice] = useState('');
  const [discount, setDiscount] = useState(null);

  const isValid = price && parseFloat(price) > 0;

  const handleNext = () => {
    if (isValid) {
      navigate('/confirmation', {
        state: {
          ...previousData,
          final_price: price,
          weekend_discount: discount
        }
      });
    }
  };

  return (
    <div className="etape-container">
      <div className="etape-header">
        <img src="/flexii.png" alt="Logo" className="etape-logo" />
        <div className="etape-actions">
          <button className="btn-text">Des questions ?</button>
          <button className="btn-outline">Enregistrer et quitter</button>
        </div>
      </div>

      <h2 className="etape-title">💰 Définissez le prix de votre logement</h2>
      <p className="etape-subtext">Fixez un prix par nuit. Vous pourrez l’ajuster plus tard.</p>

      <div className="price-section">
        <label htmlFor="price">Prix par nuit (€)</label>
        <input
          type="number"
          id="price"
          min={1}
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Ex : 45"
        />
      </div>

      <h3 className="etape-subtitle">Souhaitez-vous appliquer une réduction le week-end ?</h3>
      <div className="discount-options">
        {[5, 10, 15].map((value) => (
          <div
            key={value}
            className={`discount-option ${discount === value ? 'selected' : ''}`}
            onClick={() => setDiscount(value)}
          >
            -{value}%
          </div>
        ))}
        <div
          className={`discount-option ${discount === null ? 'selected' : ''}`}
          onClick={() => setDiscount(null)}
        >
          Aucune
        </div>
      </div>

      <div className="etape-footer">
        <button className="btn-text" onClick={() => navigate(-1)}>Retour</button>
        <button className="btn-main" onClick={handleNext} disabled={!isValid}>
          Suivant
        </button>
      </div>
    </div>
  );
}

export default NewLogementEtape7;
