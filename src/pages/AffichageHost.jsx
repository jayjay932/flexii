// src/pages/AffichageHost.jsx

import { useEffect, useState } from 'react';
import './UserProfile.css';

function AffichageHost() {
  const [host, setHost] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [identityUploaded, setIdentityUploaded] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('http://localhost/flexii/api/get_host_profile.php', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        setHost(data);
        setFormData(data);
        if (data.avatar_url) setAvatarPreview(data.avatar_url);
        if (data.identity_verified) setIdentityUploaded(true);
      })
      .catch(err => console.error('Erreur chargement profil hôte :', err));
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files && files.length > 0) {
      if (name === 'avatar') {
        setFormData(prev => ({ ...prev, avatar: files[0] }));
        setAvatarPreview(URL.createObjectURL(files[0]));
      }
      if (name === 'identity') {
        setFormData(prev => ({ ...prev, identity: files[0] }));
        setIdentityUploaded(true);
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async () => {
    const form = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== host[key] || key === 'avatar' || key === 'identity') {
        form.append(key, value);
      }
    });

    try {
      const res = await fetch('http://localhost/flexii/api/update_host_profile.php', {
        method: 'POST',
        body: form,
        credentials: 'include'
      });

      const result = await res.json();
      if (result.success) {
        setHost({ ...host, ...formData });
        setIsEditing(false);
        setMessage('✅ Profil mis à jour avec succès.');
      } else {
        setMessage(result.error || '❌ Erreur lors de la mise à jour.');
      }
    } catch (err) {
      console.error(err);
      setMessage('❌ Échec de la mise à jour.');
    }
  };

  if (!host) return <p>Chargement...</p>;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h2>Profil Hôte</h2>
      </div>

      <div className="profile-card">
        <div className="profile-item">
          <label>Nom complet</label>
          {isEditing
            ? <input name="name" value={formData.name || ''} onChange={handleChange} />
            : <span>{host.name}</span>}
        </div>

        <div className="profile-item">
          <label>Email</label>
          {isEditing
            ? <input name="email" type="email" value={formData.email || ''} onChange={handleChange} />
            : <span>{host.email}</span>}
        </div>

        <div className="profile-item">
          <label>Mot de passe</label>
          {isEditing
            ? <input name="password" type="password" placeholder="Nouveau mot de passe" onChange={handleChange} />
            : <span>••••••••</span>}
        </div>

        <div className="profile-item">
          <label>Année de naissance</label>
          {isEditing
            ? <input name="birth_year" type="number" value={formData.birth_year || ''} onChange={handleChange} />
            : <span>{host.birth_year}</span>}
        </div>

        <div className="profile-item">
          <label>Profession</label>
          {isEditing
            ? <input name="profession" value={formData.profession || ''} onChange={handleChange} />
            : <span>{host.profession}</span>}
        </div>

        <div className="profile-item">
          <label>Type d'hôte</label>
          {isEditing
            ? <select name="host_type" value={formData.host_type || ''} onChange={handleChange}>
                <option value="">-- Sélectionner --</option>
                <option value="logement">Logement</option>
                <option value="vehicule">Véhicule</option>
                <option value="mixte">Les deux</option>
              </select>
            : <span>{host.host_type}</span>}
        </div>

        <div className="profile-item">
          <label>Description</label>
          {isEditing
            ? <textarea name="description" rows="3" value={formData.description || ''} onChange={handleChange} />
            : <span>{host.description}</span>}
        </div>

        <div className="profile-item">
          <label>Photo de profil</label>
          {isEditing ? (
            <>
              <input type="file" name="avatar" accept="image/*" onChange={handleChange} />
              {avatarPreview && <img src={avatarPreview} className="avatar-preview" alt="avatar" />}
            </>
          ) : avatarPreview ? (
            <img src={avatarPreview} className="avatar-preview" alt="avatar" />
          ) : (
            <span>Non fournie</span>
          )}
        </div>

        <div className="profile-item">
          <label>Pièce d'identité</label>
          {isEditing ? (
            <>
              <input type="file" name="identity" accept=".jpg,.jpeg,.png,.pdf" onChange={handleChange} />
              <p>{identityUploaded ? '✅ Téléversée' : 'Non téléversée'}</p>
            </>
          ) : (
            <span>{identityUploaded || host.identity_verified ? '✅ Fournie' : 'Non fournie'}</span>
          )}
        </div>
      </div>

      <div className="save-all-container">
        {isEditing ? (
          <button className="save-all-btn" onClick={handleSave}>Enregistrer</button>
        ) : (
          <button className="edit-global-btn" onClick={() => setIsEditing(true)}>Modifier</button>
        )}
      </div>

      {message && (
        <p className={`form-message ${message.startsWith('✅') ? 'success' : 'error'}`}>
          {message}
        </p>
      )}
    </div>
  );
}

export default AffichageHost;
