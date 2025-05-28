import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Etape3.css'; // ✅ Réutilisation des styles existants

function NewCarEtape3() {
  const [ville, setVille] = useState('');
  const [quartier, setQuartier] = useState('');

  const location = useLocation();
  const navigate = useNavigate();

  const { typeVehicule, typeLocation } = location.state || {};

  const quartiersBrazzaville = ['Bacongo', 'Makélékélé', 'Poto-Poto', 'Moungali', 'Ouenzé', 'Talangaï', 'Mfilou', 'Madibou', 'Djiri'];
  const quartiersPointeNoire = ['Lumumba', 'Mvoumvou', 'Tié-Tié', 'Loandjili', 'Mongo-Mpoukou', 'Ngoyo'];

  const quartiers = ville === 'Brazzaville' ? quartiersBrazzaville
                 : ville === 'Pointe-Noire' ? quartiersPointeNoire
                 : [];

  const handleNext = () => {
    if (ville && quartier) {
      navigate('/new-car-etape4', {
        state: {
          typeVehicule,
          typeLocation,
          ville,
          quartier
        }
      });
    }
  };

  return (
    <div className="etape-container">
      <h2 className="etape-title">📍 Où se situe le véhicule ?</h2>

      <div className="form-wrapper">
        <div className="form-group">
          <label htmlFor="ville">Ville</label>
          <select id="ville" value={ville} onChange={(e) => setVille(e.target.value)}>
            <option value="">Sélectionnez une ville</option>
            <option value="Brazzaville">Brazzaville</option>
            <option value="Pointe-Noire">Pointe-Noire</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="quartier">Quartier</label>
          <input
            type="text"
            id="quartier"
            value={quartier}
            onChange={(e) => setQuartier(e.target.value)}
            list="quartiers"
            placeholder="Entrez le nom du quartier"
          />
          <datalist id="quartiers">
            {quartiers.map((q, index) => (
              <option key={index} value={q} />
            ))}
          </datalist>
        </div>

        <div className="etape-footer">
          <button className="btn-text" onClick={() => navigate(-1)}>Retour</button>
          <button className="btn-main" onClick={handleNext} disabled={!ville || !quartier}>
            Suivant
          </button>
        </div>
      </div>
    </div>
  );
}

export default NewCarEtape3;
