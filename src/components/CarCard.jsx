import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function CarCard({ car, isLoggedIn, onLoginClick }) {
  const [liked, setLiked] = useState(false);
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (typeof car.is_favorited !== 'undefined') {
      setLiked(car.is_favorited);
    }
  }, [car.id, car.is_favorited]);

  const images = car.images?.length > 0 ? car.images : ['/default.jpg'];
  const currentImage = images[index % images.length];
  const rating = car.rating?.toFixed(1) || '0.0';

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
      const response = await fetch('http://localhost/flexii/api/toggle_favorite_cars.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        credentials: 'include',
        body: `vehicule_id=${encodeURIComponent(car.id)}`
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

  return (
    <div
      className="card1"
      onClick={() => navigate(`/cars_details/${car.id}`, { state: { car } })}
      style={{ cursor: 'pointer' }}
    >
      <div className="carousel">
        <img
          loading="lazy"
          src={currentImage}
          alt="Image du véhicule"
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
          <h4>{car.marque} - {car.modele} - {car.transmission}</h4>
          <p>
            {car.city} - {car.address} <br />
            {new Date(car.created_at).toLocaleDateString()}
          </p>
          <div className="h">
            <strong>€{car.price_per_day}</strong> /jour
          </div>
        </div>
        <div className="rate">
          <i className="bi bi-star-fill"></i> {rating}
        </div>
      </div>
    </div>
  );
}

export default CarCard;
