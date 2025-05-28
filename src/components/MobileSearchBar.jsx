import './mobilesearchbar.css';

function MobileSearchBar({ onClick }) {
  return (
    <div className="mobile-search-bar-collapsed" onClick={onClick}>
  <div className="search-summary">
    <span>Where</span>
    <span>—</span>
    <span>Add dates</span>
    <span>—</span>
    <span>Add guests</span>
    
    <span className="search-icon">
      <i className="bi bi-search"></i>
    </span>
  </div>
</div>

  );
}

export default MobileSearchBar;
