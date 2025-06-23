


import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './NewLogementEtape2.css'; // ✅ On réutilise les mêmes styles

const options = [
  {
    title: 'Location journalière',
    desc: 'Les voyageurs peuvent louer votre maison  à la journée.',
    icon: 'fa-calendar-day',
    value: 'courte',
  },
 
 
  {
    title: 'vente de logement',
    desc: 'Vous pouvez vendre votre logement  directement.',
   
    icon: 'fa-calendar-week',
    value: 'achat',
  },
  {
    title: 'Location mensuelle',
    desc: 'Parfait pour les besoins prolongés : votre maison est louée au mois.',
    icon: 'fa-calendar-alt',
    value: 'mensuel',
  },
];

function NewLogementEtape7() {
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const typeVehicule = location.state?.typeVehicule;
  const previousData = location.state || {};

  const handleNext = () => {
    if (selected) {
      navigate('/new-logement-etape8', {
        state: {
       ...previousData,
          typeLocation: selected
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

      <h2 className="etape-title">
        Quel type de location souhaitez-vous proposer pour ce véhicule ?
      </h2>
<div className="etape-scrollable">
      <div className="etape2-options">
        {options.map((opt, i) => (
          <div
            key={i}
            className={`etape2-card ${selected === opt.value ? 'selected' : ''}`}
            onClick={() => setSelected(opt.value)}
          >
            <div>
              <strong>{opt.title}</strong>
              <p>{opt.desc}</p>
            </div>
            <i className={`fas ${opt.icon} card-icon`}></i>
          </div>
        ))}
      </div>

      <div className="etape-footer">
        <button className="btn-text" onClick={() => navigate(-1)}>Retour</button>
        <button className="btn-main" onClick={handleNext} disabled={!selected}>
          Suivant
        </button>
      </div>
    </div>
 </div>
  );
}

export default NewLogementEtape7;
