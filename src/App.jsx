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
       <Route path="/dashboard_hote"   element={<DashboardHote />} />
     <Route path="/confirmation"   element={<ConfirmationLogement />} />
     <Route path="/host_profile"   element={<HostProfileForm />} />
           
              
        <Route path="/afficher_commentaires/:id" element={<AfficherCommentaires />} />
        <Route path="/checkout"                element={<CheckoutPage />} />
        <Route path="/checkout_cars"                element={<CheckoutCars />} />

        <Route path="/vehicules" element={<HomePageCars />} />
      </Routes>
    </AuthContext.Provider>
  );
}

export default App;
