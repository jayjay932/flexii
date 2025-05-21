// src/pages/HomePage.jsx
import React, { useState, useEffect, useContext } from 'react';
import Bar from '../components/Bar';
import MobileMenu from '../components/MobileMenu';
import Header from '../components/Header';
import ProfileMenu from '../components/ProfileMenu';
import LoginModal from '../components/LoginModal';
import SignupModal from '../components/SignupModal';
import CategoryBar from '../components/categorybar';
import MobileSearchBar from '../components/MobileSearchBar';
import ReservationModal from '../components/ReservationModal';
import Listings from '../components/Listings';
import BottomNav from '../components/BottomNav';
import FilterPanel from '../components/FilterPanel';
import { AuthContext } from '../App';

export default function HomePage() {
  // Auth context
  const { auth, setAuth } = useContext(AuthContext);
  const { loggedIn, user } = auth;

  // UI state
  const [loginVisible, setLoginVisible] = useState(false);
  const [signupVisible, setSignupVisible] = useState(false);
  const [showReservation, setShowReservation] = useState(false);
  const [reloadListings, setReloadListings] = useState(false);
  const [sortOption, setSortOption] = useState('');
  const [filteredListings, setFilteredListings] = useState(null);
  const [defaultListings, setDefaultListings] = useState([]);
  // Profile menu visibility
  const [menuVisible, setMenuVisible] = useState(false);
  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  // Auth modal handlers
  const openLogin = () => setLoginVisible(true);
  const closeLogin = () => setLoginVisible(false);
  const openSignup = () => setSignupVisible(true);
  const closeSignup = () => setSignupVisible(false);



  const [showFilters, setShowFilters] = useState(false);

  const handleLoginSuccess = (userData) => {
    setAuth({ loggedIn: true, user: userData, loading: false });
    closeLogin();
    setReloadListings(r => !r);
  };

  const handleSignupSuccess = (userData) => {
    setAuth({ loggedIn: true, user: userData, loading: false });
    closeSignup();
    setReloadListings(r => !r);
  };

  // Fetch listings
  useEffect(() => {
    fetch('http://localhost/flexii/api/listings.php', { credentials: 'include' })
      .then(res => res.json())
      .then(data => setDefaultListings(data));
  }, [reloadListings]);

  // Sort/filter
  const applySort = (list) => {
    if (!list) return [];
    switch (sortOption) {
      case 'price_low': return [...list].sort((a, b) => a.price_per_night - b.price_per_night);
      case 'price_high': return [...list].sort((a, b) => b.price_per_night - a.price_per_night);
      case 'newest': return [...list].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      default: return list;
    }
  };

  return (
    <>
      <Bar />
      <MobileMenu />
      <Header
        isLoggedIn={loggedIn}
        avatarUrl={user?.avatar || '/flexii.png'}
        onAvatarClick={openMenu}
      />
      <ProfileMenu
        isLoggedIn={loggedIn}
        onLoginClick={openLogin}
        onSignupClick={openSignup}
        visible={menuVisible}
        onClose={closeMenu}
      />

      <LoginModal
        visible={loginVisible}
        onClose={closeLogin}
        onSwitch={() => { closeLogin(); openSignup(); }}
        onLoginSuccess={handleLoginSuccess}
      />

      <SignupModal
        visible={signupVisible}
        onClose={closeSignup}
        onSwitch={() => { closeSignup(); openLogin(); }}
        onSignupSuccess={handleSignupSuccess}
      />
<CategoryBar
  onSortChange={setSortOption}
  onOpenFilters={() => setShowFilters(true)} // 👈 C’est ce qui manquait
/>

      <MobileSearchBar onClick={() => setShowReservation(true)} />
      <ReservationModal
        visible={showReservation}
        onClose={() => setShowReservation(false)}
        onResults={setFilteredListings}
      />
{showFilters && (
  <FilterPanel
    onApply={(data) => {
      setFilteredListings(data);
      setShowFilters(false);
    }}
    onClose={() => setShowFilters(false)}
  />
)}



<Listings
  listings={applySort(filteredListings || defaultListings)}
  isLoggedIn={loggedIn}
  onLoginClick={openLogin}
  reload={reloadListings}
  sortOption={sortOption}
  onResetFilters={() => setFilteredListings(null)}
/>


      <BottomNav
        isLoggedIn={loggedIn}
        onLoginClick={openLogin}
        onSignupClick={openSignup}
          onOpenFilters={() => setShowFilters(true)} // ← ajouter cette ligne
      />


    </>
  );
}