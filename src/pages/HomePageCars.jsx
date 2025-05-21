import { useState, useEffect, useContext } from 'react';
import Bar from '../components/Bar';
import MobileMenu from '../components/MobileMenu';
import Header from '../components/Header';
import ProfileMenu from '../components/ProfileMenu';
import LoginModal from '../components/LoginModal';
import SignupModal from '../components/SignupModal';
import CategoryBar from '../components/categorybar';
import MobileSearchBar from '../components/MobileSearchBar';
import ReservationModal from '../components/ReservationModal';
import FilterPanelCar from '../components/FilterPanelCar';
import CarListings from '../components/CarListings';
import BottomNav from '../components/BottomNav';
import { AuthContext } from '../App';

export default function HomePageCars() {
  const { auth, setAuth } = useContext(AuthContext);
  const { loggedIn, user } = auth;

  const [loginVisible, setLoginVisible] = useState(false);
  const [signupVisible, setSignupVisible] = useState(false);
  const [showReservation, setShowReservation] = useState(false);
  const [reloadCars, setReloadCars] = useState(false);
  const [sortOption, setSortOption] = useState('');
  const [filteredCars, setFilteredCars] = useState(null);
  const [defaultCars, setDefaultCars] = useState([]);
  const [menuVisible, setMenuVisible] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);
  const openLogin = () => setLoginVisible(true);
  const closeLogin = () => setLoginVisible(false);
  const openSignup = () => setSignupVisible(true);
  const closeSignup = () => setSignupVisible(false);

  const handleLoginSuccess = (userData) => {
    setAuth({ loggedIn: true, user: userData, loading: false });
    closeLogin();
    setReloadCars(r => !r);
  };

  const handleSignupSuccess = (userData) => {
    setAuth({ loggedIn: true, user: userData, loading: false });
    closeSignup();
    setReloadCars(r => !r);
  };

  useEffect(() => {
    fetch('http://localhost/flexii/api/cars.php', { credentials: 'include' })
      .then(res => res.json())
      .then(data => setDefaultCars(data));
  }, [reloadCars]);

  const applySort = (list) => {
    if (!list) return [];
    switch (sortOption) {
      case 'price_low': return [...list].sort((a, b) => a.price_per_day - b.price_per_day);
      case 'price_high': return [...list].sort((a, b) => b.price_per_day - a.price_per_day);
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
        onOpenFilters={() => setShowFilters(true)}
      />

      <MobileSearchBar onClick={() => setShowReservation(true)} />

      <ReservationModal
        visible={showReservation}
        onClose={() => setShowReservation(false)}
        onResults={setFilteredCars}
      />

      {showFilters && (
        <FilterPanelCar
          onApply={(data) => {
            setFilteredCars(data);
            setShowFilters(false);
          }}
          onClose={() => setShowFilters(false)}
        />
      )}

      <CarListings
        listings={applySort(filteredCars || defaultCars)}
        isLoggedIn={loggedIn}
        onLoginClick={openLogin}
        reload={reloadCars}
        sortOption={sortOption}
        onResetFilters={() => setFilteredCars(null)}
      />

      <BottomNav
        isLoggedIn={loggedIn}
        onLoginClick={openLogin}
        onSignupClick={openSignup}
        onOpenFilters={() => setShowFilters(true)}
      />
    </>
  );
}
