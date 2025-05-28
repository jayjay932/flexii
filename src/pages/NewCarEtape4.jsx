import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './NewLogementEtape4.css'; // ✅ Réutilisation des styles

const equipments = [
  { label: 'Climatisation', icon: 'fa-snowflake', key: 'climatisation' },
  { label: 'GPS', icon: 'fa-location-dot', key: 'gps' },
  { label: 'Caméra de recul', icon: 'fa-video', key: 'camera_recul' },
  { label: 'Bluetooth', icon: 'fa-bluetooth', key: 'bluetooth' },
  { label: 'Sièges chauffants', icon: 'fa-fire', key: 'heated_seats' },
  { label: 'Toit ouvrant', icon: 'fa-sun', key: 'sunroof' },
  { label: 'Chargeur USB', icon: 'fa-usb', key: 'usb_charger' },
  { label: 'Port AUX', icon: 'fa-headphones', key: 'aux_port' },
];

function NewCarEtape4() {
  const navigate = useNavigate();
  const location = useLocation();
  const { typeVehicule, typeLocation, ville, quartier } = location.state || {};
  const [selected, setSelected] = useState([]);

  const toggleSelection = (key) => {
    setSelected((prev) =>
      prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key]
    );
  };

  const handleNext = () => {
    navigate('/new-car-etape5', {
      state: {
        typeVehicule,
        typeLocation,
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

      <h2 className="etape-title">🚗 Quels équipements votre véhicule propose-t-il ?</h2>
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

export default NewCarEtape4;
