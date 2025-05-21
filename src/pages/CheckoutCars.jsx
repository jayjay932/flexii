// src/pages/CheckoutPage.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import './CheckoutPage.css';
import BottomNav from '../components/BottomNav';
import LoginModal from '../components/LoginModal';
import SignupModal from '../components/SignupModal';
import { AuthContext } from '../App';

export default function CheckoutPage() {
  const [searchParams] = useSearchParams();
  const listingId = searchParams.get('id');
  const startDate = searchParams.get('start_date');
  const endDate = searchParams.get('end_date');
  const navigate = useNavigate();

  // Auth context
  const { auth, setAuth } = useContext(AuthContext);
  const { loggedIn, user } = auth;

  // UI state for auth modals
  const [loginVisible, setLoginVisible] = useState(false);
  const [signupVisible, setSignupVisible] = useState(false);
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

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Charger les infos du checkout
  useEffect(() => {
    if (!listingId || !startDate || !endDate) {
      setError('Paramètres manquants dans l’URL.');
      setLoading(false);
      return;
    }

    fetch(
      `http://localhost/flexii/api/checkout_info_cars.php?id=${listingId}&start_date=${startDate}&end_date=${endDate}`,
      { credentials: 'include' }
    )
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
  }, [listingId, startDate, endDate]);

  const handleConfirm = () => {
    setError(null);
    fetch('http://localhost/flexii/api/checkout_cars.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ id: listingId, start_date: startDate, end_date: endDate }),
    })
      .then(res => {
        if (!res.ok) throw new Error('Impossible de créer la réservation.');
        return res.json();
      })
      .then(json => {
        if (json.error) throw new Error(json.error);
        navigate(`/vehicules/${listingId}?success=1`);
      })
      .catch(err => setError(err.message));
  };

  if (loading) return <p>Chargement…</p>;
  if (error) return <p className="error">{error}</p>;

  const { listing, mainImage, nbNuits = 0, totalPrice: apiTotal } = data;
  const priceNight = Number(listing.price_per_night) || 0;
  const totalRaw = Number(apiTotal) || priceNight * nbNuits;
  const cleaningFee = 40;
  const taxes = 8.5;
  const grandTotal = totalRaw + cleaningFee + taxes;

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <div className="navbar-left">
            <img src="/f.png" alt="Logo" className="navbar-logo" />
            <span className="navbar-title">flexii</span>
          </div>
          <ul className="navbar-links">
            <li><a href="/">Accueil</a></li>
            <li><a href="/bookings">Mes réservations</a></li>
            <li><a href="/messages">Messages</a></li>
            <li><a href="/profile">Profil</a></li>
          </ul>
        </div>
      </nav>

      <div className="checkout-wrapper">
        <div className="checkout-left">
          <img src="/f.png" alt="Logo" className="logo" />
          <h1>Demande de réservation</h1>

          <div className="section">
            <div className="section-title">1. Choisissez quand vous souhaitez payer</div>
            <div className="payment-method">Payer {totalRaw.toFixed(2)} € maintenant</div>
            <div className="payment-method">
              Payer en 3 fois sans frais<br />
              <small>3 x {(totalRaw / 3).toFixed(2)} €</small>
            </div>
            <button onClick={handleConfirm} className="btn-submit">Suivant</button>
            <a href={`/cars_details/${listingId}`} className="cancel-link">Annuler</a>
          </div>

          <div className="section">
            <div className="section-title">2. Ajoutez un mode de paiement</div>
            <div className="payment-method">Carte Visa / Mastercard</div>
            <div className="payment-method">PayPal</div>
          </div>

          <div className="section">
            <div className="section-title">3. Vérifiez votre demande</div>
            <p>Vous serez prélevé uniquement si votre demande est acceptée par l'hôte.</p>
          </div>
        </div>
  
        <div className="checkout-right">
          <div
            className="summary-image"
            style={{ backgroundImage: `url(${mainImage})` }}
          />

          <div className="section">
            <div><strong>{listing.title}</strong></div>
            <small>{listing.address}</small>
            <p className="free-cancel">Annulation gratuite jusqu'à 3 jours avant l'arrivée.</p>
          </div>

          <div className="section">
            <div className="section-title">Informations sur le voyage</div>
            <p>
              {new Date(startDate).getDate()}–{new Date(endDate).getDate()}{' '}
              {new Date(endDate).toLocaleString('fr-FR', { month: 'long', year: 'numeric' })}
              <br />1 adulte
            </p>
          </div>

          <div className="section">
            <div className="section-title">Détail du prix</div>
            <div className="price-detail">
              <p>Prix : {priceNight.toFixed(2)} € x {nbNuits} nuit(s)</p>
              <p>Frais de ménage : {cleaningFee.toFixed(2)} €</p>
              <p>Taxes : {taxes.toFixed(2)} €</p>
              <hr />
              <p><strong>Total : {grandTotal.toFixed(2)} €</strong></p>
            </div>
          </div>
        </div>

     
         
        

        {/* Modales connexion */}
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

        {/* Bottom Nav */}
        <BottomNav isLoggedIn={loggedIn} onLoginClick={openLogin} onSignupClick={openSignup} />
      </div>

      <footer className="footer">
        <p>© {new Date().getFullYear()} flexii. Tous droits réservés.</p>
      </footer>
    </>
  );
}