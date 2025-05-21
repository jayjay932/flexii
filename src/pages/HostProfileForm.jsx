import React, { useState } from 'react';
import {
  FaUser, FaIdCard, FaBriefcase, FaBirthdayCake,
  FaHome, FaCar, FaAlignLeft, FaEnvelope, FaLock
} from 'react-icons/fa';
import './HostProfileForm.css';

export default function HostProfileForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');                  // ➕
  const [password, setPassword] = useState('');            // ➕
  const [birthYear, setBirthYear] = useState('');
  const [profession, setProfession] = useState('');
  const [hostType, setHostType] = useState('');
  const [description, setDescription] = useState('');
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [identityFile, setIdentityFile] = useState(null);
  const [identityUploaded, setIdentityUploaded] = useState(false);
  const [message, setMessage] = useState('');

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
    formData.append('email', email);                         // ➕
    formData.append('password', password);                   // ➕
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
        setMessage('❌ Une erreur est survenue.');
      }
    } catch (error) {
      console.error('Erreur :', error);
      setMessage('❌ Échec de l’envoi au serveur.');
    }
  };

  return (
    <div className="host-form-wrapper">
      <h1 className="host-form-title">Complétez votre profil d'hôte</h1>
      <p className="host-form-subtitle">Ces informations renforcent la confiance avec les voyageurs.</p>

      <form className="host-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label><FaEnvelope /> Email</label>
          <input type="email" placeholder="exemple@mail.com" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>

        <div className="form-group">
          <label><FaLock /> Mot de passe</label>
          <input type="password" placeholder="Mot de passe sécurisé" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>

        <div className="form-group avatar-upload">
          <label><FaUser /> Photo de profil</label>
          <input type="file" accept="image/*" onChange={handleAvatarUpload} />
          {avatarPreview && <img src={avatarPreview} alt="Avatar" className="avatar-preview" />}
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
            <p className="upload-success">✅ Pièce téléchargée avec succès</p>
          ) : (
            <p className="upload-hint">Vous pouvez la téléverser maintenant ou plus tard</p>
          )}
        </div>

        <button type="submit" className="submit-button">Enregistrer mon profil</button>
        {message && <p className="form-message">{message}</p>}
      </form>
    </div>
  );
}
