import React, { useState, useEffect, useContext } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import './CheckoutPage.css';
import BottomNav from '../components/BottomNav';
import LoginModal from '../components/LoginModal';
import SignupModal from '../components/SignupModal';
import { AuthContext } from '../App';
import { Link } from 'react-router-dom';


export default function FormulaireAchat() {
  const [searchParams] = useSearchParams();
  const listingId = searchParams.get('id');
  const navigate = useNavigate();

  const { auth, setAuth } = useContext(AuthContext);
  const { loggedIn, user } = auth;

  const [loginVisible, setLoginVisible] = useState(false);
  const [signupVisible, setSignupVisible] = useState(false);

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [formValues, setFormValues] = useState({
    nom: '',
    numeroMobile: '',
    nomMobile: '',
    codeAgent: '',
    creneauArrivee: '14:00',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues(prev => ({ ...prev, [name]: value }));
  };

  const openLogin = () => setLoginVisible(true);
  const closeLogin = () => setLoginVisible(false);
  const openSignup = () => setSignupVisible(true);
  const closeSignup = () => setSignupVisible(false);

  const handleLoginSuccess = (userData) => {
    setAuth({ loggedIn: true, user: userData, loading: false });
    closeLogin();
  };

  const handleSignupSuccess = (userData) => {
    setAuth({ loggedIn: true, user: userData, loading: false });
    closeSignup();
  };

  useEffect(() => {
    if (!listingId) {
      setError('Paramètre "id" manquant dans l’URL.');
      setLoading(false);
      return;
    }

    fetch(`http://localhost/flexii/api/checkout_sales.php?id=${listingId}`, {
      credentials: 'include',
    })
      .then(res => {
        if (!res.ok) throw new Error('Échec de la récupération des données.');
        return res.json();
      })
      .then(json => {
        if (json.error) throw new Error(json.error);
        setData(json);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [listingId]);

  const handleConfirm = () => {
    setError(null);
    fetch('http://localhost/flexii/api/checkout.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        id: listingId,
        ...formValues,
        type: 'achat', // optionnel mais utile pour distinguer côté backend
      }),
    })
      .then(res => {
        if (!res.ok) throw new Error('Impossible de valider l’achat.');
        return res.json();
      })
      .then(json => {
        if (json.error) throw new Error(json.error);
        navigate(`/listing/${listingId}?success=1`);
      })
      .catch(err => setError(err.message));
  };

  if (loading) return <p>Chargement…</p>;
  if (error) return <p className="error">{error}</p>;

  const { listing, mainImage, totalPrice: apiTotal } = data;
  const priceSale = Number(listing.price_for_sales) || 0;
  const grandTotal = Number(apiTotal) || priceSale;

  const acompteMobile = 3000; // FCFA
  const resteEspece = grandTotal ;

  return (
    <>
      <div className="checkout-wrapper">
        <div className="checkout-right">
          <img src="/f.png" alt="Logo" className="logo" />
          <h1>Demande d'achat</h1>

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
                 {/* Sélection heure */}
        <div style={{ marginBottom: 30 }}>
          <label>Heure de visite souhaitée :</label><br />
          <select name="creneauArrivee"  style={{ padding: 10, borderRadius: 8, border: '1px solid #ccc', marginTop: 8 }}>
            <option value="">Sélectionner une heure</option>
            {[...Array(9)].map((_, i) => {
              const hour = 8 + i;
              return <option key={hour} value={hour}>{hour}h - {hour + 1}h</option>;
            })}
          </select>
        </div>
          </div>

          
       

          <div className="section">
            <div className="section-title">2. Paiement</div>
            <p>À payer maintenant via Mobile Money : <strong>{acompteMobile.toFixed(0)} FCFA</strong></p>
                <div className="section warning">
         <p>⚠️ Les 3 000 FCFA sont lié au transport allez-retour des agents la visite pour une durée de 1h est <strong> gratuite</strong> </p>
         </div>
          </div>

          <div className="section warning">
            <p>⚠️ <strong>Nom Mobile Money exact obligatoire :</strong> si le nom ne correspond pas, la demande sera rejetée.</p>
            <p>⚠️ Les 5 000 FCFA sont <u>non remboursables</u>, sauf en cas d’annulation par le propriétaire.</p>
            <p>⚠️ <strong>Ponctualité requise : tout retard de plus de 30min entrenera l'Annulation de votre rendez vous</strong> contactez-nous au <strong>065118634</strong> si vous constatez un un retard ou contacter l'agent à votre charge</p>
          </div>
        </div>

        <div className="checkout-left">
          <div
            className="summary-image"
            style={{ backgroundImage: `url(${mainImage})` }}
          />

          <div className="section">
            <div><strong>{listing.title}</strong></div>
            <small>{listing.address}</small>
            <p className="free-cancel">Retrait ou visite à convenir avec l’agent.</p>
          </div>

          <div className="section">
            <div className="section-title">Détail du prix</div>
            <div className="price-detail">
              <p>Prix de vente : {priceSale.toFixed(2)} FCFA</p>
              <hr />
              <p><strong>Total : {grandTotal.toFixed(2)} FCFA</strong></p>
            </div>
          </div>

          <div className="section">
            <button onClick={handleConfirm} className="btn-submit">Confirmer l'achat</button>
            <a href={`/listing/${listingId}`} className="cancel-link">Annuler</a>
          </div>
        </div>

        <LoginModal
          visible={loginVisible}
          onClose={closeLogin}
          onSwitch={() => { closeLogin(); openSignup(); }}
          onLoginSuccess={handleLoginSuccess}
        />
        <SignupModal
          visible={signupVisible}
          onClose={closeSignup}
          onSignupSuccess={handleSignupSuccess}
        />

        <BottomNav isLoggedIn={loggedIn} onLoginClick={openLogin} onSignupClick={openSignup} />
      </div>

      <footer className="footer">
        <p>© {new Date().getFullYear()} flexii. Tous droits réservés.</p>
      </footer>
    </>
  );
}
