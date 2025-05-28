import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './NewLogementEtape4.css';

const equipments = [
  { label: 'WiFi', icon: 'fa-wifi', key: 'has_wifi' },
  { label: 'Parking', icon: 'fa-car', key: 'has_parking' },
  { label: 'Cuisine', icon: 'fa-utensils', key: 'has_kitchen' },
  { label: 'Salon', icon: 'fa-couch', key: 'has_living_room' },
  { label: 'Jardin', icon: 'fa-tree', key: 'has_garden' },
  { label: 'Balcon', icon: 'fa-chair', key: 'has_balcony' },
  { label: 'Terrasse', icon: 'fa-umbrella-beach', key: 'has_terrace' },
  { label: 'Piscine', icon: 'fa-swimming-pool', key: 'has_pool' },
  { label: 'Meublé', icon: 'fa-cube', key: 'is_furnished' },
];

function NewLogementEtape4() {
  const navigate = useNavigate();
  const location = useLocation();
  const { typeLogement, typeDispo, ville, quartier } = location.state || {};
  const [selected, setSelected] = useState([]);

  const toggleSelection = (key) => {
    setSelected((prev) =>
      prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key]
    );
  };

  const handleNext = () => {
    navigate('/new-logement-etape5', {
      state: {
        typeLogement,
        typeDispo,
        ville,
        quartier,
        equipements: selected
      }
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

      <h2 className="etape-title">🛠️ Quels équipements proposez-vous ?</h2>
<div className="etape-scrollable">
      <div className="etape2-options">
        {equipments.map((item, i) => (
          <div
            key={i}
            className={`etape2-card ${selected.includes(item.key) ? 'selected' : ''}`}
            onClick={() => toggleSelection(item.key)}
          >
            <div><strong>{item.label}</strong></div>
            <i className={`fas ${item.icon} card-icon`}></i>
          </div>
        ))}
      </div>

      <div className="etape-footer">
        <button className="btn-text" onClick={() => navigate(-1)}>Retour</button>
        <button className="btn-main" onClick={handleNext} disabled={selected.length === 0}>
          Suivant
        </button>
      </div>
    </div>
    </div>
  );
}

export default NewLogementEtape4;
