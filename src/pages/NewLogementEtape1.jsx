// src/pages/NewLogementEtape1.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ➕ import de useNavigate
import './NewLogementEtape1.css';

const logementTypes = [
  { label: 'Maison', icon: 'fa-house' },
  { label: 'Appartement', icon: 'fa-building' },
  { label: 'Grange', icon: 'fa-warehouse' },
  { label: "Chambre d'hôtes", icon: 'fa-mug-hot' },
  { label: 'Bateau', icon: 'fa-ship' },
  { label: 'Cabane', icon: 'fa-tree' },
  { label: 'Caravane ou camping-car', icon: 'fa-trailer' },
  { label: 'Casa particular', icon: 'fa-home' },
  { label: 'Château', icon: 'fa-chess-rook' },
  { label: 'Maison troglodyte', icon: 'fa-mountain' },
  { label: 'Conteneur maritime', icon: 'fa-box' },
  { label: 'Maison cycladique', icon: 'fa-monument' },
];

function NewLogementEtape1() {
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate(); // ✅ Hook de navigation

  const handleNext = () => {
    if (!selected) return;
    navigate('/new-logement-etape2', {
      state: { typeLogement: selected } // ✅ Envoie de la donnée
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

      <h2 className="etape-title">Parmi les propositions suivantes, laquelle décrit le mieux votre logement ?</h2>

      <div className="grid">
        {logementTypes.map((type, idx) => (
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
  );
}

export default NewLogementEtape1;
