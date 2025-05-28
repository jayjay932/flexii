import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ModifierLogement.css';

function ModifierLogement() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);
  const [newImages, setNewImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  useEffect(() => {
    fetch(`http://localhost/flexii/api/get_listing.php?id=${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.listing) {
          setFormData({ ...data.listing, id: data.listing.id });
          setExistingImages(data.images || []);
        } else {
          alert("Erreur : logement introuvable.");
        }
      })
      .catch(err => console.error("Erreur de chargement :", err));
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Upload des nouvelles images
    let uploadedImageUrls = [];
    if (newImages.length > 0) {
      const imgFormData = new FormData();
      newImages.forEach((img) => imgFormData.append('images[]', img));

      const res = await fetch('http://localhost/flexii/api/upload_images.php', {
        method: 'POST',
        body: imgFormData
      });

      const imgData = await res.json();
      uploadedImageUrls = imgData.urls || [];
    }

    // 2. Fusionner anciennes et nouvelles images
    const updatedData = {
      ...formData,
      images: [...existingImages, ...uploadedImageUrls]
    };

    // 3. Requête pour mise à jour
    fetch('http://localhost/flexii/api/update_listing.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedData),
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          alert("Logement mis à jour !");
          navigate('/edit-listing');
        } else {
          alert("Erreur serveur : " + data.message);
        }
      })
      .catch(err => console.error("Erreur mise à jour :", err));
  };

  if (!formData) return <p style={{ padding: '2rem' }}>Chargement...</p>;

  const equipements = [
    { name: "has_living_room", label: "Salon", icon: "fa-couch" },
    { name: "has_garden", label: "Jardin", icon: "fa-tree" },
    { name: "has_balcony", label: "Balcon", icon: "fa-chair" },
    { name: "has_terrace", label: "Terrasse", icon: "fa-umbrella-beach" },
    { name: "has_pool", label: "Piscine", icon: "fa-swimming-pool" },
    { name: "is_furnished", label: "Meublé", icon: "fa-cube" },
    { name: "has_wifi", label: "Wi-Fi", icon: "fa-wifi" },
    { name: "has_kitchen", label: "Cuisine", icon: "fa-utensils" },
    { name: "has_parking", label: "Parking", icon: "fa-car" },
  ];

  return (
    <div className="modifier-wrapper">
      <div className="modifier-header">
        <button onClick={() => navigate(-1)} className="back-button">← Retour</button>
        <h2>Modifier le logement</h2>
      </div>

      <form onSubmit={handleSubmit} className="modifier-form">
        <label>Titre
          <input type="text" name="title" value={formData.title || ''} onChange={handleChange} />
        </label>

        <label>Description
          <textarea name="description" value={formData.description || ''} onChange={handleChange} />
        </label>

        <label>Adresse
          <input type="text" name="address" value={formData.address || ''} onChange={handleChange} />
        </label>

        <label>Ville
          <input type="text" name="city" value={formData.city || ''} onChange={handleChange} />
        </label>

        <label>Pays
          <input type="text" name="country" value={formData.country || ''} onChange={handleChange} />
        </label>

        <label>Prix par nuit
          <input type="number" name="price_per_night" value={formData.price_per_night || ''} onChange={handleChange} />
        </label>

        <label>Capacité maximale
          <input type="number" name="max_guests" value={formData.max_guests || ''} onChange={handleChange} />
        </label>

        <label>Chambres
          <input type="number" name="num_bedrooms" value={formData.num_bedrooms || ''} onChange={handleChange} />
        </label>

        <label>Salles de bain
          <input type="number" name="num_bathrooms" value={formData.num_bathrooms || ''} onChange={handleChange} />
        </label>

        <fieldset>
          <legend>Images existantes</legend>
          <div className="image-preview">
            {existingImages.map((url, index) => (
              <div key={index} className="preview-item">
                <img src={url} alt="listing" />
                <button type="button" onClick={() => {
                  setExistingImages(prev => prev.filter((_, i) => i !== index));
                }}>Supprimer</button>
              </div>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend>Ajouter des images</legend>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={e => setNewImages([...e.target.files])}
          />
        </fieldset>

        <fieldset>
          <legend>Équipements</legend>
          <div className="equipements-grid">
            {equipements.map(eq => (
              <label
                key={eq.name}
                className={`equipement-card ${formData[eq.name] ? 'checked' : ''}`}
              >
                <input
                  type="checkbox"
                  name={eq.name}
                  checked={!!formData[eq.name]}
                  onChange={handleChange}
                />
                <i className={`fas ${eq.icon}`}></i>
                {eq.label}
              </label>
            ))}
          </div>
        </fieldset>

        <button type="submit">Enregistrer les modifications</button>
      </form>
    </div>
  );
}

export default ModifierLogement;
