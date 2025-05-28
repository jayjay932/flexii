import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './NewLogementEtape2.css';

const options = [
  {
    title: 'Un logement entier',
    desc: 'Les voyageurs disposent du logement dans son intégralité.',
    icon: 'fa-home',
    value: 'entier',
  },
  {
    title: 'Une chambre',
    desc: 'Les voyageurs ont leur propre chambre dans un logement et ont accès à des espaces partagés.',
    icon: 'fa-door-closed',
    value: 'chambre',
  },
  {
    title: 'Une chambre partagée dans une auberge de jeunesse',
    desc: 'Les voyageurs dorment dans une chambre partagée dans une auberge de jeunesse gérée par un professionnel, avec du personnel sur place 24h/24, 7j/7.',
    icon: 'fa-people-roof',
    value: 'auberge',
  },
];

function NewLogementEtape2() {
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const typeLogement = location.state?.typeLogement;

  const handleNext = () => {
    if (selected) {
      navigate('/new-logement-etape3', {
        state: {
          typeLogement,
          typeDispo: selected
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

      <h2 className="etape-title">Quel type de logement sera à la disposition des voyageurs ?</h2>
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

export default NewLogementEtape2;
