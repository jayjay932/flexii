import React, { useEffect, useState, useContext } from 'react';
import { useLocation, useParams, Link } from 'react-router-dom';
import {
  FaCalendarAlt,
  FaTachometerAlt,
  FaGasPump,
  FaCogs,
  FaDoorOpen,
  FaUserFriends,
  FaPalette,
  FaSnowflake,
  FaChargingStation,
  FaCheckCircle,
  FaMapMarkerAlt,
  FaCamera,
  FaCarSide
} from 'react-icons/fa';


import ImageCarousel from '../components/ImageCarousel';
import FullGallery from '../components/FullGallery';
import DescriptionBlock from '../components/DescriptionBlock';
import Map from '../components/Map';
import CalendarModalCars from '../components/CalendarModalCars';
import Header from '../components/Header';
import ProfileMenu from '../components/ProfileMenu';
// ✅ Import CSS global

import Head from '../components/Head';
import BottomNav from '../components/BottomNav';

import LoginModal from '../components/LoginModal';
import SignupModal from '../components/SignupModal';
import { AuthContext } from '../App';

function CarsDetails() {
  const { id } = useParams();
  const location = useLocation();
  const initialListing = location.state?.listing || null;

  // États principaux
  const [listingData, setListingData] = useState(null);
  const [comments, setComments] = useState([]);
  const [host, setHost] = useState(null);
  const [availabilityMap, setAvailabilityMap] = useState({});
  const [loading, setLoading] = useState(!initialListing);
  const [loadingHost, setLoadingHost] = useState(true);
  const [showGallery, setShowGallery] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);

  // Auth / UI context
  const { auth, setAuth } = useContext(AuthContext);
  const { loggedIn, user } = auth;

  
    // UI state
    const [loginVisible, setLoginVisible] = useState(false);
    const [signupVisible, setSignupVisible] = useState(false);
    const [showReservation, setShowReservation] = useState(false);
    const [reloadListings, setReloadListings] = useState(false);
    const [sortOption, setSortOption] = useState('');
    const [filteredListings, setFilteredListings] = useState(null);
    const [defaultListings, setDefaultListings] = useState([]);
    const [menuVisible, setMenuVisible] = useState(false);
  
    const toggleMenu = () => setMenuVisible(v => !v);
    const resetFilters = () => setFilteredListings(null);
  
   
  
    const openMenu = () => setMenuVisible(true);
    const closeMenu = () => setMenuVisible(false); () => setMenuVisible(v => !v);
   

  // Modales
  const [loginOpen, setLoginOpen] = useState(false);
  const [signupOpen, setSignupOpen] = useState(false);
  const openLogin = () => setLoginOpen(true);
  const closeLogin = () => setLoginOpen(false);
  const openSignup = () => setSignupOpen(true);
  const closeSignup = () => setSignupOpen(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);

