import { useState } from 'react';
import styles from '../styles/Detail.module.css'; // 👈 IMPORTANT : importe tes styles ici

function ImageCarousel({ images, onOpenGallery }) {
    const [current, setCurrent] = useState(0);

    if (!images || images.length === 0) return <p>Aucune image.</p>;

    return (
        <div className={styles.carousel}>
            <img
                src={images[current]}
                alt={`Slide ${current + 1}`}
                className={styles.slideImg}
                onClick={onOpenGallery}
            />
            <button
                className={`${styles.nav} ${styles.left}`}
                onClick={() =>
                    setCurrent((current - 1 + images.length) % images.length)
                }
            >
                &#10094;
            </button>
            <button
                className={`${styles.nav} ${styles.right}`}
                onClick={() => setCurrent((current + 1) % images.length)}
            >
                &#10095;
            </button>
        </div>
    );
}

export default ImageCarousel;
