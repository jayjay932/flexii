import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Head from '../components/Head'; // ✅ On importe Head

function AfficherCommentaires() {
  const { id } = useParams();
  const [comments, setComments] = useState([]);
  const [listingTitle, setListingTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState('/path/to/default-avatar.jpg');

  const onAvatarClick = () => {
    console.log('Avatar clicked');
  };

  useEffect(() => {
    fetch(`http://localhost/flexii/api/afficher_commentaires.php?id=${id}`)
      .then((res) => res.json())
      .then((data) => {
        setListingTitle(data.listingTitle);
        setComments(data.comments);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Erreur API pour les commentaires complets :', err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div style={{ padding: '20px' }}>Chargement des commentaires...</div>;
  }

  return (
    <div>
      {/* ✅ On utilise Head comme nav */}
      <Head
        isLoggedIn={isLoggedIn}
        avatarUrl={avatarUrl}
        onAvatarClick={onAvatarClick}
      />

      <div className="container" style={styles.container}>
        <h1 style={styles.title}>
          Commentaires pour "{listingTitle}"
        </h1>
        {comments.map((comment, idx) => (
          <div key={idx} className="comment" style={styles.comment}>
            <div className="comment-header" style={styles.commentHeader}>
              <img
                src={comment.avatar_url}
                alt="avatar"
                style={styles.avatar}
              />
              <div>
                <div className="author" style={styles.author}>
                  {comment.name} - {comment.rating}★
                </div>
                <div className="date" style={styles.date}>
                  {new Date(comment.created_at).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' })}
                </div>
              </div>
            </div>
            <div className="content" style={styles.content}>
              {comment.content}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ✅ Les mêmes styles que ton fichier original
const styles = {
  container: {
    maxWidth: '900px',
    margin: '40px auto',
    background: 'white',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)'
  },
  title: {
    fontSize: '28px',
    marginBottom: '20px'
  },
  comment: {
    borderBottom: '1px solid #ddd',
    padding: '15px 0'
  },
  commentHeader: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '10px'
  },
  avatar: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    objectFit: 'cover',
    marginRight: '15px'
  },
  author: {
    fontWeight: 'bold'
  },
  date: {
    color: 'gray',
    fontSize: '14px'
  },
  content: {
    fontSize: '15px',
    lineHeight: '1.6'
  }
};

export default AfficherCommentaires;
