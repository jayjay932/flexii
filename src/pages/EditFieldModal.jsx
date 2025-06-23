import React, { useState } from 'react';

export default function EditFieldModal({ field, currentValue, onSave, onClose }) {
  // Ajoute tous les champs qui sont des fichiers :
  const isFileField = field === 'avatar_url' || field === 'id_url' || field === 'avatar' || field === 'identity';

  const [textValue, setTextValue] = useState(currentValue || '');
  const [fileValue, setFileValue] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isFileField) {
      if (!fileValue) {
        alert("Veuillez choisir un fichier.");
        return;
      }
      onSave(field, fileValue); // fichier envoyé
    } else {
      onSave(field, textValue.trim()); // texte envoyé
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Modifier {field.replace('_url', '').replace('_', ' ')}</h2>

        <form onSubmit={handleSubmit}>
          {isFileField ? (
            <input
              type="file"
              accept="image/*,application/pdf"
              onChange={(e) => setFileValue(e.target.files[0])}
              required
            />
          ) : (
            <input
              type="text"
              value={textValue}
              onChange={(e) => setTextValue(e.target.value)}
              required
            />
          )}

          <div className="modal-buttons">
            <button type="submit" className="submit-button">Enregistrer</button>
            <button type="button" onClick={onClose} className="cancel-button">Annuler</button>
          </div>
        </form>
      </div>
    </div>
  );
}
