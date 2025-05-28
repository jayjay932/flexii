import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './NewLogementEtape1.css'; // ✅ On réutilise les mêmes styles

const vehicleTypes = [
  { label: 'Citadine', icon: 'fa-car-side' },
  { label: 'Berline', icon: 'fa-car' },
  { label: 'SUV', icon: 'fa-car-on' },
  { label: 'Camionnette', icon: 'fa-truck' },
  { label: 'Utilitaire', icon: 'fa-truck-ramp-box' },
  { label: 'Moto', icon: 'fa-motorcycle' },
  { label: 'Camping-car', icon: 'fa-caravan' },
  { label: 'Pick-up', icon: 'fa-truck-pickup' },
  { label: 'Voiture électrique', icon: 'fa-bolt' },
  { label: 'Hybride', icon: 'fa-leaf' },
  { label: '4x4', icon: 'fa-truck-monster' },
  { label: 'Coupé', icon: 'fa-road' }
];

function NewCarEtape1() {
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();

  const handleNext = () => {
    if (!selected) return;
    navigate('/new-car-etape2', {
      state: { typeVehicule: selected }
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
<div className="etape-scrollable">
      <h2 className="etape-title">
        Quel type de véhicule souhaitez-vous proposer à la location ?
      </h2>

      <div className="grid">
        {vehicleTypes.map((type, idx) => (
          <div
            key={idx}
            className={`card ${selected === type.label ? 'selected' : ''}`}
            onClick={() => setSelected(type.label)}
          >
            <i className={`fas ${type.icon} card-icon`}></i>
            <div className="card-label">{type.label}</div>
          </div>
        ))}
      </div>

      <div className="etape-footer">
        <button className="btn-text">Retour</button>
        <button
          className="btn-main"
          onClick={handleNext}
          disabled={!selected}
        >
          Suivant
        </button>
      </div>
    </div>
    </div>
  );
}

export default NewCarEtape1;
