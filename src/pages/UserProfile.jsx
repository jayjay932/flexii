// src/pages/UserProfile.jsx

import { useEffect, useState, useContext } from 'react';
import './UserProfile.css';
import { useParams, useLocation } from 'react-router-dom';

import ProfileMenu from '../components/ProfileMenu';
import Head from '../components/Head';
import BottomNav from '../components/BottomNav';
import LoginModal from '../components/LoginModal';
import SignupModal from '../components/SignupModal';
import { AuthContext } from '../App';

function UserProfile() {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  const { id } = useParams();
  const location = useLocation();
  const initialListing = location.state?.listing || null;

  const [listingData, setListingData] = useState(null);
  const [comments, setComments] = useState([]);
  const [host, setHost] = useState(null);
  const [availabilityMap, setAvailabilityMap] = useState({});
  const [loading, setLoading] = useState(!initialListing);
  const [loadingHost, setLoadingHost] = useState(true);
  const [showGallery, setShowGallery] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);

  const { auth, setAuth } = useContext(AuthContext);
  const { loggedIn } = auth;

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
  const closeMenu = () => setMenuVisible(false);

  const [loginOpen, setLoginOpen] = useState(false);
  const [signupOpen, setSignupOpen] = useState(false);
  const openLogin = () => setLoginOpen(true);
  const closeLogin = () => setLoginOpen(false);
  const openSignup = () => setSignupOpen(true);
  const closeSignup = () => setSignupOpen(false);

  const handleLoginSuccess = () => setLoginOpen(false);
  const handleSignupSuccess = () => setSignupOpen(false);

  useEffect(() => {
    fetch('http://localhost/flexii/api/get_user_profile.php', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        setUser(data);
        setFormData(data);
      })
      .catch(err => console.error('Erreur chargement profil :', err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    const updates = Object.entries(formData).filter(([key, value]) => user[key] !== value);

    Promise.all(updates.map(([field, value]) => {
      return fetch('http://localhost/flexii/api/update_user_profile.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ field, value })
      });
    }))
      .then(() => {
        setUser(formData);
        setIsEditing(false);
      })
      .catch(err => console.error('Erreur mise à jour :', err));
  };

  if (!user) return <p>Chargement...</p>;

  return (
    <div className="profile-container">
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

      <div className="profile-header">
        <h2>Mon Profil</h2>
      </div>

      <div className="profile-card">
        {['name', 'email', 'phone', 'date_naissance', 'ville'].map((field) => (
          <div key={field} className="profile-item">
            <label>{field.replace('_', ' ').toUpperCase()}</label>
            {isEditing ? (
              <input
                type={field === 'date_naissance' ? 'date' : 'text'}
                name={field}
                value={formData[field] || ''}
                onChange={handleChange}
              />
            ) : (
              <span>{user[field] || 'Non renseigné'}</span>
            )}
          </div>
        ))}
      </div>

      <div className="save-all-container">
        {isEditing ? (
          <button className="save-all-btn" onClick={handleSave}>Enregistrer</button>
        ) : (
          <button className="edit-global-btn" onClick={() => setIsEditing(true)}>Modifier</button>
        )}
      </div>

      <LoginModal
        visible={loginOpen}
        onClose={closeLogin}
        onSwitch={() => { closeLogin(); openSignup(); }}
        onLoginSuccess={handleLoginSuccess}
      />

      <SignupModal
        visible={signupOpen}
        onClose={closeSignup}
        onSignupSuccess={handleSignupSuccess}
      />

      <BottomNav
        isLoggedIn={loggedIn}
        onLoginClick={openLogin}
        onSignupClick={openSignup}
      />
    </div>
  );
}

export default UserProfile;