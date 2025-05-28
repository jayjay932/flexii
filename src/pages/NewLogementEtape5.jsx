import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './NewLogementEtape5.css';

function NewLogementEtape5() {
  const navigate = useNavigate();
  const location = useLocation();
  const previousData = location.state || {};

  const [info, setInfo] = useState({
    voyageurs: 1,
    chambres: 1,
    lits: 1,
    sallesDeBain: 1,
  });

  const updateCount = (key, delta) => {
    setInfo((prev) => ({
      ...prev,
      [key]: Math.max(1, prev[key] + delta),
    }));
  };

  const handleNext = () => {
    navigate('/new-logement-etape6', {
      state: {
        ...previousData,
        ...info
      }
    });
  };

  const fields = [
    { label: 'Voyageurs', key: 'voyageurs', icon: 'fa-users' },
    { label: 'Chambres', key: 'chambres', icon: 'fa-bed' },
    { label: 'Lits', key: 'lits', icon: 'fa-couch' },
    { label: 'Salles de bain', key: 'sallesDeBain', icon: 'fa-bath' },
  ];

  return (
    <div className="etape-container">
      <div className="etape-header">
        <img src="/flexii.png" alt="Logo" className="etape-logo" />
        <div className="etape-actions">
          <button className="btn-text">Des questions ?</button>
          <button className="btn-outline">Enregistrer et quitter</button>
        </div>
      </div>

      <h2 className="etape-title">Donnez les informations principales concernant votre logement</h2>
      <p className="etape-subtext">Vous pourrez ajouter d'autres informations plus tard, comme les types de lit.</p>
<div className="etape-scrollable">
      <div className="counter-group">
        {fields.map(({ label, key, icon }) => (
          <div className="counter-row" key={key}>
            <div className="counter-label">
              <i className={`fas ${icon} icon`} /> {label}
            </div>
            <div className="counter-controls">
              <button onClick={() => updateCount(key, -1)} disabled={info[key] === 1} className="counter-btn">−</button>
              <span>{info[key]}</span>
              <button onClick={() => updateCount(key, 1)} className="counter-btn">+</button>
            </div>
          </div>
        ))}
      </div>

      <div className="etape-footer">
        <button className="btn-text" onClick={() => navigate(-1)}>Retour</button>
        <button className="btn-main" onClick={handleNext}>Suivant</button>
      </div>
    </div>
    </div>
  );
}

export default NewLogementEtape5;
