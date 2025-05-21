import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './ConfirmationLogement.css';

export default function ConfirmationLogement() {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) {
    return <div className="text-center mt-10">Aucune donnée reçue.</div>;
  }

  // 🟢 Déstructuration des données en haut pour les rendre accessibles partout
  const {
    typeLogement,
    typeDispo,
    ville,
    quartier,
    equipements,
    voyageurs,
    chambres,
    lits,
    sallesDeBain,
    images,
    price_per_night,
    final_price,
    weekend_discount,
  } = state;



  const uploadImages = async (blobs) => {
  const formData = new FormData();
  blobs.forEach((blob, i) => {
    formData.append("images[]", blob, `photo-${i}.jpg`);
  });

 
const res = await fetch("http://localhost/flexii/api/upload_images.php", {
  method: "POST",
  body: formData,
  credentials: "include"
});

const text = await res.text(); // capture la réponse brute
console.log("Réponse brute serveur:", text);

try {
  const data = JSON.parse(text);
  return data.urls || [];
} catch (e) {
  console.error("Erreur JSON", e);
  alert("❌ Erreur dans le traitement des images");
  return [];
}



};




  const handlePublish = async () => {
   const blobUrls = images.filter((url) => url.startsWith('blob:'));
const blobFiles = await Promise.all(blobUrls.map(async (url) => {
  const response = await fetch(url);
  return await response.blob();
}));
const uploadedUrls = await uploadImages(blobFiles);


    try {
      const response = await fetch('http://localhost/flexii/api/save_listing.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
       body: JSON.stringify({
  typeLogement,
  typeDispo,
  ville,
  quartier,
  equipements,
  voyageurs,
  chambres,
  lits,
  sallesDeBain,
  images: uploadedUrls,
  price_per_night,
  final_price,
  weekend_discount
}),

        credentials: 'include'
      });

      const result = await response.json();

      if (result.success) {
        alert("✅ Logement publié avec succès !");
        navigate('/');
      } else {
        alert("❌ Erreur : " + result.error);
      }
    } catch (error) {
      console.error("Erreur lors de l'enregistrement :", error);
      alert("❌ Une erreur est survenue lors de la publication.");
    }
  };

  return (
    <div className="confirmation-container">
      <div className="confirmation-card">
        <h1 className="confirmation-title">
          🎉 Votre logement est prêt à être publié !
        </h1>

        <div className="confirmation-grid">
          <div>
            <h2 className="section-title">
              <i className="fas fa-info-circle"></i> Informations générales
            </h2>
            <ul className="info-list">
              <li><span className="label">Type</span><span className="value">{typeLogement}</span></li>
              <li><span className="label">Disponibilité</span><span className="value">{typeDispo}</span></li>
              <li><span className="label">Ville</span><span className="value">{ville}</span></li>
              <li><span className="label">Quartier</span><span className="value">{quartier}</span></li>
              <li><span className="label">Voyageurs</span><span className="value">{voyageurs}</span></li>
              <li><span className="label">Chambres</span><span className="value">{chambres}</span></li>
              <li><span className="label">Lits</span><span className="value">{lits}</span></li>
              <li><span className="label">Salles de bain</span><span className="value">{sallesDeBain}</span></li>
            </ul>

            <h2 className="section-title">
              <i className="fas fa-euro-sign"></i> Tarifs
            </h2>
            <ul className="info-list">
              <li><span className="label">Prix / nuit</span><span className="value">{final_price || price_per_night} €</span></li>
              <li><span className="label">Réduction week-end</span><span className="value">{weekend_discount ? `-${weekend_discount}%` : 'Aucune'}</span></li>
            </ul>

            <h2 className="section-title">
              <i className="fas fa-tools"></i> Équipements
            </h2>
            <div className="badges">
              {equipements && equipements.length > 0 ? (
                equipements.map((eq, i) => (
                  <span key={i} className="badge">
                    {eq.replace('has_', '').replace('_', ' ')}
                  </span>
                ))
              ) : (
                <span className="text-gray">Aucun équipement sélectionné</span>
              )}
            </div>
          </div>

          <div>
            <h2 className="section-title">
              <i className="fas fa-camera"></i> Photos
            </h2>
            <div className="photo-grid">
              {images && images.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt={`img-${i}`}
                  className="photo-thumbnail"
                />
              ))}
            </div>
          </div>
        </div>

        <div className="footer">
          <button
            onClick={handlePublish}
            className="publish-button"
          >
            Publier le logement
          </button>
        </div>
      </div>
    </div>
  );
}
