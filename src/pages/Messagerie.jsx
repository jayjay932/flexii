import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function Messagerie() {
  const { booking_id } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState('');
  const senderId = 1; // à adapter selon l'utilisateur connecté
  const senderType = 'user'; // ou 'host'

  const fetchMessages = () => {
    fetch(`http://localhost/flexii/api/get_messages.php?booking_id=${booking_id}`)
      .then(res => res.json())
      .then(setMessages);
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [booking_id]);

  const sendMessage = () => {
    if (!newMsg.trim()) return;

    fetch('http://localhost/flexii/api/send_message.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        booking_id,
        sender_type: senderType,
        sender_id: senderId,
        message: newMsg
      })
    })
      .then(res => res.json())
      .then(() => {
        setNewMsg('');
        fetchMessages();
      });
  };

  return (
    <div className="messagerie-container">
      <h2>Messagerie liée à la réservation #{booking_id}</h2>
      <div className="messages-box">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.sender_type}`}>
            <strong>{msg.sender_type === 'user' ? 'Utilisateur' : 'Hôte'}</strong>
            <p>{msg.message}</p>
            <small>{new Date(msg.sent_at).toLocaleString()}</small>
          </div>
        ))}
      </div>
      <div className="send-box">
        <textarea
          value={newMsg}
          onChange={(e) => setNewMsg(e.target.value)}
          placeholder="Votre message..."
        />
        <button onClick={sendMessage}>Envoyer</button>
      </div>
    </div>
  );
}

export default Messagerie;
