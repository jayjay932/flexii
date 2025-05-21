import React, { useEffect, useState, useContext } from 'react';
import { useLocation, useParams, Link } from 'react-router-dom';

import ImageCarousel from '../components/ImageCarousel';
import FullGallery from '../components/FullGallery';
import Head from '../components/Head';
import ProfileMenu from '../components/ProfileMenu';
import BottomNav from '../components/BottomNav';
import LoginModal from '../components/LoginModal';
import SignupModal from '../components/SignupModal';
import { AuthContext } from '../App';

function VehicleDetails() {
  const { id } = useParams();
  const location = useLocation();
  const initialVehicle = location.state?.car || null;

  const [vehicleData, setVehicleData] = useState(null);
  const [loading, setLoading] = useState(!initialVehicle);
  const [showGallery, setShowGallery] = useState(false);

  const { auth, setAuth } = useContext(AuthContext);
  const { loggedIn, user } = auth;

  const [menuVisible, setMenuVisible] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [signupOpen, setSignupOpen] = useState(false);

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);
  const openLogin = () => setLoginOpen(true);
  const closeLogin = () => setLoginOpen(false);
  const openSignup = () => setSignupOpen(true);
  const closeSignup = () => setSignupOpen(false);

  const handleLoginSuccess = (userData) => {
    setAuth({ loggedIn: true, user: userData, loading: false });
    closeLogin();
  };

  useEffect(() => {
    if (!initialVehicle) {
      setLoading(true);
      fetch(`http://localhost/flexii/api/get_vehicle.php?id=${id}`)
        .then(res => res.json())
        .then(data => setVehicleData(data))
        .catch(err => console.error('Erreur chargement véhicule :', err))
        .finally(() => setLoading(false));
    }
  }, [id, initialVehicle]);

  const vehicle = vehicleData || initialVehicle;

  if (loading) return <div>Chargement des détails du véhicule...</div>;
  if (!vehicle) return <div>Véhicule introuvable.</div>;

  return (
    <div className="listing-detail">
      <Head
        isLoggedIn={loggedIn}
        avatarUrl={user?.avatar || '/flexii.png'}
        onAvatarClick={openMenu}
      />

      <ProfileMenu
        isLoggedIn={loggedIn}
        onLoginClick={openLogin}
        onSignupClick={openSignup}
        visible={menuVisible}
        onClose={closeMenu}
      />

      {showGallery && (
        <FullGallery images={vehicle.images} onClose={() => setShowGallery(false)} />
      )}

      <div className="carousel">
        <ImageCarousel images={vehicle.images} onOpenGallery={() => setShowGallery(true)} />
      </div>

      <div className="container">
        <h1>{vehicle.title}</h1>
        <div className="location">{vehicle.city}, {vehicle.address}</div>

        <div className="details">
          <div className="tag">Marque : {vehicle.marque}</div>
          <div className="tag">Modèle : {vehicle.modele}</div>
          <div className="tag">Année : {vehicle.annee}</div>
        </div>

        <div className="price-booking">
          <div className="price">€{vehicle.price_per_day} / jour</div>
          <button className="btn">Réserver</button>
        </div>

        <div className="rules-card" style={{ marginTop: '50px' }}>
          <h2>Caractéristiques</h2>
          <ul className="rules-list">
            <li><i className="fas fa-gas-pump"></i> Carburant : {vehicle.carburant}</li>
            <li><i className="fas fa-cogs"></i> Transmission : {vehicle.transmission}</li>
            <li><i className="fas fa-tachometer-alt"></i> Kilométrage : {vehicle.kilometrage} km</li>
            <li><i className="fas fa-door-open"></i> Portes : {vehicle.nombre_portes}</li>
            <li><i className="fas fa-users"></i> Places : {vehicle.nombre_places}</li>
            <li><i className="fas fa-palette"></i> Couleur : {vehicle.couleur}</li>
            <li><i className="fas fa-thermometer-half"></i> Climatisation : {vehicle.climatisation ? 'Oui' : 'Non'}</li>
            <li><i className="fas fa-map-marker-alt"></i> GPS : {vehicle.gps ? 'Oui' : 'Non'}</li>
            <li><i className="fas fa-video"></i> Caméra recul : {vehicle.camera_recul ? 'Oui' : 'Non'}</li>
          </ul>
        </div>

        <div className="rules-card" style={{ marginTop: '50px' }}>
          <h2>Infos techniques</h2>
          <ul className="rules-list">
            <li><i className="fas fa-cube"></i> Type : {vehicle.type_vehicule}</li>
            <li><i className="fas fa-bolt"></i> Puissance fiscale : {vehicle.puissance_fiscale}</li>
            <li><i className="fas fa-gauge"></i> Conso : {vehicle.consommation_moyenne}</li>
            <li><i className="fas fa-clipboard-check"></i> Contrôle technique : {vehicle.controle_technique}</li>
            <li><i className="fas fa-tags"></i> État : {vehicle.etat}</li>
          </ul>
        </div>

        <DescriptionBlock description={vehicle.description || 'Aucune description fournie.'} />

        <BottomNav isLoggedIn={loggedIn} onLoginClick={openLogin} onSignupClick={openSignup} />

        <LoginModal visible={loginOpen} onClose={closeLogin} onSwitch={() => { closeLogin(); openSignup(); }} onLoginSuccess={handleLoginSuccess} />
        <SignupModal visible={signupOpen} onClose={closeSignup} onSignupSuccess={handleSignupSuccess} />
      </div>
    </div>
  );
}

export default VehicleDetails;
