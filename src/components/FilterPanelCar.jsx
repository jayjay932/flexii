// FilterPanelCar.jsx
import './filterPanel.css';
import { useState, useEffect } from 'react';
import {
  FaTimes, FaMapMarkerAlt, FaCar, FaGasPump, FaCogs, FaSnowflake, FaShoppingCart, FaClock
} from 'react-icons/fa';

function FilterPanelCar({ onApply, onClose }) {
  const [filters, setFilters] = useState({
    marque: '',
    modele: '',
    carburant: '',
    transmission: '',
    climatisation: false,
    gps: false,
    prixMin: '',
    prixMax: '',
    typeLocation: '',
    ville: ''
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };




  const [marques, setMarques] = useState([]);
const [modeles, setModeles] = useState([]);

useEffect(() => {
  const fetchOptions = async () => {
    try {
      const res = await fetch("http://localhost/flexii/api/get_marques_modeles.php", {
        credentials: "include"
      });
      const data = await res.json();
      setMarques(data.marques || []);
      setModeles(data.modeles || []);
    } catch (err) {
      console.error("Erreur chargement marques/modèles :", err);
    }
  };

  fetchOptions();
}, []);


  const [villesDisponibles, setVillesDisponibles] = useState([]);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const res = await fetch("http://localhost/flexii/api/get_all_cars.php", {
          credentials: "include"
        });
        const data = await res.json();
        setVillesDisponibles(data);
      } catch (err) {
        console.error("Erreur chargement villes :", err);
      }
    };

    fetchCities();
  }, []);

  const applyFilters = async () => {
    const query = new URLSearchParams();

    if (filters.marque) query.append('marque', filters.marque);
    if (filters.modele) query.append('modele', filters.modele);
    if (filters.carburant) query.append('carburant', filters.carburant);
    if (filters.transmission) query.append('transmission', filters.transmission);
    if (filters.climatisation) query.append('climatisation', 1);
    if (filters.gps) query.append('gps', 1);
    if (filters.prixMin) query.append('prixMin', filters.prixMin);
    if (filters.prixMax) query.append('prixMax', filters.prixMax);
    if (filters.typeLocation) query.append('typeLocation', filters.typeLocation);
    if (filters.ville) query.append('ville', filters.ville);

    try {
      const res = await fetch(`http://localhost/flexii/api/filter_search_cars.php?${query.toString()}`, {
        credentials: 'include'
      });
      const data = await res.json();
      onApply(data);
      onClose();
    } catch (err) {
      console.error('Erreur lors de la recherche avec filtres :', err);
      alert('Une erreur est survenue.');
    }
  };

  return (
    <div className="filter-panel">
      <button className="close-btn" onClick={onClose}><FaTimes /></button>
      <h2 className="panel-title">Filtres véhicules</h2>

      <div className="filter-section">
        <label>Ville</label>
        <div className="input-icon-wrapper">
          <FaMapMarkerAlt className="input-icon" />
          <select name="ville" value={filters.ville} onChange={handleChange}>
            <option value="">Toutes les villes</option>
            {villesDisponibles.map((ville, idx) => (
              <option key={idx} value={ville}>{ville}</option>
            ))}
           

          </select>
        </div>
      </div>

      <div className="filter-section">
  <label>Marque</label>
  <select name="marque" value={filters.marque} onChange={handleChange}>
    <option value="">Toutes les marques</option>
    {marques.map((marque, idx) => (
      <option key={idx} value={marque}>{marque}</option>
    ))}
  </select>
</div>

<div className="filter-section">
  <label>Modèle</label>
  <select name="modele" value={filters.modele} onChange={handleChange}>
    <option value="">Tous les modèles</option>
    {modeles.map((modele, idx) => (
      <option key={idx} value={modele}>{modele}</option>
    ))}
  </select>
</div>


      <div className="filter-section">
        <label>Carburant</label>
        <div className="icon-options">
          {['essence', 'diesel', 'électrique', 'hybride'].map(fuel => (
            <button key={fuel} className={filters.carburant === fuel ? 'active' : ''} onClick={() =>
              setFilters(prev => ({ ...prev, carburant: prev.carburant === fuel ? '' : fuel }))
            }>
              <FaGasPump /> {fuel}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-section">
        <label>Transmission</label>
        <div className="icon-options">
          {['manuelle', 'automatique'].map(trans => (
            <button key={trans} className={filters.transmission === trans ? 'active' : ''} onClick={() =>
              setFilters(prev => ({ ...prev, transmission: prev.transmission === trans ? '' : trans }))
            }>
              <FaCogs /> {trans}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-section">
        <label>
          <input type="checkbox" name="climatisation" onChange={handleChange} />
          <FaSnowflake /> Climatisation
        </label>
      </div>

      <div className="filter-section">
        <label>
          <input type="checkbox" name="gps" onChange={handleChange} />
          <i className="bi bi-geo-alt-fill"></i> GPS
        </label>
      </div>

      <div className="filter-section">
        <label>Type de location</label>
        <div className="icon-options">
          <button className={filters.typeLocation === 'location' ? 'active' : ''} onClick={() =>
            setFilters(prev => ({ ...prev, typeLocation: prev.typeLocation === 'location' ? '' : 'location' }))
          }>
            <FaClock /> Journalière
          </button>
          <button className={filters.typeLocation === 'achat' ? 'active' : ''} onClick={() =>
            setFilters(prev => ({ ...prev, typeLocation: prev.typeLocation === 'achat' ? '' : 'achat' }))
          }>
            <FaShoppingCart /> Achat
          </button>
        </div>
      </div>

      <div className="filter-section">
        <label>Prix</label>
        <div className="price-inputs">
          <input type="number" name="prixMin" placeholder="Min" onChange={handleChange} />
          <input type="number" name="prixMax" placeholder="Max" onChange={handleChange} />
        </div>
      </div>

      <div className="filter-buttons">
        <button className="apply-btn" onClick={applyFilters}>Appliquer</button>
        <button className="reset-btn" onClick={() => setFilters({
          marque: '', modele: '', carburant: '', transmission: '', climatisation: false, gps: false,
          prixMin: '', prixMax: '', typeLocation: '', ville: ''
        })}>Réinitialiser</button>
      </div>
    </div>
  );
}

export default FilterPanelCar;
