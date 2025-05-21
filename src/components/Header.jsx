import './card.css';
import './filter.css';
import './searchbar.css';
import './imagegrid.css';
import './mobilemenu.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

function Header({ isLoggedIn, avatarUrl, onAvatarClick }) {
  return (
    <header className="combine">
      <div className="flexbox">
        <img src="flexii.png" className="icon1" alt="Logo" />

        <div className="flex1">
          <button className="but1">Logement</button>
          <button className="but1">Voiture</button>
          <button className="but2">Restauration</button>
        </div>

        <div className="flex2">
          <button className="but3">Airbnb your home</button>
          <button className="icon2"><i className="bi bi-globe"></i></button>
          <button
            className="f1 profile-button"
            id="profileButton"
            onClick={onAvatarClick}
            title={isLoggedIn ? 'Voir mon profil' : 'Se connecter'}
            aria-label={isLoggedIn ? 'Voir mon profil' : 'Se connecter'}
          >
            {isLoggedIn ? (
     <i className="bi bi-person-circle"></i>
            ) : (
              <i className="bi bi-person-circle"></i>
            )}
            <span className="profile-label">
              {isLoggedIn ? 'Mon profil' : 'Connexion'}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
