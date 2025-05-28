import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './NewLogementEtape5.css'; // style Airbnb

function NewCarEtape6() {
  const navigate = useNavigate();
  const location = useLocation();
  const previousData = location.state || {};

  const [formData, setFormData] = useState({
    puissance_fiscale: '',
    consommation_moyenne: '',
    controle_technique: '',
    nombre_portes: 4,
    nombre_places: 5
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: ['nombre_portes', 'nombre_places'].includes(name)
        ? Math.max(0, parseInt(value, 10) || 0)
        : value,
    }));
  };

  const handleNext = () => {
    navigate('/new-car-etape7', {
      state: {
        ...previousData,
        ...formData
      }
    });
  };

  const isValid = (
    formData.puissance_fiscale.trim() !== '' &&
    formData.consommation_moyenne.trim() !== '' &&
    formData.controle_technique.trim() !== '' &&
    formData.nombre_places > 0
  );

  return (
    <div className="etape-container">
      <div className="etape-header">
        <img src="/flexii.png" alt="Logo" className="etape-logo" />
        <div className="etape-actions">
          <button className="btn-text">Des questions ?</button>
          <button className="btn-outline">Enregistrer et quitter</button>
        </div>
      </div>

      <h2 className="etape-title">🧾 Informations complémentaires</h2>
      <p className="etape-subtext">Merci de renseigner les dernières informations techniques du véhicule.</p>

      <div className="etape-scrollable">
        <div className="form-wrapper">

          {/* Puissance fiscale */}
          <div className="form-group icon-left">
            <label htmlFor="puissance_fiscale">
              <i className="fas fa-horse-head form-icon" /> Puissance fiscale
            </label>
            <input
              type="text"
              id="puissance_fiscale"
              name="puissance_fiscale"
              value={formData.puissance_fiscale}
              onChange={handleChange}
              placeholder="Ex : 6 CV"
            />
          </div>

          {/* Consommation moyenne */}
          <div className="form-group icon-left">
            <label htmlFor="consommation_moyenne">
              <i className="fas fa-gas-pump form-icon" /> Consommation moyenne
            </label>
            <input
              type="text"
              id="consommation_moyenne"
              name="consommation_moyenne"
              value={formData.consommation_moyenne}
              onChange={handleChange}
              placeholder="Ex : 6.5 L/100km ou 15 kWh/100km"
            />
          </div>

          {/* Contrôle technique */}
          <div className="form-group icon-left">
            <label htmlFor="controle_technique">
              <i className="fas fa-clipboard-check form-icon" /> Contrôle technique
            </label>
            <input
              type="date"
              id="controle_technique"
              name="controle_technique"
              value={formData.controle_technique}
              onChange={handleChange}
            />
          </div>

          {/* Nombre de portes */}
          <div className="form-group icon-left">
            <label htmlFor="nombre_portes">
              <i className="fas fa-door-open form-icon" /> Nombre de portes
            </label>
            <input
              type="number"
              id="nombre_portes"
              name="nombre_portes"
              value={formData.nombre_portes}
              onChange={handleChange}
              min="0"
            />
          </div>

          {/* Nombre de places */}
          <div className="form-group icon-left">
            <label htmlFor="nombre_places">
              <i className="fas fa-users form-icon" /> Nombre de places
            </label>
            <input
              type="number"
              id="nombre_places"
              name="nombre_places"
              value={formData.nombre_places}
              onChange={handleChange}
              min="1"
            />
          </div>

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

export default NewCarEtape6;
