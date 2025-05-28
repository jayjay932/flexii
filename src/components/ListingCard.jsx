import { useState, useEffect } from 'react';
import './card.css';
import './filter.css';
import './searchbar.css';
import './imagegrid.css';
import './mobilemenu.css';
import { useNavigate } from 'react-router-dom';

function ListingCard({ listing, isLoggedIn, onLoginClick }) {
  const [liked, setLiked] = useState(false);
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (typeof listing.is_favorited !== 'undefined') {
      setLiked(listing.is_favorited);
    }
  }, [listing.id, listing.is_favorited]);

  const images = listing.images?.length > 0 ? listing.images : ['/default.jpg'];
  const currentImage = images[index % images.length];
  const rating = listing.rating?.toFixed(1) || '0.0';

  const nextImage = () => setIndex((prev) => (prev + 1) % images.length);
  const prevImage = () => setIndex((prev) => (prev - 1 + images.length) % images.length);

  const toggleLike = async (e) => {
    e.stopPropagation();
    if (!isLoggedIn) {
      if (onLoginClick) onLoginClick();
      return;
    }
    try {
      const response = await fetch('http://localhost/flexii/api/toggle_favorite.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        credentials: 'include',
        body: `listing_id=${encodeURIComponent(listing.id)}`
      });

      const data = await response.json();
      if (data.success) {
        setLiked(data.favorited);
      } else {
        alert('Erreur : ' + data.error);
      }
    } catch (error) {
      console.error('Erreur :', error);
    }
  };

  // 🔁 Texte du prix selon le type de location
  const priceUnit = listing.rental_type === 'mensuel' ? 'mois' : 'nuit';

  return (
    <div
      className="card1"
      onClick={() => navigate(`/listing/${listing.id}`, { state: { listing } })}
      style={{ cursor: 'pointer' }}
    >
      <div className="carousel">
        <img src={currentImage} alt="Image logement" className="img1" />
        {images.length > 1 && (
          <div className="carousel-controls">
            <button onClick={(e) => { e.stopPropagation(); prevImage(); }} className="prev">‹</button>
            <button onClick={(e) => { e.stopPropagation(); nextImage(); }} className="next">›</button>
          </div>
        )}
      </div>

      <div
        className={`like ${liked ? 'active' : ''}`}
        onClick={toggleLike}
        style={{ cursor: 'pointer' }}
      >
        <i className="bi bi-suit-heart-fill"></i>
      </div>

      <div className="set">
        <div className="lef">
          <h4>{listing.title}</h4>
          <p>
            {listing.city}, {listing.country} <br />
            {new Date(listing.created_at).toLocaleDateString()}
          </p>
          <div className="h">
            <strong>€{listing.price_per_night}</strong> / {priceUnit}
          </div>
        </div>

        <div className="rate">
          <i className="bi bi-star-fill"></i> {rating}
        </div>
      </div>
    </div>
  );
}

export default ListingCard;
