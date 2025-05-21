import { useState, useEffect, useRef } from 'react';
import '../styles/ListingDetails.css'; // ⬅️ CSS global

function DescriptionBlock({ description }) {
  const [expanded, setExpanded] = useState(false);
  const [showReadMore, setShowReadMore] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (container && container.scrollHeight > container.clientHeight) {
      setShowReadMore(true);
    }
  }, []);

  return (
    <div className="card" style={{ marginTop: '50px' }}>
      <h2 className="section-title">Description</h2>
      <div
        className="description-container"
        id="descriptionContainer"
        ref={containerRef}
        style={{ maxHeight: expanded ? '1000px' : undefined }}
      >
        <p className="section-text" id="description">{description}</p>
      </div>
      {showReadMore && (
        <button
          className="btn-readmore"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? 'Réduire' : 'Lire la suite'}
        </button>
      )}
    </div>
  );
}

export default DescriptionBlock;
