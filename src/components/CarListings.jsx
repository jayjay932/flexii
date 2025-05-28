import { useEffect, useState } from "react";
import CarCard from "./CarCard";
import "./card.css";

function CarListings({ listings: externalListings, isLoggedIn, onLoginClick, reload, sortOption, onResetFilters }) {
  const [internalListings, setInternalListings] = useState([]);

  useEffect(() => {
    if (externalListings) return;

    const url = new URL("http://localhost/flexii/api/cars.php");
    if (sortOption) url.searchParams.append("sort", sortOption);

    fetch(url, { credentials: "include" })
      .then((res) => res.json())
      .then(setInternalListings)
      .catch((err) => console.error("Erreur API :", err));
  }, [reload, sortOption, externalListings]);

  const listingsToRender = externalListings?.length ? externalListings : internalListings;

 

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
            {listingsToRender.length} véhicule(s) trouvé(s)
          </p>
          {listingsToRender.map((car) => (
            <CarCard
              key={car.id}
              car={car}
              isLoggedIn={isLoggedIn}
              onLoginClick={onLoginClick}
            />
          ))}
        </>
      ) : (
        <p style={{ width: "100%", textAlign: "center", color: "#999" }}>
          Aucun véhicule disponible.
        </p>
      )}
    </div>
  );
}

export default CarListings;
