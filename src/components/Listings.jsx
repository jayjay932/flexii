import { useEffect, useState } from "react";
import ListingCard from "./ListingCard";
import "./card.css";

function Listings({ listings: externalListings, isLoggedIn, onLoginClick, reload, sortOption, onResetFilters }) {

  const [internalListings, setInternalListings] = useState([]);

  // Fetch les logements uniquement si on n'a pas reçu de listings filtrés
  useEffect(() => {
    if (externalListings) return;

    const url = new URL("http://localhost/flexii/api/listings.php");
    if (sortOption) {
      url.searchParams.append("sort", sortOption);
    }

    fetch(url, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Listings chargés par défaut :", data);
        setInternalListings(data);
      })
      .catch((err) => console.error("Erreur API :", err));
  }, [reload, sortOption, externalListings]);


  

  // Listings à afficher : filtrés ou ceux par défaut
  const listingsToRender =
  externalListings && externalListings.length > 0
    ? externalListings
    : internalListings;


  return (
    <div className="flexbox4">
 {externalListings && (
  <button
    style={{
      marginBottom: "20px",
      padding: "10px 20px",
      borderRadius: "25px",
      border: "none",
      backgroundColor: "#FF385C",
      color: "white",
      fontWeight: 600,
      cursor: "pointer"
    }}
    onClick={onResetFilters}
  >
    Réinitialiser les filtres
  </button>
)}


  {listingsToRender.length > 0 ? (
    <>
      <p style={{ width: "100%", fontWeight: 500, marginBottom: "10px" }}>
        {listingsToRender.length} résultat(s) trouvé(s)
      </p>
      {listingsToRender.map((listing) => (
         <ListingCard
         key={listing.id}
         listing={listing}
         isLoggedIn={isLoggedIn}
         onLoginClick={onLoginClick}
       />
      ))}
    </>
  ) : (
    <p style={{ width: "100%", textAlign: "center", color: "#999" }}>
      Aucun logement disponible pour ces critères, veullez recharger la page pour les logements .
    </p>
  )}
</div>

  );
}

export default Listings;
