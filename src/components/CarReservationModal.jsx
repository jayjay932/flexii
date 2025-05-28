import { useState, useEffect, useRef } from 'react';
import './reservation.css';
import debounce from 'lodash.debounce';

function CarReservationModal({ visible, onClose, onResults }) {
  const [location, setLocation] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);

  const fetchSuggestions = debounce(async (q) => {
    if (q.length < 2) {
      setSuggestions([]);
      return;
    }
    try {
      const res = await fetch(`http://localhost/flexii/api/autocomplete_cars.php?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setSuggestions(data.map(item => item.label));
      setShowSuggestions(true);
    } catch (err) {
      console.error(err);
    }
  }, 300);

  useEffect(() => {
    fetchSuggestions(location);
    return () => fetchSuggestions.cancel();
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (inputRef.current && !inputRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!visible) return null;

  const handleSelectSuggestion = (label) => {
    setLocation(label);
    setShowSuggestions(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!location || !checkIn || !checkOut) {
      alert("Merci de remplir tous les champs.");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost/flexii/api/search_cars.php?location=${encodeURIComponent(location)}&start=${checkIn}&end=${checkOut}`
      );
      const data = await res.json();
      if (onResults) onResults(data);
      if (onClose) onClose();
    } catch (err) {
      console.error("Erreur API :", err);
      alert("Une erreur est survenue.");
    }
  };

  return (
    <div className="reservation-overlay">
      <div className="reservation-container">
        <div className="form-header">
          <h1>Réserver un véhicule</h1>
          <button onClick={onClose} className="close-btn">&times;</button>
        </div>
        <form className="booking-form" onSubmit={handleSubmit}>
          <div className="form-group" ref={inputRef}>
            <input
              className="form-control"
              type="text"
              placeholder="Ville ou pays"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onFocus={() => location.length >= 2 && setShowSuggestions(true)}
            />
            <span className="form-label">Lieu</span>

            {showSuggestions && suggestions.length > 0 && (
              <ul className="suggestions-list">
                {suggestions.map((s, idx) => (
                  <li key={idx} onClick={() => handleSelectSuggestion(s)}>{s}</li>
                ))}
              </ul>
            )}
          </div>

          <div className="row">
            <div className="form-group half">
              <input className="form-control" type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} required />
              <span className="form-label">Début</span>
            </div>
            <div className="form-group half">
              <input className="form-control" type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} required />
              <span className="form-label">Fin</span>
            </div>
          </div>

          <button type="submit" className="submit-btn">Rechercher</button>
        </form>
      </div>
    </div>
  );
}

export default CarReservationModal;
