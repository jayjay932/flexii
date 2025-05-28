import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './NewLogementEtape5.css';

function NewCarEtape5() {
  const navigate = useNavigate();
  const location = useLocation();
  const previousData = location.state || {};

  const [formData, setFormData] = useState({
    marque: '',
    modele: '',
    annee: 2022,
    kilometrage: 0,
    carburant: '',
    transmission: '',
    couleur: '',
    etat: 'occasion',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: ['annee', 'kilometrage'].includes(name) ? parseInt(value, 10) : value,
    }));
  };

  const handleNext = () => {
    navigate('/new-car-etape6', {
      state: {
        ...previousData,
        ...formData
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

      <h2 className="etape-title">🚘 Informations techniques du véhicule</h2>
      <p className="etape-subtext">Remplissez les données de base sur votre véhicule.</p>
<div className="etape-scrollable">
      <div className="form-wrapper">

        {/* Marque */}
        <div className="form-group icon-left">
          <label htmlFor="marque">
            <i className="fas fa-car form-icon" /> Marque
          </label>
          <input type="text" id="marque" name="marque" value={formData.marque} onChange={handleChange} required />
        </div>

        {/* Modèle */}
        <div className="form-group icon-left">
          <label htmlFor="modele">
            <i className="fas fa-tag form-icon" /> Modèle
          </label>
          <input type="text" id="modele" name="modele" value={formData.modele} onChange={handleChange} required />
        </div>

        {/* Année */}
        <div className="form-group icon-left">
          <label htmlFor="annee">
            <i className="fas fa-calendar form-icon" /> Année
          </label>
          <input type="number" id="annee" name="annee" value={formData.annee} onChange={handleChange} min="1990" max={new Date().getFullYear()} />
        </div>

        {/* Kilométrage */}
        <div className="form-group icon-left">
          <label htmlFor="kilometrage">
            <i className="fas fa-tachometer-alt form-icon" /> Kilométrage (km)
          </label>
          <input type="number" id="kilometrage" name="kilometrage" value={formData.kilometrage} onChange={handleChange} min="0" />
        </div>

        {/* Couleur */}
        <div className="form-group icon-left">
          <label htmlFor="couleur">
            <i className="fas fa-palette form-icon" /> Couleur
          </label>
          <input type="text" id="couleur" name="couleur" value={formData.couleur} onChange={handleChange} placeholder="Ex : Rouge, Noir, Bleu..." />
        </div>

        {/* Carburant */}
        <div className="form-group icon-left">
          <label htmlFor="carburant">
            <i className="fas fa-gas-pump form-icon" /> Carburant
          </label>
          <select id="carburant" name="carburant" value={formData.carburant} onChange={handleChange}>
            <option value="">Sélectionnez</option>
            <option value="essence">Essence</option>
            <option value="diesel">Diesel</option>
            <option value="électrique">Électrique</option>
            <option value="hybride">Hybride</option>
          </select>
        </div>

        {/* Transmission */}
        <div className="form-group icon-left">
          <label htmlFor="transmission">
            <i className="fas fa-cogs form-icon" /> Transmission
          </label>
          <select id="transmission" name="transmission" value={formData.transmission} onChange={handleChange}>
            <option value="">Sélectionnez</option>
            <option value="manuelle">Manuelle</option>
            <option value="automatique">Automatique</option>
          </select>
        </div>

        {/* État */}
        <div className="form-group icon-left">
          <label htmlFor="etat">
            <i className="fas fa-wrench form-icon" /> État
          </label>
          <select id="etat" name="etat" value={formData.etat} onChange={handleChange}>
            <option value="neuf">Neuf</option>
            <option value="occasion">Occasion</option>
            <option value="accidenté">Accidenté</option>
          </select>
        </div>

      </div>

      <div className="etape-footer">
        <button className="btn-text" onClick={() => navigate(-1)}>Retour</button>
        <button
          className="btn-main"
          onClick={handleNext}
          disabled={!formData.marque || !formData.modele || !formData.carburant || !formData.transmission || !formData.etat}
        >
          Suivant
        </button>
      </div>
    </div>
    </div>
  );
}

export default NewCarEtape5;
