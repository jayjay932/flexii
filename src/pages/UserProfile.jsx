import React, { useState, useEffect, useContext } from 'react';
import {
  FaUser, FaEnvelope, FaPhone, FaBirthdayCake, FaCity, FaPen, FaArrowLeft, FaImage, FaIdCard, FaWallet
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

export default function UserProfile() {
  const { auth, setAuth } = useContext(AuthContext);
  const { loggedIn, user } = auth;
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

  useEffect(() => {
    fetch('http://localhost/flexii/api/get_user_profile.php', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        console.log('Profil utilisateur :', data);
        setProfile(data);
      })
      .catch(err => console.error('Erreur chargement profil :', err));
  }, []);

  const updateField = async (field, value) => {
    const formData = new FormData();
    formData.append('user_id', user?.id);
    if (field === 'avatar_url' || field === 'id_url') {
      formData.append(field, value); // fichier
    } else {
      formData.append('field', field);
      formData.append('value', value);
    }

    try {
      const res = await fetch('http://localhost/flexii/api/update_user_profile.php', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
      const result = await res.json();
      console.log('Résultat API :', result);

      if (result.success) {
        setProfile(prev => ({
          ...prev,
          [field]: result[field] || value
        }));
        setMessage('✅ Modifié avec succès');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('❌ Erreur : ' + result.error);
      }
    } catch (error) {
      setMessage('❌ Erreur serveur');
    }

    setEditingField(null);
  };

  if (!profile) return <div>Chargement...</div>;

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
            <img
              src={profile.avatar_url ? `http://localhost/flexii/${profile.avatar_url}` : '/avatar-default.png'}
              className="avatar-preview-big"
              alt="Avatar"
              onError={() => console.log('❌ Image avatar non trouvée')}
            />
            <button className="edit-button-big" onClick={() => setEditingField('avatar_url')}>✏️ Modifier</button>
          </div>
        </div>



        <div className="right-column">
          <h1 className="host-form-title">Mon profil</h1>

          <div className="profile-field"><FaUser /> {profile.name} <FaPen onClick={() => setEditingField('name')} className="edit-icon" /></div>
          <div className="profile-field"><FaEnvelope /> {profile.email} <FaPen onClick={() => setEditingField('email')} className="edit-icon" /></div>
          <div className="profile-field"><FaPhone /> {profile.phone || 'Non renseigné'} <FaPen onClick={() => setEditingField('phone')} className="edit-icon" /></div>
          <div className="profile-field"><FaBirthdayCake /> {profile.date_naissance || 'Non renseignée'} <FaPen onClick={() => setEditingField('date_naissance')} className="edit-icon" /></div>
          <div className="profile-field"><FaCity /> {profile.ville || 'Non renseignée'} <FaPen onClick={() => setEditingField('ville')} className="edit-icon" /></div>
          <div className="profile-field">
            <FaIdCard />
            {profile.id_url ? (
              <>
                ✅ Pièce fournie –&nbsp;
                <a href={`http://localhost/flexii/${profile.id_url}`} target="_blank" rel="noopener noreferrer">Voir</a>
              </>
            ) : (
              '❌ Non fournie'
            )}
            <FaPen onClick={() => setEditingField('id_url')} className="edit-icon" />
          </div>
          <div className="profile-field"><FaWallet /> Solde : {profile.soldes} FCFA</div>

          {message && <p className="form-message success">{message}</p>}
        </div>
      </div>

      {editingField && (
        <EditFieldModal
          field={editingField}
          currentValue={profile[editingField] || ''}
          onSave={updateField}
          onClose={() => setEditingField(null)}
        />
      )}

      <LoginModal visible={loginOpen} onClose={closeLogin} onSwitch={() => { closeLogin(); openSignup(); }} onLoginSuccess={() => setLoginOpen(false)} />
      <SignupModal visible={signupOpen} onClose={closeSignup} onSignupSuccess={() => setSignupOpen(false)} />
      <BottomNav isLoggedIn={loggedIn} onLoginClick={openLogin} onSignupClick={openSignup} />
      <Footer />
    </div>
  );
}
