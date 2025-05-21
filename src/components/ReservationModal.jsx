import { useState, useEffect, useRef } from 'react';

import './reservation.css';
import debounce from 'lodash.debounce';


function ReservationModal({ visible, onClose, onResults }) {
  const [location, setLocation] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('');
  
  // Nouveaux états pour l'autocomplete
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const inputRef = useRef(null);

  // Debounce fetch
  const fetchSuggestions = debounce(async (q) => {
    if (q.length < 2) {
      setSuggestions([]);
      return;
    }
    try {
      const res = await fetch(
        `http://localhost/flexii/api/autocomplete_locations.php?q=${encodeURIComponent(q)}`,
        { credentials: 'include' }
      );
      const data = await res.json();
      setSuggestions(data.map(item => item.label));
      setShowSuggestions(true);
    } catch (err) {
      console.error(err);
    }
  }, 300);

  // Sur changement de location, déclencher fetchSuggestions
  useEffect(() => {
    fetchSuggestions(location);
    // cleanup si le composant se démonte
    return () => fetchSuggestions.cancel();
  }, [location]);

  // Fermer suggestions quand on clique en dehors
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

    if (!location || !checkIn || !checkOut || !guests) {
      alert("Merci de remplir tous les champs.");
      return;
    }
    if (new Date(checkIn) > new Date(checkOut)) {
      alert("La date de check-in doit être avant la date de check-out.");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost/flexii/api/search_listings.php` +
        `?location=${encodeURIComponent(location)}` +
        `&guests=${guests}` +
        `&start=${checkIn}` +
        `&end=${checkOut}`,
        { credentials: 'include' }
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
          <h1>Make your reservation</h1>
          <button onClick={onClose} className="close-btn">&times;</button>
        </div>
        <form className="booking-form" onSubmit={handleSubmit}>
          {/* DESTINATION AUTO-COMPLETE */}
          <div className="form-group" ref={inputRef}>
            <input
              className="form-control"
              type="text"
              placeholder="Country, ZIP, city..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onFocus={() => location.length >= 2 && setShowSuggestions(true)}
              autoComplete="off"
            />
            <span className="form-label">Destination</span>

            {showSuggestions && suggestions.length > 0 && (
              <ul className="suggestions-list">
                {suggestions.map((s, idx) => (
                  <li
                    key={idx}
                    onClick={() => handleSelectSuggestion(s)}
                  >
                    {s}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="row">
            <div className="form-group half">
              <input
                className="form-control"
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                required
              />
              <span className="form-label">Check In</span>
            </div>
            <div className="form-group half">
              <input
                className="form-control"
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                required
              />
              <span className="form-label">Check Out</span>
            </div>
          </div>

          <div className="form-group">
            <select
              className="form-control"
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              required
            >
              <option hidden value="">No. of guests</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3+</option>
            </select>
            <span className="form-label">Guests</span>
          </div>
          <button type="submit" className="submit-btn">Book Now</button>
        </form>
      </div>
    </div>
  );
}

export default ReservationModal;
