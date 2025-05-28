import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './NewLogementEtape6.css';

function NewCarEtape7() {
  const [imageFiles, setImageFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [pricePerDay, setPricePerDay] = useState('');
  const [priceForSale, setPriceForSale] = useState('');
  const [weekendDiscount, setWeekendDiscount] = useState('');

  const navigate = useNavigate();
  const location = useLocation();
  const previousData = location.state || {};

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const previewsURL = files.map(file => URL.createObjectURL(file));
    setImageFiles(prev => [...prev, ...files].slice(0, 10)); // max 10 fichiers
    setPreviews(prev => [...prev, ...previewsURL].slice(0, 10));
  };

  const handleSubmit = () => {
    const hasPrice = pricePerDay || priceForSale;
    if (previews.length < 4 || !hasPrice) return;

    navigate('/new-car-confirmation', {
      state: {
        ...previousData,
        imageFiles, // ✅ fichiers pour upload
        images: previews, // ✅ affichage dans la confirmation
        price_per_day: pricePerDay ? parseFloat(pricePerDay) : null,
        price_for_sale: priceForSale ? parseFloat(priceForSale) : null,
        weekend_discount: weekendDiscount
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

      <h2 className="etape-title">📸 Ajoutez des photos du véhicule</h2>
      <p className="etape-subtext">Minimum 4 photos. Vous pouvez proposer ce véhicule à la location ou à la vente.</p>
<div className="etape-scrollable">
      <div className="photo-upload-container">
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
          id="upload"
          style={{ display: 'none' }}
        />
        <label htmlFor="upload" className="upload-box">
          <i className="fas fa-camera"></i>
          <span>Ajouter des photos</span>
        </label>

        <div className="photo-preview-grid">
          {previews.map((src, i) => (
            <div key={i} className="photo-thumb">
              <img src={src} alt={`photo-${i}`} />
            </div>
          ))}
        </div>
      </div>

      <div className="form-wrapper" style={{ marginTop: '30px' }}>
        <div className="form-group icon-left">
          <label htmlFor="pricePerDay">
            <i className="fas fa-money-bill-wave form-icon" /> Prix par jour (FCFA)
          </label>
          <input
            type="number"
            id="pricePerDay"
            value={pricePerDay}
            onChange={(e) => setPricePerDay(e.target.value)}
            min="0"
            placeholder="Ex : 10000"
          />
        </div>

        <div className="form-group icon-left">
          <label htmlFor="priceForSale">
            <i className="fas fa-car-side form-icon" /> Prix de vente (FCFA)
          </label>
          <input
            type="number"
            id="priceForSale"
            value={priceForSale}
            onChange={(e) => setPriceForSale(e.target.value)}
            min="0"
            placeholder="Ex : 5000000"
          />
        </div>

        <div className="form-group icon-left">
          <label htmlFor="weekend-discount">
            <i className="fas fa-percent form-icon" /> Réduction week-end
          </label>
          <select
            id="weekend-discount"
            value={weekendDiscount}
            onChange={(e) => setWeekendDiscount(e.target.value)}
          >
            <option value="">Aucune</option>
            <option value="5">5 %</option>
            <option value="10">10 %</option>
            <option value="15">15 %</option>
          </select>
        </div>
      </div>

      <div className="etape-footer">
        <button className="btn-text" onClick={() => navigate(-1)}>Retour</button>
        <button
          className="btn-main"
          onClick={handleSubmit}
          disabled={previews.length < 4 || (!pricePerDay && !priceForSale)}
        >
          Confirmer
        </button>
      </div>
    </div>
    </div>
  );
}

export default NewCarEtape7;
