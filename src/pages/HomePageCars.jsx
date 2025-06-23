import { useState, useEffect, useContext } from 'react';
import Bar from '../components/Bar';
import MobileMenu from '../components/MobileMenu';
import Header from '../components/Header';
import ProfileMenu from '../components/ProfileMenu';
import LoginModal from '../components/LoginModal';
import SignupModal from '../components/SignupModal';
import CategoryCars from '../components/CategoryCars';
import MobileSearchBar from '../components/MobileSearchBar';
import CarReservationModal from '../components/CarReservationModal';
import FilterPanelCar from '../components/FilterPanelCar';
import CarListings from '../components/CarListings';
import BottomNavCar from '../components/BottomNavCar';
import { AuthContext } from '../App';
import ProfileCars from '../components/ProfileCars';

export default function HomePageCars() {
  const { auth, setAuth } = useContext(AuthContext);
  const { loggedIn, user } = auth;

  const [loginVisible, setLoginVisible] = useState(false);
  const [signupVisible, setSignupVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [showReservation, setShowReservation] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [reloadCars, setReloadCars] = useState(false);

  const [sortOption, setSortOption] = useState('');
  const [searchText, setSearchText] = useState('');
  const [filteredCars, setFilteredCars] = useState(null);
  const [defaultCars, setDefaultCars] = useState([]);

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

  let filtered = list;

  // ✅ Filtrage avec vérification
  if (searchText.trim() !== '') {
    filtered = filtered.filter(item =>
      item.title && item.title.toLowerCase().includes(searchText.toLowerCase())
    );
  }

  switch (sortOption) {
    case 'price_low':
      return [...filtered].sort((a, b) => a.price_per_day - b.price_per_day);
    case 'price_high':
      return [...filtered].sort((a, b) => b.price_per_day - a.price_per_day);
    case 'newest':
      return [...filtered].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    default:
      return filtered;
  }
};


  return (
    <>
      <Bar />
      <MobileMenu
        isLoggedIn={loggedIn}
        avatarUrl={user?.avatar || '/flexii.png'}
        onAvatarClick={openMenu}
        onLoginClick={openLogin}
        onSignupClick={openSignup}
      />
      <Header
        isLoggedIn={loggedIn}
        avatarUrl={user?.avatar || '/flexii.png'}
        onAvatarClick={openMenu}
      />
      <ProfileCars
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

      {/* ✅ BARRE CATEGORIE + TRI + RECHERCHE */}
      <CategoryCars
        onSortChange={setSortOption}
        onOpenFilters={() => setShowFilters(true)}
        searchText={searchText}
        onSearchChange={setSearchText}
      />

      <MobileSearchBar onClick={() => setShowReservation(true)} />

      <CarReservationModal
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

      <BottomNavCar
        isLoggedIn={loggedIn}
        onLoginClick={openLogin}
        onSignupClick={openSignup}
        onOpenFilters={() => setShowFilters(true)}
      />
    </>
  );
}
