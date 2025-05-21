import { useState } from 'react';
import './LoginSignupModal.css';

function SignupModal({ visible, onClose, onSwitch }) {
  const [form, setForm] = useState({
    lastname: '',
    firstname: '',
    email: '',
    phone: '',
    password: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const res = await fetch('http://localhost/flexii/api/signup.php', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json', // ✅ on envoie du JSON
        },
        body: JSON.stringify(form), // ✅ on convertit le form en JSON
      });
  
      const data = await res.json();
      if (data.success) {
        window.location.reload(); // ou appelle une fonction `onSignupSuccess()`
      } else {
        alert("Erreur : " + data.message);
      }
    } catch (error) {
      console.error("Erreur API :", error);
      alert("Erreur serveur.");
    }
  };
  
  if (!visible) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content login-style">
        <img src="/flexii.png" alt="Logo" className="logo-modal" />
        <h2 className="modal-title">Inscription</h2>
        <form onSubmit={handleSubmit} className="signup-form">
          <div className="input-group">
            <i className="bi bi-person"></i>
            <input
              type="text"
              name="lastname"
              placeholder="Nom"
              value={form.lastname}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <i className="bi bi-person"></i>
            <input
              type="text"
              name="firstname"
              placeholder="Prénom"
              value={form.firstname}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <i className="bi bi-envelope"></i>
            <input
              type="email"
              name="email"
              placeholder="Adresse email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <i className="bi bi-telephone"></i>
            <input
              type="text"
              name="phone"
              placeholder="Téléphone"
              value={form.phone}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <i className="bi bi-lock"></i>
            <input
              type="password"
              name="password"
              placeholder="Mot de passe"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn-login">S'inscrire</button>
        </form>
        <p className="login-link">Déjà inscrit ? <a href="#" onClick={onSwitch}>Se connecter</a></p>
        <button className="close-button" onClick={onClose}>✖</button>
      </div>
    </div>
  );
}

export default SignupModal;
