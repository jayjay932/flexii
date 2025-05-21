import { useEffect, useRef } from 'react';

function Map({ latitude, longitude }) {
  const mapRef = useRef(null);

  useEffect(() => {
    const listingLocation = { lat: parseFloat(latitude), lng: parseFloat(longitude) };

    // ✅ Check si Google Maps existe déjà
    if (window.google && window.google.maps) {
      initMap();
    } else {
      // Vérifie si le script est déjà ajouté pour éviter les doublons
      const existingScript = document.querySelector('script[src*="maps.googleapis.com/maps/api/js"]');

      if (!existingScript) {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyANC5-Qo3NebRXGc6lazv4R__w7TYVFB0s`;
        script.async = true;
        script.onload = () => {
          initMap();
        };
        document.body.appendChild(script);
      } else {
        // Le script est déjà là mais peut-être pas encore chargé
        existingScript.addEventListener('load', () => {
          initMap();
        });
      }
    }

    function initMap() {
      if (!mapRef.current) return; // ✅ sécurité
      const map = new window.google.maps.Map(mapRef.current, {
        center: listingLocation,
        zoom: 13,
      });

      new window.google.maps.Marker({
        position: listingLocation,
        map,
        title: 'Emplacement du logement',
      });
    }
  }, [latitude, longitude]);

  return (
    <div
      ref={mapRef}
      style={{ width: '100%', height: '400px', borderRadius: '12px', marginTop: '40px' }}
    ></div>
  );
}

export default Map;
