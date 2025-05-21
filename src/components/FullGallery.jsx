import React, { useEffect } from 'react';
import styles from '../styles/FullGallery.module.css';

function FullGallery({ images, onClose }) {

    // Empêche le scroll du body quand la galerie est ouverte
    useEffect(() => {
        document.body.classList.add('gallery-open');
        return () => {
            document.body.classList.remove('gallery-open');
        };
    }, []);

    return (
        <div className={styles.fullGallery}>
            <div className={styles.galleryHeader}>
                <button onClick={onClose} className={styles.closeGalleryBtn}>✕</button>
                <h2>Photos du logement</h2>
            </div>

            <div className={styles.galleryGrid}>
                {images.map((img, idx) => (
                    <div className={styles.galleryItem} key={idx}>
                        <img src={img} alt={`Photo ${idx + 1}`} />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default FullGallery;
