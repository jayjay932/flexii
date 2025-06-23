import React, { useState, useEffect, useContext } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

import BottomNav from '../components/BottomNav';
import LoginModal from '../components/LoginModal';
import SignupModal from '../components/SignupModal';
import ProfileMenu from '../components/ProfileMenu';
import Head from '../components/Head';
import { AuthContext } from '../App';

export default function CheckoutPage() {
  const [searchParams] = useSearchParams();
  const listingId = searchParams.get('id');
  const startDate = searchParams.get('start_date');
  const endDate = searchParams.get('end_date');
  const navigate = useNavigate();

  const checkoutStyles = `
  .overlay-loading {
    position: fixed;
    inset: 0;
    background: rgba(255, 255, 255, 0.85);
    z-index: 999999;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .loader {
    width: 48px;
    height: 48px;
    border: 5px solid #FF385C;
    border-top: 5px solid transparent;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 15px;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  .checkout-wrapper {
    background: #fafafa;
    font-family: 'Inter', sans-serif;
    padding: 20px;
    color: #333;
    max-width: 1000px;
    margin: 0 auto;
    border-radius: 20px;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.05);
    display: flex;
    flex-direction: column;
    gap: 30px;
  }

  .checkout-left,
  .checkout-right {
    background: #fff;
    padding: 20px;
    margin-bottom: 10px;
    border-radius: 20px;
  }

  .summary-image {
    width: 100%;
    height: 300px;
    background-size: cover;
    background-position: center;
    border-radius: 12px;
    margin-bottom: 1px;
  }

  h1 {
    font-size: 22px;
    margin-bottom: 16px;
    font-weight: 600;
  }

  .section-title {
    font-weight: bold;
    margin-bottom: 8px;
    color: #FF385C;
  }

  input,
  select,
  textarea {
    width: 100%;
    padding: 12px;
    margin-top: 6px;
    margin-bottom: 16px;
    border-radius: 10px;
    border: 1px solid #eee;
    background: #fff;
  }

  textarea {
    resize: none;
  }

  .btn-submit {
    width: 100%;
    padding: 14px;
    background: #FF385C;
    color: white;
    font-weight: bold;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    transition: background 0.3s ease;
  }

  .btn-submit:hover {
    background: #e03652;
  }

  .cancel-link {
    display: block;
    margin-top: 10px;
    color: #FF385C;
    text-align: center;
    text-decoration: underline;
  }

  .free-cancel {
    font-size: 13px;
    color: #555;
    margin-top: 5px;
  }

  .section.warning {
    background-color: #fff0f1;
    border-left: 5px solid #FF385C;
    padding: 20px;
    border-radius: 12px;
    font-size: 14px;
    line-height: 1.6;
    color: #C4002F;
    margin-bottom: 20px;
  }

  @media screen and (min-width: 768px) {
    .checkout-wrapper {
      flex-direction: row;
    }

    .checkout-left,
    .checkout-right {
      flex: 1;
    }

    .checkout-left {
      margin-right: 20px;
    }
  }
`;


  const { auth, setAuth } = useContext(AuthContext);
  const { loggedIn, user } = auth;

  const [loginVisible, setLoginVisible] = useState(false);
  const [signupVisible, setSignupVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);

  const openLogin = () => setLoginVisible(true);
  const closeLogin = () => setLoginVisible(false);
  const openSignup = () => setSignupVisible(true);
  const closeSignup = () => setSignupVisible(false);
  const toggleMenu = () => setMenuVisible((v) => !v);

  const handleLoginSuccess = (userData) => {
    setAuth({ loggedIn: true, user: userData, loading: false });
    closeLogin();
  };

  const handleSignupSuccess = (userData) => {
    setAuth({ loggedIn: true, user: userData, loading: false });
    closeSignup();
  };

  const onAvatarClick = () => {
    if (loggedIn) toggleMenu();
    else openLogin();
  };

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [messageSuccess, setMessageSuccess] = useState('');
  const [checkingCode, setCheckingCode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formValues, setFormValues] = useState({
    nom: '',
    numeroMobile: '',
    nomMobile: '',
    codeAgent: '',
    creneauArrivee: '14:00',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
  const styleTag = document.createElement('style');
  styleTag.innerHTML = checkoutStyles;
  document.head.appendChild(styleTag);
  return () => {
    document.head.removeChild(styleTag);
  };
}, []);

  useEffect(() => {
    if (!listingId || !startDate || !endDate) {
      setError('Paramètres manquants dans l’URL.');
      setLoading(false);
      return;
    }

    fetch(`http://localhost/flexii/api/checkout_info.php?id=${listingId}&start_date=${startDate}&end_date=${endDate}`, {
      credentials: 'include',
    })
      .then((res) => {
        if (!res.ok) throw new Error('Échec de la récupération des données.');
        return res.json();
      })
      .then((json) => {
        if (json.error) throw new Error(json.error);
        setData(json);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [listingId, startDate, endDate]);

  const handleConfirm = async () => {
  setError(null);
  setMessageSuccess('');
  setCheckingCode(true);
  setIsSubmitting(true);

  const payload = {
    id: listingId,
    start_date: startDate,
    end_date: endDate,

    ...formValues,
    check_in_hours: `${startDate} ${formValues.creneauArrivee}:00`,
  };

  try {
    if (!listingId || !startDate || !endDate) {
      throw new Error("Paramètres manquants.");
    }

    if (formValues.codeAgent?.trim()) {
      const resAgent = await fetch(`http://localhost/flexii/api/verify_agent.php?code=${formValues.codeAgent}`);
      const jsonAgent = await resAgent.json();
      if (!jsonAgent.exists) {
        throw new Error("Code agent invalide.");
      }
    }

    const res = await fetch('http://localhost/flexii/api/checkouts.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload),
    });

    const json = await res.json();

    if (!res.ok || json.error) {
      throw new Error(json?.error || "Erreur serveur");
    }

    setMessageSuccess(`✅ Réservation réussie !`);

    // NE PAS METTRE setIsSubmitting(false) ICI !
    setTimeout(() => {
      navigate(`/recap-reservation/${json.booking_id}`);
      // Optionnel : setIsSubmitting(false); si tu reviens ici sans reload
    }, 1800);
  } catch (err) {
    setError(err.message);
    setCheckingCode(false);
    setIsSubmitting(false); // En cas d'erreur seulement !
  }
};

  if (loading) return <p>Chargement…</p>;
  if (error) return <p className="error">{error}</p>;

  const { listing, mainImage, nbNuits = 0, totalPrice: apiTotal } = data;
  const priceNight = Math.round(Number(listing.price_per_night)) || 0;
  const totalRaw = Math.round(Number(apiTotal)) || priceNight * nbNuits;
  const grandTotal = totalRaw;
  const acompteMobile = 5000;
  const resteEspece = grandTotal - acompteMobile;

  return (
    <>
      {isSubmitting && (
        <div className="overlay-loading">
          <div className="loader" />
          <p>Finalisation de votre réservation…</p>
        </div>
      )}

      <Head isLoggedIn={loggedIn} avatarUrl={user?.avatar || '/flexii.png'} onAvatarClick={onAvatarClick} />
      <ProfileMenu
        isLoggedIn={loggedIn}
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        onLoginClick={openLogin}
        onSignupClick={openSignup}
      />

      <div className="checkout-wrapper">
        <div className="checkout-right">
          <img src="/f.png" alt="Logo" className="logo" />
          <h1>Demande de réservation</h1>

          <div className="section">
            <div className="section-title">1. Informations client</div>
            <label>Nom complet</label>
            <input type="text" name="nom" value={formValues.nom} onChange={handleChange} required />

            <label>Numéro Mobile Money</label>
            <input type="text" name="numeroMobile" value={formValues.numeroMobile} onChange={handleChange} required />

            <label>Nom titulaire Mobile Money</label>
            <input type="text" name="nomMobile" value={formValues.nomMobile} onChange={handleChange} required />

            <label>Code agent (optionnel)</label>
            <input type="text" name="codeAgent" value={formValues.codeAgent} onChange={handleChange} />

            <label>Choisissez votre créneau d’arrivée</label>
            <select name="creneauArrivee" value={formValues.creneauArrivee} onChange={handleChange}>
              {Array.from({ length: 13 }, (_, i) => {
                const hour = i + 8;
                const label = `${hour.toString().padStart(2, '0')}:00`;
                return <option key={label} value={label}>{label}</option>;
              })}
            </select>
          </div>

          <div className="section">
            <div className="section-title">2. Paiement</div>
            <p>Reste à payer à l’arrivée en espèces : <strong>{resteEspece.toFixed(2)} FCFA</strong></p>
          </div>
        </div>

        <div className="checkout-left">
          <div className="summary-image" style={{ backgroundImage: `url(${mainImage})` }} />
          <div className="section">
            <div><strong>{listing.title}</strong></div>
            <small>{listing.address}</small>
            <p className="free-cancel">Annulation gratuite jusqu'à 3 jours avant l'arrivée.</p>
          </div>

          <div className="section">
            <div className="section-title">Informations sur le voyage</div>
            <p>
              {new Date(startDate).getDate()}–{new Date(endDate).getDate()} {new Date(endDate).toLocaleString('fr-FR', { month: 'long', year: 'numeric' })}<br />
              1 adulte
            </p>
          </div>

          <div className="section">
            <div className="section-title">Détail du prix</div>
            <p>Prix par nuit : {priceNight} FCFA x {nbNuits} nuit(s)</p>
            <hr />
            <p><strong>Total séjour : {grandTotal} FCFA</strong></p>
            <p>À payer maintenant via Mobile Money : <strong>{acompteMobile} FCFA</strong></p>
          </div>

          <div className="section warning">
            <p>⚠️ <strong>Nom Mobile Money exact obligatoire</strong> : si le nom ne correspond pas, la réservation sera rejetée.</p>
            <p>⚠️ <strong>Les 5 000 FCFA</strong> sont <u>non remboursables</u>, sauf annulation par l’hôte.</p>
            <p>⚠️ <strong>Ponctualité requise</strong> : retard non justifié = annulation possible.</p>
          </div>

          {checkingCode && <p className="info">⏳ Vérification du code agent…</p>}
          {messageSuccess && <p className="success">{messageSuccess}</p>}
          {error && <p className="error">{error}</p>}

          <div className="section">
            <button onClick={handleConfirm} className="btn-submit">Confirmer la réservation</button>
            <a href={`/listing/${listingId}`} className="cancel-link">Annuler</a>
          </div>
        </div>

        <LoginModal visible={loginVisible} onClose={closeLogin} onSwitch={() => { closeLogin(); openSignup(); }} onLoginSuccess={handleLoginSuccess} />
        <SignupModal visible={signupVisible} onClose={closeSignup} onSignupSuccess={handleSignupSuccess} />

        <BottomNav isLoggedIn={loggedIn} onLoginClick={openLogin} onSignupClick={openSignup} />
      </div>

      <footer className="footer">
        <p>© {new Date().getFullYear()} flexii. Tous droits réservés.</p>
      </footer>
    </>
  );
}
