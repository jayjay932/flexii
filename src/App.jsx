// src/App.jsx
import React, { useState, useEffect, createContext } from 'react';
import { Routes, Route } from 'react-router-dom';

import HomePage             from './pages/HomePage.jsx';
import ListingDetails       from './pages/ListingDetails.jsx';

import CarsDetails       from './pages/CarsDetails.jsx';
import AfficherCommentaires from './components/AfficherCommentaires.jsx';
import CheckoutPage         from './pages/CheckoutPage.jsx';
import CheckoutCars         from './pages/CheckoutCars.jsx';
import HomePageCars from './pages/HomePageCars.jsx';
  
import './styles/card.css';
import './styles/filter.css';
import './styles/searchbar.css';
import './styles/mobilemenu.css';





import '@fortawesome/fontawesome-free/css/all.min.css';

import NewLogementEtape1 from './pages/NewLogementEtape1.jsx';
import NewLogementEtape2 from './pages/NewLogementEtape2.jsx';
import NewLogementEtape4 from './pages/NewLogementEtape4.jsx';
import NewLogementEtape5 from './pages/NewLogementEtape5.jsx';
import NewLogementEtape6 from './pages/NewLogementEtape6.jsx';
import NewLogementEtape7 from './pages/NewLogementEtape7.jsx';
import Etape3 from './pages/Etape3.jsx';
import ConfirmationLogement from './pages/ConfirmationLogement.jsx';
import DashboardHote from './pages/DashboardHote.jsx';
import HostProfileForm from './pages/HostProfileForm.jsx';
import NewCarEtape1 from './pages/NewCarEtape1.jsx';
import NewCarEtape2 from './pages/NewCarEtape2.jsx';
import NewCarEtape3 from './pages/NewCarEtape3.jsx';
import NewCarEtape4 from './pages/NewCarEtape4.jsx';
import NewCarEtape5 from './pages/NewCarEtape5.jsx';
import NewCarEtape6 from './pages/NewCarEtape6.jsx';
import NewCarEtape7 from './pages/NewCarEtape7.jsx';
import NewCarConfirmation from './pages/NewCarConfirmation.jsx';
import BecomeHost from './components/BecomeHost.jsx';

import SetAvailabilityPage from './pages/SetAvailabilityPage.jsx'; // <- OK si le fichier est bien là
import EditListing from './pages/EditListing.jsx';
import ModifierLogement from './pages/ModifierLogement.jsx';
import Favoris from './pages/Favoris.jsx';
import UserProfile from './pages/UserProfile.jsx';
import AffichageHost from './pages/AffichageHost.jsx';
import UserBooking from './pages/UserBooking.jsx';
import NoterLogement from './pages/NoterLogement.jsx';
import CommentairesLogement from './pages/CommentairesLogement.jsx';
import HostReservedListings from './pages/HostReservedListings.jsx';
import BookingsLogements from './pages/BookingsLogements.jsx';
import Messagerie from './pages/Messagerie.jsx';
// Contexte d’auth: on expose un objet { auth, setAuth }
export const AuthContext = createContext({
  auth:    { loggedIn: false, user: null, loading: false },
  setAuth: () => {}
});

function App() {
  const [auth, setAuth] = useState({
    loggedIn: false,
    user:     null,
    loading:  true
  });

  useEffect(() => {
    fetch('http://localhost/flexii/api/check_session.php', {
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => {
        if (data.loggedIn) {
          setAuth({ loggedIn: true,  user: data.user, loading: false });
        } else {
          setAuth({ loggedIn: false, user: null,     loading: false });
        }
      })
      .catch(() => {
        setAuth({ loggedIn: false, user: null, loading: false });
      });
  }, []);

  // Pendant qu’on attend la réponse du backend
  if (auth.loading) {
    return <div>Vérification de la session…</div>;
  }

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      <Routes>
        <Route path="/"                        element={<HomePage />} />
        <Route path="/listing/:id"             element={<ListingDetails />} />
        <Route path="/cars_details/:id" element={<CarsDetails />} />
        
     <Route path="/new-logement-etape1"   element={<NewLogementEtape1 />} />
     <Route path="/new-logement-etape2"   element={<NewLogementEtape2 />} />
      <Route path="/new-logement-etape3"   element={<Etape3 />} />
      <Route path="/new-logement-etape4"   element={<NewLogementEtape4 />} />
      <Route path="/new-logement-etape5"   element={<NewLogementEtape5 />} />
      <Route path="/new-logement-etape6"   element={<NewLogementEtape6 />} />
      <Route path="/new-logement-etape7"   element={<NewLogementEtape7 />} />
      <Route path="/new-car-etape1"   element={<NewCarEtape1 />} />
      <Route path="/new-car-etape2"   element={<NewCarEtape2 />} />
      <Route path="/new-car-etape3"   element={<NewCarEtape3 />} />
      <Route path="/new-car-etape4"   element={<NewCarEtape4 />} />
      <Route path="/new-car-etape5"   element={<NewCarEtape5 />} />
      <Route path="/new-car-etape6"   element={<NewCarEtape6 />} />   
      <Route path="/new-car-etape7"   element={<NewCarEtape7 />} />
      <Route path="/new-car-confirmation"   element={<NewCarConfirmation />} /> 
      
       <Route path="/dashboard_hote"   element={<DashboardHote />} />
     <Route path="/confirmation"   element={<ConfirmationLogement />} />
     <Route path="/host_profile"   element={<HostProfileForm />} />
           
              
        <Route path="/afficher_commentaires/:id" element={<AfficherCommentaires />} />
        <Route path="/checkout"                element={<CheckoutPage />} />
        <Route path="/checkout_cars"                element={<CheckoutCars />} />

        <Route path="/vehicules" element={<HomePageCars />} />
        <Route path="/set-availability" element={<SetAvailabilityPage />} />
        <Route path="/edit-listing" element={<EditListing />} />
        <Route path="/modifier-logement/:id" element={<ModifierLogement />} />
        <Route path="/favoris" element={<Favoris />} />
  <Route path="/become_host" element={< BecomeHost/>} />
  <Route path="/user-profile" element={<UserProfile />} />
  <Route path="/affichage-host" element={<AffichageHost />} />
  <Route path="/user-booking" element={<UserBooking />} />
       <Route path="/noter-logement/:id" element={<NoterLogement />} />
        <Route path="/host-reserved-listings" element={<HostReservedListings />} />
       <Route path="/comment-host" element={<BookingsLogements />} />
       <Route path="/messagerie/:booking_id" element={<Messagerie />} />



       <Route path="/commentaires-logement/:id" element={<CommentairesLogement />} />           

        {/* Routes pour les voitures */}
     
      </Routes>
    </AuthContext.Provider>
  );
}

export default App;
