import React, { useState, useEffect, useContext, useMemo } from 'react';
import { useSearchParams, useNavigate, useParams, useLocation } from 'react-router-dom';
import './CheckoutPage.css';
import BottomNav from '../components/BottomNav';
import LoginModal from '../components/LoginModal';
import SignupModal from '../components/SignupModal';
import ProfileMenu from '../components/ProfileMenu';
import Head from '../components/Head';
import { AuthContext } from '../App';

export default function FormulaireAchat() {
  const [searchParams] = useSearchParams();
  const listingId = searchParams.get('id');
  const navigate = useNavigate();
  const { auth, setAuth } = useContext(AuthContext);
  const { loggedIn, user } = auth;
  const { id } = useParams();
  const location = useLocation();
  const initialListing = location.state?.listing || null;

  const [listingData, setListingData] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [agents, setAgents] = useState([]);
  const [selectedAgentId, setSelectedAgentId] = useState('');
  const [availabilities, setAvailabilities] = useState([]);
  const [loadingAvailabilities, setLoadingAvailabilities] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');

  const [formValues, setFormValues] = useState({
    nom: '',
    numeroMobile: '',
    numeroExpediteur: '',
    nomMobile: '',
    codeAgent: '',
    creneauArrivee: '',
    dateVisite: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues(prev => ({ ...prev, [name]: value }));

    if (name === 'dateVisite') {
      setSelectedDate(value);
      setFormValues(prev => ({ ...prev, creneauArrivee: '' }));
    }
  };

  const fetchAgents = async () => {
    try {
      const res = await fetch('http://localhost/flexii/api/get_agents.php');
      const json = await res.json();
      if (json.success) setAgents(json.agents);
    } catch (err) {
      console.error('Erreur chargement agents', err);
    }
  };

  useEffect(() => { fetchAgents(); }, []);

 useEffect(() => {
  if (!selectedAgentId) return;
  setLoadingAvailabilities(true);

  fetch(`http://localhost/flexii/api/agent_availabilities.php?agent_id=${selectedAgentId}`)
    .then(res => res.json())
    .then(json => {
      console.log("📅 DISPONIBILITÉS REÇUES :", json.availabilities); // 👈 déplace ici
      setAvailabilities(json.availabilities || []);
    })
    .catch(err => console.error(err))
    .finally(() => setLoadingAvailabilities(false));
}, [selectedAgentId]);




  const getAvailableSlots = (date) => {
    const dateAvailabilities = availabilities.filter(avail => avail.date === date && String(avail.is_available) === '1');
    if (dateAvailabilities.length === 0) {
      const defaultSlots = [];
      for (let h = 9; h < 18; h++) {
        defaultSlots.push(`${h}:00`);
      }
      return defaultSlots;
    }
    const slots = [];
    dateAvailabilities.forEach(avail => {
      if (avail.heure_arrivee && avail.heure_fin) {
        const startHour = parseInt(avail.heure_arrivee.split(':')[0]);
        const endHour = parseInt(avail.heure_fin.split(':')[0]);
        for (let h = startHour; h < endHour; h++) {
          slots.push(`${h}:00`);
        }
      }
    });
    return [...new Set(slots)].sort();
  };
 const isDateAvailable = (date) => {
  const match = availabilities.filter(avail => avail.date === date);
  if (match.length === 0) return true; // pas d’entrée → pas dispo
  return match.some(avail => parseInt(avail.is_available) === 1);
};

const getAvailableDates = () => {
  const dates = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0); // ✅ force 00:00:00

  for (let i = 1; i <= 30; i++) {
    const date = new Date(today.getTime());
    date.setDate(date.getDate() + i);

    const dateStr = date.toISOString().split('T')[0];

    if (isDateAvailable(dateStr)) {
      dates.push({
        value: dateStr,
        label: date.toLocaleDateString('fr-FR', {
          weekday: 'short',
          day: 'numeric',
          month: 'short'
        })
      });
    }
  }

 

  console.log("🧪 Dates disponibles filtrées :", dates);
  return dates;
};


  const availableDates = useMemo(() => getAvailableDates(), [availabilities]);
  const availableSlots = getAvailableSlots(selectedDate);

  useEffect(() => {
    if (!listingId) {
      setError("Paramètre \"id\" manquant dans l'URL.");
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

  const handleLoginSuccess = (userData) => {
    setAuth({ loggedIn: true, user: userData, loading: false });
    setLoginVisible(false);
  };

  const handleSignupSuccess = (userData) => {
    setAuth({ loggedIn: true, user: userData, loading: false });
    setSignupVisible(false);
  };

  const handleConfirm = async () => {
    setError(null);
    setIsSubmitting(true);
    try {
      if (formValues.codeAgent?.trim()) {
        const res = await fetch(`http://localhost/flexii/api/verify_agent.php?code=${formValues.codeAgent}`);
        const json = await res.json();
        if (!json.exists) throw new Error("Code agent invalide.");
      }
      const res = await fetch('http://localhost/flexii/api/checkout_vente.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          id: listingId,
          ...formValues,
          type: 'achat',
        }),
      });
      const json = await res.json();
      if (!res.ok || json.error) throw new Error(json.error || "Erreur serveur");
      navigate(`/recap-reservation-vente/${json.booking_id}`);
    } catch (err) {
      setError(err.message);
      setIsSubmitting(false);
    }
  };

  const [loginVisible, setLoginVisible] = useState(false);
  const [signupVisible, setSignupVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);

  const openLogin = () => setLoginVisible(true);
  const closeLogin = () => setLoginVisible(false);
  const openSignup = () => setSignupVisible(true);
  const closeSignup = () => setSignupVisible(false);
  const toggleMenu = () => setMenuVisible(v => !v);
  const onAvatarClick = () => { loggedIn ? toggleMenu() : openLogin(); };

  if (loading) return <p>Chargement…</p>;
  if (error) return <p className="error">{error}</p>;
  if (!data?.listing) return <p>Aucune annonce trouvée.</p>;

  const { listing, mainImage, totalPrice: apiTotal } = data;
  const priceSale = Number(listing.price_for_sale) || 0;
  const grandTotal = Number(apiTotal) || priceSale;
  const acompteMobile = 3000;

  return (
    <>
      {isSubmitting && (
        <div className="overlay-loading">
          <div className="loader" />
          <p>Finalisation de votre demande…</p>
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
          <h1>Demande d'achat</h1>

          <div className="section">
            <div className="section-title">1. Informations client</div>
            <label>Nom complet expéditeur</label>
            <input type="text" name="nom" value={formValues.nom} onChange={handleChange} required />

            <label>Numéro Mobile Money</label>
            <input type="text" name="numeroMobile" value={formValues.numeroMobile} onChange={handleChange} required />

            <label>Numéro expéditeur</label>
            <input type="text" name="numeroExpediteur" value={formValues.numeroExpediteur} onChange={handleChange} required />

            <label>Nom titulaire Mobile Money</label>
            <input type="text" name="nomMobile" value={formValues.nomMobile} onChange={handleChange} required />

            <div className="section warning">
              <p>⚠️ <strong>Nom Mobile Money exact obligatoire :</strong> si le nom ne correspond pas, la demande sera rejetée.</p>
            </div>

            <label>Sélectionnez un agent :</label>
            <select value={selectedAgentId} onChange={(e) => {
              setSelectedAgentId(e.target.value);
              setSelectedDate('');
              setFormValues(prev => ({ ...prev, dateVisite: '', creneauArrivee: '' }));
            }}>
              <option value="">-- Choisir un agent --</option>
              {agents.map(agent => <option key={agent.id} value={agent.id}>{agent.full_name}</option>)}
            </select>

            <div style={{ marginBottom: 30 }}>
              <label>Date de visite souhaitée :</label><br />
              {loadingAvailabilities ? (
                <p>Chargement des disponibilités...</p>
              ) : (
                <select name="dateVisite" value={formValues.dateVisite} onChange={handleChange} required>
                  <option value="">Sélectionner une date disponible</option>
                  {availableDates.map(date => (
                    <option key={date.value} value={date.value}>{date.label}</option>
                  ))}
                </select>
              )}
              {availableDates.length === 0 && !loadingAvailabilities && (
                <p style={{ color: 'orange', fontSize: '14px' }}>
                  ⚠️ Aucune date disponible pour le moment. Veuillez réessayer plus tard.
                </p>
              )}
            </div>

            <div style={{ marginBottom: 30 }}>
              <label>Heure de visite souhaitée :</label><br />
              <select
                name="creneauArrivee"
                value={formValues.creneauArrivee}
                onChange={handleChange}
                required
                disabled={!selectedDate}
              >
                <option value="">
                  {!selectedDate ? 'Sélectionnez d\'abord une date' : 'Choisir un créneau'}
                </option>
                {availableSlots.map(slot => (
                  <option key={slot} value={slot}>
                    {slot.replace(':', 'h')} - {(parseInt(slot.split(':')[0]) + 1)}h
                  </option>
                ))}
              </select>

              {selectedDate && availableSlots.length === 0 && (
                <p style={{ color: 'orange', fontSize: '14px' }}>
                  ⚠️ Aucun créneau disponible pour cette date.
                </p>
              )}

              <div className="section warning">
                <p>⚠️ <strong>Ponctualité requise :</strong> tout retard de plus de 30 min entraînera une annulation.</p>
              </div>
            </div>
          </div>

          <div className="section">
            <div className="section-title">2. Paiement</div>
            <p>À payer maintenant via Mobile Money : <strong>{acompteMobile.toFixed(0)} FCFA</strong></p>
            <div className="section warning">
              <p>⚠️ Les 3 000 FCFA sont liés au transport aller-retour des agents. La visite (1h) est <strong>gratuite</strong>.</p>
            </div>
          </div>
        </div>

        <div className="checkout-left">
          <div className="summary-image" style={{ backgroundImage: `url(${mainImage})` }} />
          <div className="section">
            <div><strong>{listing.title}</strong></div>
            <small>{listing.address}</small>
            <p className="free-cancel">Retrait ou visite à convenir avec l'agent.</p>
          </div>

          <div className="section">
            <div className="section-title">Détail du prix</div>
            <p>Prix de vente : {priceSale} FCFA</p>
            <hr />
            <p><strong>Total : {grandTotal} FCFA</strong></p>
            <p>À payer maintenant via Mobile Money : <strong>{acompteMobile} FCFA</strong></p>
          </div>

          <div className="section">
            <button
              onClick={handleConfirm}
              className="btn-submit"
              disabled={!formValues.dateVisite || !formValues.creneauArrivee}
            >
              Confirmer l'achat
            </button>
            <a href={`/listing/${listingId}`} className="cancel-link">Annuler</a>
          </div>

          <div className="section warning">
            <p><strong>⚠️ Avant de valider, vérifiez que les informations sont correctes et que vous avez bien envoyé l'argent</strong>.</p>
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
