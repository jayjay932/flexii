import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './card.css';
import './filter.css';
import './searchbar.css';
import './imagegrid.css';
import './mobilemenu.css';

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

  const changeImage = (next = true) => {
    setIndex((prev) =>
      next ? (prev + 1) % images.length : (prev - 1 + images.length) % images.length
    );
  };

  const toggleLike = async (e) => {
    e.stopPropagation();
    if (!isLoggedIn) {
      onLoginClick?.();
      return;
    }

    try {
      const response = await fetch('http://localhost/flexii/api/toggle_favorite.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
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

  const renderPrice = () => {
    if (listing.rental_type === 'mensuel' && listing.price_per_month) {
      return <strong>{listing.price_per_month} FCFA</strong>;
    } else if (listing.rental_type === 'courte' && listing.price_per_night) {
      return <strong>{listing.price_per_night} FCFA</strong>;
    } else if (listing.rental_type === 'achat' && listing.price_for_sale) {
      return <strong>{listing.price_for_sale} FCFA</strong>;
    } else {
      return <strong>Prix non spécifié</strong>;
    }
  };

  const renderUnit = () => {
    if (listing.rental_type === 'mensuel') return '/mois';
    if (listing.rental_type === 'courte') return '/nuit';
    if (listing.rental_type === 'achat') return '/vente';
    return '';
  };

  return (
    <div
      className="card1"
      onClick={() => navigate(`/listing/${listing.id}`, { state: { listing } })}
      style={{ cursor: 'pointer' }}
    >
      <div className="carousel">
        <img
          loading="lazy"
          src={currentImage}
          alt="Image du logement"
          className="img1"
        />
        {images.length > 1 && (
          <div className="carousel-controls">
            <button
              onClick={(e) => { e.stopPropagation(); changeImage(false); }}
              className="prev"
              aria-label="Image précédente"
            >
              ‹
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); changeImage(true); }}
              className="next"
              aria-label="Image suivante"
            >
              ›
            </button>
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
            {renderPrice()} {renderUnit()}
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
