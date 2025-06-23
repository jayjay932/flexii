import React, { useState, useContext } from 'react';
import {
  FaUser, FaIdCard, FaBriefcase, FaBirthdayCake,
  FaHome, FaAlignLeft, FaEnvelope, FaLock, FaArrowLeft
} from 'react-icons/fa';
import './HostProfileForm.css';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import LoginModal from '../components/LoginModal';
import SignupModal from '../components/SignupModal';
import { AuthContext } from '../App';
import Header from './Header';
import Footer from './Footer';

export default function HostProfileForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [profession, setProfession] = useState('');
  const [hostType, setHostType] = useState('');
  const [description, setDescription] = useState('');
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [identityFile, setIdentityFile] = useState(null);
  const [identityUploaded, setIdentityUploaded] = useState(false);
  const [message, setMessage] = useState('');
  const [loginOpen, setLoginOpen] = useState(false);
  const [signupOpen, setSignupOpen] = useState(false);

  const navigate = useNavigate();
  const { auth, setAuth } = useContext(AuthContext);
  const { loggedIn } = auth;

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

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarPreview(URL.createObjectURL(file));
      setAvatarFile(file);
    }
  };

  const handleIdentityUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIdentityFile(file);
      setIdentityUploaded(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('birth_year', birthYear);
    formData.append('profession', profession);
    formData.append('host_type', hostType);
    formData.append('description', description);
    if (avatarFile) formData.append('avatar', avatarFile);
    if (identityFile) formData.append('identity', identityFile);

    try {
      const response = await fetch('http://localhost/flexii/api/host_register.php', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });

      const result = await response.json();
      if (result.success) {
        setMessage('✅ Profil enregistré avec succès !');
      } else {
        setMessage(result.error || '❌ Une erreur est survenue.');
      }
    } catch (error) {
      setMessage('❌ Échec de l’envoi au serveur.');
    }
  };

  return (
    <div className="host-profile-fullscreen">
      <Header />

      {/* ✅ Bouton retour fixé en haut à droite */}
      <div className="fixed-back-button">
        <button className="back-button" onClick={() => navigate(-1)}>
          <FaArrowLeft /> Retour
        </button>
      </div>

      <div className="host-profile-container">
        <div className="left-column">
          <div className="avatar-upload">
            <label htmlFor="avatar-input">
              {avatarPreview ? (
                <img src={avatarPreview} alt="Avatar" className="avatar-preview-big" />
              ) : (
                <div className="avatar-preview-big">
                  <span className="avatar-letter">J</span>
                </div>
              )}
            </label>
            <input id="avatar-input" type="file" accept="image/*" onChange={handleAvatarUpload} />
            <div className="edit-button-big">📷 Ajouter</div>
          </div>
        </div>

        <div className="right-column">
          <h1 className="host-form-title">Mon profil</h1>
          <p className="host-form-subtitle">
            Les hôtes et les voyageurs peuvent consulter votre profil et il peut apparaître sur Airbnb pour nous aider à instaurer un climat de confiance au sein de la communauté. <a href="#">En savoir plus</a>
          </p>

          <form className="host-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label><FaEnvelope /> Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>

            <div className="form-group">
              <label><FaLock /> Mot de passe</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>

            <div className="form-group">
              <label><FaUser /> Nom complet</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
            </div>

            <div className="form-group">
              <label><FaBirthdayCake /> Année de naissance</label>
              <input type="number" min="1900" max={new Date().getFullYear()} value={birthYear} onChange={(e) => setBirthYear(e.target.value)} />
            </div>

            <div className="form-group">
              <label><FaBriefcase /> Profession</label>
              <input type="text" value={profession} onChange={(e) => setProfession(e.target.value)} />
            </div>

            <div className="form-group">
              <label><FaHome /> Type d'hôte</label>
              <select value={hostType} onChange={(e) => setHostType(e.target.value)}>
                <option value="">-- Sélectionner --</option>
                <option value="logement">Logement</option>
                <option value="vehicule">Véhicule</option>
                <option value="mixte">Les deux</option>
              </select>
            </div>

            <div className="form-group">
              <label><FaAlignLeft /> Présentez-vous</label>
              <textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>

            <div className="form-group">
              <label><FaIdCard /> Pièce d'identité</label>
              <input type="file" accept=".jpg,.jpeg,.png,.pdf" onChange={handleIdentityUpload} />
              {identityUploaded ? (
                <p className="upload-success">✅ Pièce téléchargée</p>
              ) : (
                <p className="upload-hint">Ajoutez-la maintenant ou plus tard</p>
              )}
            </div>

            <button type="submit" className="submit-button">Enregistrer</button>
            {message && (
              <p className={`form-message ${message.startsWith('✅') ? 'success' : 'error'}`}>
                {message}
              </p>
            )}
          </form>
        </div>
      </div>

      <LoginModal visible={loginOpen} onClose={closeLogin} onSwitch={() => { closeLogin(); openSignup(); }} onLoginSuccess={handleLoginSuccess} />
      <SignupModal visible={signupOpen} onClose={closeSignup} onSignupSuccess={handleSignupSuccess} />
      <BottomNav isLoggedIn={loggedIn} onLoginClick={openLogin} onSignupClick={openSignup} />
      <Footer />
    </div>
  );
}