useEffect(() => {
  const handleResize = () => setIsMobile(window.innerWidth <= 600);
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []);


  const handleLoginSuccess = (userData) => {
    setAuth({ loggedIn: true, user: userData, loading: false });
    closeLogin();
  };

  const handleSignupSuccess = (userData) => {
    setAuth({ loggedIn: true, user: userData, loading: false });
    closeSignup();
  };

  // Quand on clique sur l'avatar
  const onAvatarClick = () => {
    if (loggedIn) {
      // éventuellement ouvrir un menu profil
    } else {
      openLogin();
    }
  };

  // ✅ Load availability
  useEffect(() => {
    fetch(`http://localhost/flexii/api/availabilities_cars.php?vehicule_id=${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.availabilities) {
          setAvailabilityMap(data.availabilities);
        }
      })
      .catch(err => console.error('Erreur chargement disponibilités :', err));
  }, [id]);
  

  // ✅ Load listing data
  useEffect(() => {
    if (!initialListing) {
      setLoading(true);
      fetch(`http://localhost/flexii/api/get_cars.php?id=${id}`)
        .then(res => res.json())
        .then(data => setListingData(data))
        .catch(err => console.error('Erreur API annonce :', err))
        .finally(() => setLoading(false));
    }
  }, [id, initialListing]);

  // ✅ Load comments
  useEffect(() => {
    fetch(`http://localhost/flexii/api/get_comments_cars.php?vehicule_id=${id}`)
      .then(res => res.json())
      .then(data => setComments(data))
      .catch(err => console.error('Erreur API commentaires :', err));
  }, [id]);

  // ✅ Load host info
  useEffect(() => {
    fetch(`http://localhost/flexii/api/get_host_cars.php?vehicule_id=${id}`)
      .then(res => res.json())
      .then(data => setHost(data))
      .catch(err => console.error('Erreur API hôte :', err))
      .finally(() => setLoadingHost(false));
  }, [id]);

  const listing = listingData || initialListing;
  const validComments = comments.filter(c => c.content?.trim());

  if (loading) return <div>Chargement des détails...</div>;
  if (!listing) return <div>Aucune information trouvée pour cette annonce.</div>;

  return (
    <div className="listing-detail">
      <Head
        isLoggedIn={loggedIn}
        avatarUrl={user?.avatar || '/flexii.png'}
        onAvatarClick={openMenu}
      />

      {/* Menu profil */}
      <ProfileMenu
        isLoggedIn={loggedIn}
        onLoginClick={openLogin}
        onSignupClick={openSignup}
        visible={menuVisible}
        onClose={closeMenu}
      />
      {showGallery && (
        <FullGallery images={listing.images} onClose={() => setShowGallery(false)} />
      )}

      <div className="carousel">
        <ImageCarousel images={listing.images} onOpenGallery={() => setShowGallery(true)} />
      </div>

      <div className="container">
        <h1>{listing.title}</h1>
        <div className="location">{listing.city}, {listing.address}</div>

        <div className="details">
 <div className="tag"><FaCalendarAlt /> Année : {listing.annee}</div>
          <div className="tag"><FaTachometerAlt /> {listing.kilometrage} km</div>
          <div className="tag"><FaGasPump /> {listing.carburant}</div>
          <div className="tag"><FaCogs /> {listing.transmission}</div>
        </div>

        <div className="price-booking">
          <div className="price">€{listing.price_per_day} / jour</div>
          <button className="btn" onClick={() => setCalendarOpen(true)}>
            Réserver
          </button>
        </div>

        <CalendarModalCars
          isOpen={calendarOpen}
          onClose={() => setCalendarOpen(false)}
          listingId={listing.id}
          availabilityMap={availabilityMap}
        />

<div className="rules-card" style={{ marginTop: '50px' }}>
<h2>Équipements</h2>
          <ul className="rules-list">
          <li>
               <i className="fas fa-calendar-alt icon-rose"></i>
     
      Type : {listing.type_location}
    </li>
          <li>  < FaDoorOpen style={{ color: '#e91e63', marginRight: 8 }} /> Portes : {listing.nombre_portes}</li>
            <li>< FaUserFriends style={{ color: '#e91e63', marginRight: 8 }} />  Places : {listing.nombre_places}</li>
            <li>     <FaPalette style={{ color: '#e91e63', marginRight: 8 }} /> Couleur : {listing.couleur}</li>
            {listing.climatisation && <li>    < FaSnowflake style={{ color: '#e91e63', marginRight: 8 }} />      Climatisation</li>}
        
           
            <li><i className="fas fa-tag"></i> État : {listing.etat}</li>
          </ul>
        </div>

        <DescriptionBlock description={listing.description} />

        <div className="rules-card" style={{ marginTop: '50px' }}>
          <h2 className="section-title">Règlement intérieur</h2>
          <ul className="rules-list">

          <li>  < FaChargingStation style={{ color: '#e91e63', marginRight: 8 }} /> Puissance fiscale : {listing.puissance_fiscale}</li>
            <li><FaCalendarAlt  style={{ color: '#e91e63', marginRight: 8 }} />
            Conso moyenne : {listing.consommation_moyenne}</li>
            <li>    <  FaCheckCircle style={{ color: '#e91e63', marginRight: 8 }} />                       CT valide : {listing.controle_technique}</li>
          </ul>
        </div>


        <div className="rules-card" style={{ marginTop: '50px' }}>
          <h2 className="section-title">Règlement intérieur</h2>
          <ul className="rules-list">
        
            <li> < FaCarSide style={{ color: '#e91e63', marginRight: 8 }} /> Type : {listing.type_vehicule}</li>
            <li><i className="fas fa-map-marker-alt"></i> GPS : {listing.gps ? 'Oui' : 'Non'}</li>
<li><i className="fas fa-video"></i> Caméra de recul : {listing.camera_recul ? 'Oui' : 'Non'}</li>

          </ul>
        </div>

       
        {validComments.length > 0 ? (
          <section style={{ marginTop: 50 }}>
            <h2 style={{ fontSize: 28, fontWeight: 'bold' }}>Coup de cœur voyageurs</h2>
            <p style={{ color: '#666', marginBottom: 30, maxWidth: 650 }}>
              Ce logement fait partie des Coups de cœur voyageurs, d’après les avis.
            </p>
            <div className="comments-section">
              {validComments.map((c, i) => (
                <div key={i} className="comment-card">
                  <div className="comment-text-wrapper">
                    <div className="comment-text">{c.content}</div>
                    <a href="#" className="read-more-link" onClick={e => {
                      e.preventDefault();
                      e.target.previousSibling.style.webkitLineClamp = 'unset';
                      e.target.style.display = 'none';
                    }}>
                      Lire la suite
                    </a>
                  </div>
                  <div className="comment-author-container">
                    <img src={c.avatar_url || '/default-avatar.jpg'} alt="avatar" className="comment-avatar" />
                    <div>
                      <div className="comment-author">{c.name}</div>
                      <div className="comment-meta">Voyageur Airbnb</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div style={{ textAlign: 'center', marginTop: 40  }}>
              
            <Link
  to={`/afficher_commentaires/${listing.id}`}
  className="btn"
  style={{
    padding: isMobile ? '8px 16px' : '12px 24px',
    fontSize: isMobile ? '14px' : '16px'
  }}
>
  Voir tous les commentaires
</Link>
            </div>
          </section>
          
        ) : (
          <div className="no-comments-container">
            <img src="/assets/empty-comments.svg" alt="Aucun commentaire" />
            <div className="no-comments-texts">
              <h3>Soyez le premier à laisser un avis !</h3>
              <p>Partagez votre expérience lors de votre séjour.</p>
              <button onClick={() => setCalendarOpen(true)} className="no-comments-btn">Réserver maintenant</button>
            </div>
          </div>
        )}

        {loadingHost ? (
          <div>Chargement des informations de l'hôte...</div>
        ) : host ? (
          <div className="host-card">
            <div className="host-left">
              <div className="host-avatar-container">
                <img src={host.avatar_url} alt={`Photo de ${host.name}`} className="host-avatar" />
                {host.superhost && <div className="superhost-badge">★</div>}
              </div>
              <div className="host-name">{host.name}</div>
              {host.superhost && <div className="superhost-text">Superhôte</div>}
            </div>
            <div className="host-right">
              <h3>{host.name} est Superhôte</h3>
              <p>Hôte expérimenté avec d’excellentes évaluations.</p>
              <div className="host-info">
                <div><strong>{host.total_reviews}</strong> évaluations</div>
                <div><strong>{host.rating?.toFixed(2)}</strong> note</div>
                <div><strong>{host.years_as_host}</strong> ans d’expérience</div>
              </div>
              <div className="host-extra">
                <p><i className="fas fa-birthday-cake"></i> Années {host.birth_year}</p>
                <p><i className="fas fa-briefcase"></i> {host.profession}</p>
              </div>
              <a href="#" className="btn-message">Envoyer un message</a>
            </div>
          </div>
        ) : (
          <p style={{ color: 'grey', marginTop: 40 }}>Aucun hôte trouvé pour ce logement.</p>
        )}

        {/* Modales connexion */}
        <LoginModal visible={loginOpen} onClose={closeLogin} onSwitch={() => { closeLogin(); openSignup(); }} onLoginSuccess={handleLoginSuccess} />
        <SignupModal visible={signupOpen} onClose={closeSignup} onSignupSuccess={handleSignupSuccess} />

        {/* Bottom Nav */}
        <BottomNav isLoggedIn={loggedIn} onLoginClick={openLogin} onSignupClick={openSignup} />
      </div>
    </div>
  );
}

export default CarsDetails;
