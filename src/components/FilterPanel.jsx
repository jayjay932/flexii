import './filterPanel.css';
import { useState, useEffect } from 'react';

import {
  FaHome, FaBuilding, FaBed, FaCouch, FaCalendarAlt, FaShoppingCart, FaClock, FaTimes,
  FaUtensils, FaTree, FaSwimmingPool, FaUmbrellaBeach, FaChair, FaTimesCircle, FaMapMarkerAlt
} from 'react-icons/fa';

function FilterPanel({ onApply, onClose }) {
  const [filters, setFilters] = useState({
    typeLogement: '',
    nbChambres: '',
    salon: false,
    cuisine: false,
    meuble: '',
    exterieur: [],
    typeLocation: '',
    prixMin: '',
    prixMax: '',
    ville: ''
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleExterieurChange = (option) => {
    setFilters((prev) => {
      const exterieur = prev.exterieur.includes(option)
        ? prev.exterieur.filter(item => item !== option)
        : [...prev.exterieur, option];
      return { ...prev, exterieur };
    });
  };




  
  const [villesDisponibles, setVillesDisponibles] = useState([]);


  useEffect(() => {
    const fetchCities = async () => {
      try {
        const res = await fetch("http://localhost/flexii/api/get_all_locations.php", {
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

    if (filters.typeLogement) query.append('typeLogement', filters.typeLogement);
    if (filters.nbChambres) query.append('nbChambres', filters.nbChambres);
    if (filters.salon) query.append('salon', 1);
    if (filters.cuisine) query.append('cuisine', 1);
    if (filters.meuble) query.append('meuble', filters.meuble);
    if (filters.exterieur.includes('jardin')) query.append('jardin', 1);
    if (filters.exterieur.includes('balcon')) query.append('balcon', 1);
    if (filters.exterieur.includes('terrasse')) query.append('terrasse', 1);
    if (filters.exterieur.includes('piscine')) query.append('piscine', 1);
    if (filters.typeLocation) query.append('typeLocation', filters.typeLocation);
    if (filters.prixMin) query.append('prixMin', filters.prixMin);
    if (filters.prixMax) query.append('prixMax', filters.prixMax);

    query.append('location', filters.ville || '');
    query.append('guests', 1);
    query.append('start', '2025-05-01');
    query.append('end', '2025-05-31');

  

    try {
      const res = await fetch(`http://localhost/flexii/api/filter_search.php?${query.toString()}`, {
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
    <div className="etape-scrollable">
    <div className="filter-panel">
      <button className="close-btn" onClick={onClose}>
        <FaTimes />
      </button>

      <h2 className="panel-title">Filtres</h2>

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
        <label>type de logement</label>
        <div className="icon-options">
          <button className={filters.typeLogement === 'maison' ? 'active' : ''} onClick={() => setFilters(prev => ({ ...prev, typeLogement: prev.typeLogement === 'maison' ? '' : 'maison' }))}>
            <FaHome /> Maison
          </button>
          <button className={filters.typeLogement === 'appartement' ? 'active' : ''} onClick={() => setFilters(prev => ({ ...prev, typeLogement: prev.typeLogement === 'appartement' ? '' : 'appartement' }))}>
            <FaBuilding /> Appartement
          </button>
        </div>
      </div>

      <div className="filter-section">
        <label>Nombre de chambres</label>
        <input type="number" name="nbChambres" min="0" onChange={handleChange} />
      </div>

      <div className="filter-section">
        <label>
          <input type="checkbox" name="salon" onChange={handleChange} />
          <FaCouch /> Salon inclus
        </label>
      </div>

      <div className="filter-section">
        <label>
          <input type="checkbox" name="cuisine" onChange={handleChange} />
          <FaUtensils /> Cuisine incluse
        </label>
      </div>

      <div className="filter-section">
        <label>Extérieurs</label>
        <div className="icon-options">
          <button className={filters.exterieur.includes('jardin') ? 'active' : ''} onClick={() => handleExterieurChange('jardin')}>
            <FaTree /> Jardin
          </button>
          <button className={filters.exterieur.includes('balcon') ? 'active' : ''} onClick={() => handleExterieurChange('balcon')}>
            <FaChair /> Balcon
          </button>
          <button className={filters.exterieur.includes('piscine') ? 'active' : ''} onClick={() => handleExterieurChange('piscine')}>
            <FaSwimmingPool /> Piscine
          </button>
          <button className={filters.exterieur.includes('terrasse') ? 'active' : ''} onClick={() => handleExterieurChange('terrasse')}>
            <FaUmbrellaBeach /> Terrasse
          </button>
        </div>
      </div>

      <div className="filter-section">
        <label>Meublé ou non meublé</label>
        <div className="icon-options">
          <button className={filters.meuble === 'meuble' ? 'active' : ''} onClick={() => setFilters(prev => ({ ...prev, meuble: prev.meuble === 'meuble' ? '' : 'meuble' }))}>
            <FaChair /> Meublé
          </button>
          <button className={filters.meuble === 'non-meuble' ? 'active' : ''} onClick={() => setFilters(prev => ({ ...prev, meuble: prev.meuble === 'non-meuble' ? '' : 'non-meuble' }))}>
            <FaTimesCircle /> Non meublé
          </button>
        </div>
      </div>
<div className="filter-section">
  <label>Type de location</label>
  <div className="icon-options">
    <button
      className={filters.typeLocation === 'mensuel' ? 'active' : ''}
      onClick={() => setFilters(prev => ({
        ...prev,
        typeLocation: prev.typeLocation === 'mensuel' ? '' : 'mensuel'
      }))}
    >
      <FaCalendarAlt /> Mensuel
    </button>
    <button
      className={filters.typeLocation === 'courte' ? 'active' : ''}
      onClick={() => setFilters(prev => ({
        ...prev,
        typeLocation: prev.typeLocation === 'courte' ? '' : 'courte'
      }))}
    >
      <FaClock /> Courte durée
    </button>
    <button
      className={filters.typeLocation === 'achat' ? 'active' : ''}
      onClick={() => setFilters(prev => ({
        ...prev,
        typeLocation: prev.typeLocation === 'achat' ? '' : 'achat'
      }))}
    >
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
          typeLogement: '',
          nbChambres: '',
          salon: false,
          cuisine: false,
          meuble: '',
          exterieur: [],
          typeLocation: '',
          prixMin: '',
          prixMax: '',
          ville: ''
        })}>Réinitialiser</button>
      </div>
    </div>
     </div>
  );
}

export default FilterPanel;
