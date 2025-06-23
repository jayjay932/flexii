import React, { useState, useEffect, useContext } from 'react';
import {
  FaUser, FaIdCard, FaBriefcase, FaBirthdayCake,
  FaHome, FaAlignLeft, FaEnvelope, FaLock, FaPen, FaArrowLeft
} from 'react-icons/fa';

import './HostProfileview.css';
import Header from './Header';
import Footer from './Footer';
import BottomNav from '../components/BottomNav';
import LoginModal from '../components/LoginModal';
import SignupModal from '../components/SignupModal';
import EditFieldModal from './EditFieldModal';
import { AuthContext } from '../App';
import { useNavigate } from 'react-router-dom';

export default function HostProfileView() {
  const { auth, setAuth } = useContext(AuthContext);
  const { user, loggedIn } = auth;
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [editingField, setEditingField] = useState(null);
  const [message, setMessage] = useState('');

  const [loginOpen, setLoginOpen] = useState(false);
  const [signupOpen, setSignupOpen] = useState(false);

  const openLogin = () => setLoginOpen(true);
  const closeLogin = () => setLoginOpen(false);
  const openSignup = () => setSignupOpen(true);
  const closeSignup = () => setSignupOpen(false);

  const handleLoginSuccess = (userData) => {
    setAuth({ loggedIn: true, user: userData });
    closeLogin();
  };

  const handleSignupSuccess = (userData) => {
    setAuth({ loggedIn: true, user: userData });
    closeSignup();
  };

  useEffect(() => {
    fetch(`http://localhost/flexii/api/get_host_profile.php`, { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        console.log("Profil chargé :", data);
        setProfile(data);
        // Mise à jour de l'auth context avec l'utilisateur
        setAuth(prev => ({ ...prev, loggedIn: true, user: data }));
      })
      .catch(err => console.error('Erreur chargement profil :', err));
  }, [setAuth]);

  const openModal = (field) => setEditingField(field);
  const closeModal = () => setEditingField(null);

  const updateField = async (field, value) => {
    // Protection : utilisateur non connecté
    if (!user || !user.id) {
      setMessage("❌ Utilisateur non authentifié.");
      closeModal();
      return;
    }

    const formData = new FormData();
    formData.append('user_id', user.id);

    if (field === 'avatar' || field === 'identity') {
      formData.append(field === 'avatar' ? 'avatar' : 'identity', value);
    } else {
      formData.append(field, value);
    }

    try {
      const res = await fetch('http://localhost/flexii/api/update_host_profile.php', {
        method: 'POST',
        body: formData,
      });

      const result = await res.json();
      console.log("Résultat API :", result);

      if (result.success) {
        if (field === 'avatar') {
          setProfile((prev) => ({ ...prev, avatar_url: result.avatar_url }));
        } else if (field === 'identity') {
          setProfile((prev) => ({ ...prev, identity_url: result.identity_url }));
        } else {
          setProfile((prev) => ({ ...prev, [field]: value }));
        }

        setMessage('✅ Modifié avec succès');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('❌ Erreur : ' + result.error);
      }
    } catch (err) {
      setMessage('❌ Erreur de connexion au serveur');
    }

    closeModal();
  };

  if (!profile) return <div>Chargement du profil...</div>;

  return (
    <div className="host-profile-fullscreen">
      <Header />

      <div className="fixed-back-button">
        <button onClick={() => navigate(-1)} className="back-button">
          <FaArrowLeft /> Retour
        </button>
      </div>

      <div className="host-profile-container">
        <div className="left-column">
          <div className="avatar-upload">
            {profile.avatar_url && (
              <img
                src={`http://localhost/flexii/${profile.avatar_url}`}
                className="avatar-preview-big"
                alt="Avatar"
                onError={() => console.log("❌ Image introuvable :", profile.avatar_url)}
              />
            )}
            <button className="edit-button-big" onClick={() => openModal('avatar')}>✏️ Modifier</button>
          </div>
        </div>

        <div className="right-column">
          <h1 className="host-form-title">Mon profil</h1>

          <div className="profile-field"><FaEnvelope /> {profile.email} <FaPen onClick={() => openModal('email')} className="edit-icon" /></div>
          <div className="profile-field"><FaLock /> ******** <FaPen onClick={() => openModal('password')} className="edit-icon" /></div>
          <div className="profile-field"><FaUser /> {profile.name} <FaPen onClick={() => openModal('name')} className="edit-icon" /></div>
          <div className="profile-field"><FaBirthdayCake /> {profile.birth_year} <FaPen onClick={() => openModal('birth_year')} className="edit-icon" /></div>
          <div className="profile-field"><FaBriefcase /> {profile.profession} <FaPen onClick={() => openModal('profession')} className="edit-icon" /></div>
          <div className="profile-field"><FaHome /> {profile.host_type} <FaPen onClick={() => openModal('host_type')} className="edit-icon" /></div>
          <div className="profile-field"><FaAlignLeft /> {profile.description} <FaPen onClick={() => openModal('description')} className="edit-icon" /></div>

          <div className="profile-field">
            <FaIdCard />
            {profile.identity_url ? (
              <>
                ✅ Déjà fournie –&nbsp;
                <a
                  href={`http://localhost/flexii/${profile.identity_url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: 'underline', color: '#cc3366' }}
                >
                  Voir
                </a>
              </>
            ) : (
              '❌ Non fournie'
            )}
            <FaPen onClick={() => openModal('identity')} className="edit-icon" />
          </div>

          {message && <p className="form-message success">{message}</p>}
        </div>
      </div>

      {editingField && (
        <EditFieldModal
          field={editingField}
          currentValue={profile[editingField] || ''}
          onSave={updateField}
          onClose={closeModal}
        />
      )}

      <LoginModal
        visible={loginOpen}
        onClose={closeLogin}
        onSwitch={() => {
          closeLogin();
          openSignup();
        }}
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
      <Footer />
    </div>
  );
}
