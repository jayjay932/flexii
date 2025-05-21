function EquipmentList({ listing }) {
    return (
      <div className="equipment-list">
        <ul>
          <li>WiFi: {listing.has_wifi ? 'Oui' : 'Non'}</li>
          <li>Parking: {listing.has_parking ? 'Oui' : 'Non'}</li>
          <li>Cuisine: {listing.has_kitchen ? 'Oui' : 'Non'}</li>
          <li>Adresse: {listing.address}</li>
        </ul>
      </div>
    );
  }
  
  export default EquipmentList;
  