import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './ConfirmationLogement.css';

export default function NewCarConfirmation() {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) return <div className="text-center mt-10">Aucune donnée reçue.</div>;

  const {
    typeVehicule,
    typeLocation,
    ville,
    quartier,
    equipements,
    marque,
    modele,
    annee,
    kilometrage,
    carburant,
    transmission,
    couleur,
    etat,
    puissance_fiscale,
    consommation_moyenne,
    controle_technique,
    nombre_portes,
    nombre_places,
    price_per_day,
    price_for_sale,
    weekend_discount,
    images = [],            // pour preview
    imageFiles = []         // pour upload réel
  } = state;

  const uploadImages = async (files) => {
    const formData = new FormData();
    files.forEach((file, i) => {
      formData.append("images[]", file, file.name || `photo-${i}.jpg`);
    });

    const res = await fetch("http://localhost/flexii/api/upload_images.php", {
      method: "POST",
      body: formData,
      credentials: "include"
    });

    const text = await res.text();
    console.log("Réponse brute upload_images:", text);

    try {
      const data = JSON.parse(text);
      return data.urls || [];
    } catch (e) {
      console.error("Erreur JSON upload_images :", e);
      alert("Erreur lors du traitement des images");
      return [];
    }
  };

  const handlePublish = async () => {
    const uploadedUrls = await uploadImages(imageFiles);

    try {
      const response = await fetch('http://localhost/flexii/api/save_vehicle.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          type_vehicule: typeVehicule,
          type_location: typeLocation,
          ville,
          quartier,
          equipements,
          marque,
          modele,
          annee,
          kilometrage,
          carburant,
          transmission,
          couleur,
          etat,
          puissance_fiscale,
          consommation_moyenne,
          controle_technique,
          nombre_portes,
          nombre_places,
          images: uploadedUrls,
          price_per_day: price_per_day || null,
          price_for_sale: price_for_sale || null,
          weekend_discount
        })
      });

      const raw = await response.text();
      console.log("Réponse brute save_vehicle :", raw);

      const result = JSON.parse(raw);

      if (result.success) {
        alert("✅ Véhicule publié avec succès !");
        navigate('/');
      } else {
        alert("❌ Erreur serveur : " + result.error);
      }
    } catch (error) {
      console.error("❌ Erreur lors de la publication :", error);
      alert("Erreur lors de l'enregistrement du véhicule.");
    }
  };

  return (
    <div className="confirmation-container">
      <div className="confirmation-card">
        <h1 className="confirmation-title">🚗 Votre véhicule est prêt à être publié !</h1>

        <div className="confirmation-grid">
          <div>
            <div className="etape-scrollable">
            <h2 className="section-title"><i className="fas fa-info-circle"></i> Informations générales</h2>
            <ul className="info-list">
              <li><span className="label">Type</span><span className="value">{typeVehicule}</span></li>
              <li><span className="label">Mode</span><span className="value">{typeLocation || 'Vente'}</span></li>
              <li><span className="label">Ville</span><span className="value">{ville}</span></li>
              <li><span className="label">Quartier</span><span className="value">{quartier}</span></li>
              <li><span className="label">Marque</span><span className="value">{marque}</span></li>
              <li><span className="label">Modèle</span><span className="value">{modele}</span></li>
              <li><span className="label">Année</span><span className="value">{annee}</span></li>
              <li><span className="label">Kilométrage</span><span className="value">{kilometrage} km</span></li>
              <li><span className="label">Carburant</span><span className="value">{carburant}</span></li>
              <li><span className="label">Transmission</span><span className="value">{transmission}</span></li>
              <li><span className="label">Couleur</span><span className="value">{couleur}</span></li>
              <li><span className="label">État</span><span className="value">{etat}</span></li>
              <li><span className="label">Puissance fiscale</span><span className="value">{puissance_fiscale}</span></li>
              <li><span className="label">Conso. moyenne</span><span className="value">{consommation_moyenne}</span></li>
              <li><span className="label">Contrôle technique</span><span className="value">{controle_technique}</span></li>
              <li><span className="label">Portes</span><span className="value">{nombre_portes}</span></li>
              <li><span className="label">Places</span><span className="value">{nombre_places}</span></li>
            </ul>

            <h2 className="section-title"><i className="fas fa-euro-sign"></i> Tarifs</h2>
            <ul className="info-list">
              {price_per_day && (
                <li><span className="label">Prix par jour</span><span className="value">{price_per_day} FCFA</span></li>
              )}
              {price_for_sale && (
                <li><span className="label">Prix de vente</span><span className="value">{price_for_sale} FCFA</span></li>
              )}
              {price_per_day && (
                <li><span className="label">Réduction week-end</span><span className="value">{weekend_discount ? `-${weekend_discount}%` : 'Aucune'}</span></li>
              )}
            </ul>

            <h2 className="section-title"><i className="fas fa-tools"></i> Équipements</h2>
            <div className="badges">
              {equipements && equipements.length > 0 ? (
                equipements.map((eq, i) => (
                  <span key={i} className="badge">{eq.replace(/_/g, ' ')}</span>
                ))
              ) : (
                <span className="text-gray">Aucun équipement sélectionné</span>
              )}
            </div>
          </div>

          <div>
            <h2 className="section-title"><i className="fas fa-camera"></i> Photos</h2>
            <div className="photo-grid">
              {images.map((src, i) => (
                <img key={i} src={src} alt={`img-${i}`} className="photo-thumbnail" />
              ))}
            </div>
          </div>
        </div>

        <div className="footer">
          <button onClick={handlePublish} className="publish-button">Publier le véhicule</button>
        </div>
      </div>
    </div>
    </div>
  );
}
