





function Head({ isLoggedIn, avatarUrl, onAvatarClick }) {
  return (
    <>
      {/* === NAVBAR DESKTOP === */}
      <header className="">
        <div className="flexbox">
        <img src="/flexii.png" className="icon1" alt="Logo" />


          <div className="flex1">
           <button className="but2" onClick={() => window.location.href = `/`}>
  Logements
</button>
   <button className="but2" onClick={() => window.location.href = `/vehicules`}>
Voiture
</button>
  <button className="but2" onClick={() => window.location.href = `/vehicules`}>
services
</button>


          </div>

          <div className="flex2">
            <button className="but3" onClick={() => window.location.href = `/dashboard_hote`}>
publier Une annonce
</button>
            <button className="icon2">
              <i className="bi bi-globe"></i>
            </button>
          
          </div><button
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
      </header>

    
    </>
  );
}

export default Head;
