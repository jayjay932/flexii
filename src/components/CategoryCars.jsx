import './categorybar.css';
import {
  FaHome,
  FaLaptop,
  FaCouch,
  FaTools,
  FaCar,
  FaUserTie,
  FaBoxOpen,
  FaBuilding,
  FaShoppingBag,
  FaSearch
} from 'react-icons/fa';

const categories = [
  { name: 'Immobilier', icon: <FaHome />, path: '/' },
  { name: 'Véhicules', icon: <FaCar />, path: '/vehicules' },
  { name: 'Électronique', icon: <FaLaptop />, path: '/electronique' },
  { name: 'Meubles', icon: <FaCouch />, path: '/meubles' },
  { name: 'Services', icon: <FaUserTie />, path: '/services' },
  { name: 'Outils', icon: <FaTools />, path: '/bricolage' },
  { name: 'Divers', icon: <FaBoxOpen />, path: '/divers' },
  { name: 'Commerces', icon: <FaBuilding />, path: '/locaux' },
  { name: 'Mode', icon: <FaShoppingBag />, path: '/mode' }
];

function CategoryBar({ onSortChange, onOpenFilters, searchText, onSearchChange }) {
  return (
    <div className="flexbox3">
      <div className="icon4"><i className="bi bi-caret-left-fill"></i></div>

      <div className="Allicons">
        {categories.map((cat, index) => (
          <div className="icon3" key={index} onClick={() => window.location.href = cat.path}>
            <div className="cat-icon">{cat.icon}</div>
            <p>{cat.name}</p>
          </div>
        ))}
      </div>

      <div className="f2">
        <div className="icon4"><i className="bi bi-caret-right-fill"></i></div>

        <button className="fl2" onClick={onOpenFilters}>
          <i className="bi bi-sliders2"></i><h4>Filters</h4>
        </button>

        <div className="category-sort">
          
          <select onChange={(e) => onSortChange(e.target.value)}>
            
            <option value="">Trier par</option>
            <option value="price_low">Prix croissant</option>
            <option value="price_high">Prix décroissant</option>
            <option value="newest">Nouveautés</option>
          </select>
        </div>

{/* Recherche alignée */}
   <div className="category-search">
  <FaSearch className="category-search-icon" />
  <input
    type="text"
    placeholder="Rechercher un vehicule"
    className="category-search-input"
    value={searchText}
    onChange={(e) => onSearchChange(e.target.value)}
  />
</div>



      </div>
    </div>
  );
}

export default CategoryBar;
