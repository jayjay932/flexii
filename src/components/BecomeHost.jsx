import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function BecomeHost() {
  const [selectedOption, setSelectedOption] = useState(null);
  const navigate = useNavigate();

  const options = [
    { label: 'Logement', emoji: '🏠', value: 'logement' },
    { label: 'Véhicule', emoji: '🚗', value: 'vehicule' },
    { label: 'Service', emoji: '🛎️', value: 'service' },
  ];

  const handleNext = () => {
    if (!selectedOption) return;

    // Redirection selon l'option choisie
    switch (selectedOption) {
      case 'logement':
        navigate('/new-logement-etape1');
        break;
      case 'vehicule':
        navigate('/new-vehicule');
        break;
      case 'service':
        navigate('/new-service');
        break;
      default:
        break;
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Que souhaitez-vous proposer ?</h2>

      <div style={styles.cardsContainer}>
        {options.map((opt) => (
          <div
            key={opt.value}
            style={{
              ...styles.card,
              border: selectedOption === opt.value ? '2px solid black' : '1px solid #ddd',
            }}
            onClick={() => setSelectedOption(opt.value)}
          >
            <div style={styles.emoji}>{opt.emoji}</div>
            <div style={styles.label}>{opt.label}</div>
          </div>
        ))}
      </div>

      <button
        onClick={handleNext}
        style={{
          ...styles.button,
          backgroundColor: selectedOption ? 'black' : '#aaa',
          cursor: selectedOption ? 'pointer' : 'not-allowed',
        }}
        disabled={!selectedOption}
      >
        Suivant
      </button>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 800,
    margin: '0 auto',
    padding: '40px 20px',
    textAlign: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 40,
  },
  cardsContainer: {
    display: 'flex',
    gap: 20,
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  card: {
    width: 160,
    height: 160,
    borderRadius: 12,
    border: '1px solid #ccc',
    backgroundColor: 'white',
    boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
  },
  emoji: {
    fontSize: 48,
    marginBottom: 10,
  },
  label: {
    fontSize: 18,
    fontWeight: 500,
  },
  button: {
    marginTop: 40,
    padding: '12px 24px',
    fontSize: 16,
    borderRadius: 8,
    border: 'none',
    color: 'white',
  },
};

export default BecomeHost;
