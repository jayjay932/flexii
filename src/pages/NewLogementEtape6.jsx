import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './NewLogementEtape6.css';

function NewLogementEtape6() {
  const [images, setImages] = useState([]);
  const [price, setPrice] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const previousData = location.state || {};

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const fileURLs = files.map(file => URL.createObjectURL(file));
    setImages(prev => [...prev, ...fileURLs].slice(0, 10)); // max 10
  };

  const handleSubmit = () => {
    if (images.length < 4 ) return;
    navigate('/new-logement-etape7', {
      state: {
        ...previousData,
        images,
    
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

      <h2 className="etape-title">📸 Ajoutez des photos de votre logement</h2>
      <p className="etape-subtext">Montrez aux voyageurs à quoi ressemble votre logement. Minimum 4 photos.</p>

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
          {images.map((src, i) => (
            <div key={i} className="photo-thumb">
              <img src={src} alt={`photo-${i}`} />
            </div>
          ))}
        </div>
      </div>

      

      <div className="etape-footer">
        <button className="btn-text" onClick={() => navigate(-1)}>Retour</button>
        <button
          className="btn-main"
          disabled={images.length < 4 }
          onClick={handleSubmit}
        >
          Suivant
        </button>
      </div>
    </div>
  );
}

export default NewLogementEtape6;
