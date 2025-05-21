import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import './Checkout.css';

function Checkout() {
  const { id, startDate, endDate } = useParams();
  const [listing, setListing] = useState(null);
  const [mainImage, setMainImage] = useState('');
  const [loading, setLoading] = useState(true);

  

  useEffect(() => {
    fetch(`http://localhost/flexii/api/checkout_cars.php?id=${id}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.listing) {
          setListing(data.listing);
          setMainImage(data.mainImage);
        } else {
          console.warn('Aucun vehicule trouvé pour cet ID :', id);
          setListing(null);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Erreur API checkout :', err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div style={{ padding: '20px' }}>Chargement...</div>;
  }

  if (!listing) {
    return <div style={{ padding: '20px' }}>Aucune annonce trouvée pour cet ID.</div>;
  }

  const start = new Date(startDate);
  const end = new Date(endDate);
  const nbNuits = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
  const totalPrice = nbNuits * listing.price_per_day;

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <div className="navbar-left">
            <img src="/f.png" alt="Oneko Logo" className="navbar-logo" />
            <span className="navbar-title">flexii</span>
          </div>
          <ul className="navbar-links">
            <li><Link to="/">Accueil</Link></li>
            <li><Link to="/bookings">Mes réservations</Link></li>
            <li><Link to="/messages">Messages</Link></li>
            <li><Link to="/profile">Profil</Link></li>
          </ul>
        </div>
      </nav>

      <div className="checkout-wrapper">
        <div className="checkout-left">
          <img src="/f.png" className="logo" alt="Oneko Logo" />
          <h1>Demande de réservation</h1>

          <div className="section">
            <div className="section-title">1. Choisissez quand vous souhaitez payer</div>
            <div className="payment-method">Payer {totalPrice.toFixed(2)} € maintenant</div>
            <div className="payment-method">
              Payer en 3 fois sans frais<br />
              <small>3 x {(totalPrice / 3).toFixed(2)} €</small>
            </div>
            <button type="button" className="btn-submit">Suivant</button>
            <Link to={`/Cars/${id}`} className="cancel-link">Annuler</Link>
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
            style={{ backgroundImage: `url(${mainImage || '/fallback-image.jpg'})` }}
          ></div>
          <div className="section">
            <div><strong>{listing.title}</strong></div>
            <small>{listing.address}</small>
            <p style={{ marginTop: '8px', color: 'green', fontSize: '14px' }}>
              Annulation gratuite jusqu'à 3 jours avant l'arrivée.
            </p>
          </div>

          <div className="section">
            <div className="section-title">Informations sur le voyage</div>
            <p>
              {start.getDate()}–{end.getDate()} {end.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
              <br />1 adulte
            </p>
          </div>

          <div className="section">
            <div className="section-title">Détail du prix</div>
            <div className="price-detail">
              <p>Prix : {listing.price_per_day.toFixed(2)} € x {nbNuits} jours</p>
              <p>Frais de ménage : 40,00 €</p>
              <p>Taxes : 8,50 €</p>
              <hr />
              <p><strong>Total : {(totalPrice + 48.5).toFixed(2)} €</strong></p>
            </div>
          </div>
        </div>
      </div>

      <footer className="footer">
        <p>© {new Date().getFullYear()} Oneko. Tous droits réservés.</p>
      </footer>
    </>
  );
}

export default Checkout;
