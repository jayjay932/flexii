import { useState } from 'react';
import './LoginSignupModal.css';

function LoginModal({ visible, onClose, onSwitch, onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!visible) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost/flexii/api/login.php', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (data.success) {
        onLoginSuccess(data.user); // ← déclenche le reload côté HomePage
        onClose(); // ferme la modale
      } else {
        alert(data.message || "Erreur de connexion.");
      }
    } catch (err) {
      console.error('Erreur réseau', err);
      alert("Erreur réseau");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content login-style">
        <img src="/flexii.png" alt="Logo" className="logo-modal" />
        <h2 className="modal-title">Se connecter</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <i className="bi bi-envelope"></i>
            <input type="email" placeholder="Adresse email" required value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div className="input-group">
            <i className="bi bi-lock"></i>
            <input type="password" placeholder="Mot de passe" required value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          <button type="submit" className="btn-login">Connexion</button>
        </form>
        <p className="login-link">Pas encore inscrit ? <a href="#" onClick={onSwitch}>Créer un compte</a></p>
        <button className="close-button" onClick={onClose}>✖</button>
      </div>
    </div>
  );
}

export default LoginModal;
