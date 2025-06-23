import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './NewLogementEtape7.css'; // Réutilisation des styles existants

function NewLogementEtape8() {
  const navigate = useNavigate();
  const location = useLocation();
  const previousData = location.state || {};
  const typeLocation = previousData.typeLocation;

  const [pricePerDay, setPricePerDay] = useState('');
  const [priceForMonth, setPriceForMonth] = useState('');
  const [priceForSale, setPriceForSale] = useState('');
  const [weekendDiscount, setWeekendDiscount] = useState('');

  // Validation en fonction du type de location
  const isValid =
    (typeLocation === 'courte' && parseFloat(pricePerDay) > 0) ||
    (typeLocation === 'mensuel' && parseFloat(priceForMonth) > 0) ||
    (typeLocation === 'achat' && parseFloat(priceForSale) > 0);

  const handleNext = () => {
    let final_price = null;

    if (typeLocation === 'courte') {
      final_price = pricePerDay;
    } else if (typeLocation === 'mensuel') {
      final_price = priceForMonth;
    } else if (typeLocation === 'achat') {
      final_price = priceForSale;
    }

    navigate('/confirmation', {
      state: {
        ...previousData,
        final_price,
        weekend_discount: weekendDiscount || null,
      },
    });
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

      <h2 className="etape-title">💰 Définissez le prix</h2>
      <p className="etape-subtext">Fixez un prix selon le type de location sélectionné.</p>

      <div className="form-wrapper" style={{ marginTop: '30px' }}>
        {typeLocation === 'courte' && (
          <div className="form-group icon-left">
            <label htmlFor="pricePerDay">
              <i className="fas fa-money-bill-wave form-icon" /> Prix par jour (FCFA)
            </label>
            <input
              type="number"
              id="pricePerDay"
              value={pricePerDay}
              onChange={(e) => setPricePerDay(e.target.value)}
              min="0"
              placeholder="Ex : 10000"
            />
          </div>
        )}

        {typeLocation === 'mensuel' && (
          <div className="form-group icon-left">
            <label htmlFor="priceForMonth">
              <i className="fas fa-calendar-alt form-icon" /> Prix par mois (FCFA)
            </label>
            <input
              type="number"
              id="priceForMonth"
              value={priceForMonth}
              onChange={(e) => setPriceForMonth(e.target.value)}
              min="0"
              placeholder="Ex : 150000"
            />
          </div>
        )}

        {typeLocation === 'achat' && (
          <div className="form-group icon-left">
            <label htmlFor="priceForSale">
              <i className="fas fa-car-side form-icon" /> Prix de vente (FCFA)
            </label>
            <input
              type="number"
              id="priceForSale"
              value={priceForSale}
              onChange={(e) => setPriceForSale(e.target.value)}
              min="0"
              placeholder="Ex : 5000000"
            />
          </div>
        )}

        <div className="form-group icon-left">
          <label htmlFor="weekend-discount">
            <i className="fas fa-percent form-icon" /> Réduction week-end
          </label>
          <select
            id="weekend-discount"
            value={weekendDiscount}
            onChange={(e) => setWeekendDiscount(e.target.value)}
          >
            <option value="">Aucune</option>
            <option value="5">5 %</option>
            <option value="10">10 %</option>
            <option value="15">15 %</option>
          </select>
        </div>
      </div>

      <div className="etape-footer">
        <button className="btn-text" onClick={() => navigate(-1)}>
          Retour
        </button>
        <button className="btn-main" onClick={handleNext} disabled={!isValid}>
          Suivant
        </button>
      </div>
    </div>
  );
}

export default NewLogementEtape8;
