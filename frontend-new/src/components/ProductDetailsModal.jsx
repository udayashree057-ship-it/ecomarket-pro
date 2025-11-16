import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { translate } from '../utils/translations';

const ProductDetailsModal = ({ product, onClose }) => {
  const { addToCart, language } = useApp();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!product) return null;

  const getPlaceholderImage = () => {
    return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="500" height="400"%3E%3Crect fill="%23ddd" width="500" height="400"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ENo Image%3C/text%3E%3C/svg%3E';
  };

  const productId = product._id || product.id;

  const handleAddToCart = () => {
    addToCart(productId);
    onClose();
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button style={styles.closeButton} onClick={onClose}>✕</button>
        
        <div style={isMobile ? styles.contentMobile : styles.content}>
          <div style={styles.imageSection}>
            <img
              src={product.image || getPlaceholderImage()}
              alt={product.name}
              style={styles.image}
            />
          </div>

          <div style={styles.detailsSection}>
            <h2 style={styles.title}>{product.name}</h2>
            
            <div style={styles.priceSection}>
              <span style={styles.price}>₹{product.price}</span>
              {product.originalPrice && (
                <span style={styles.originalPrice}>₹{product.originalPrice}</span>
              )}
            </div>

            <div style={styles.ecoInfo}>
              <div style={styles.ecoItem}>
                <span style={styles.ecoLabel}>🌿 {translate('ecoRating', language)}:</span>
                <span style={styles.ecoValue}>{'⭐'.repeat(product.ecoRating)}</span>
              </div>
              <div style={styles.ecoItem}>
                <span style={styles.ecoLabel}>🌍 {translate('carbonFootprint', language)}:</span>
                <span style={styles.ecoValue}>{product.carbonFootprint} kg CO₂</span>
              </div>
            </div>

            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>{translate('description', language)}</h3>
              <p style={styles.description}>
                {product.description || 'This eco-friendly product helps reduce environmental impact while providing excellent quality and value.'}
              </p>
            </div>

            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>{translate('sellerInfo', language)}</h3>
              <div style={styles.sellerInfo}>
                <p><strong>Seller:</strong> {product.sellerName}</p>
                {product.sellerLocation && (
                  <p><strong>Location:</strong> {product.sellerLocation}</p>
                )}
                {product.sellerRating && (
                  <p><strong>Rating:</strong> {'⭐'.repeat(Math.round(product.sellerRating))}</p>
                )}
              </div>
            </div>

            {product.specifications && (
              <div style={styles.section}>
                <h3 style={styles.sectionTitle}>{translate('specifications', language)}</h3>
                <ul style={styles.specsList}>
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <li key={key} style={styles.specItem}>
                      <strong>{key}:</strong> {value}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {product.stock !== undefined && (
              <div style={styles.stockInfo}>
                <span style={product.stock > 0 ? styles.inStock : styles.outOfStock}>
                  {product.stock > 0 ? `✓ In Stock (${product.stock} available)` : '✗ Out of Stock'}
                </span>
              </div>
            )}

            <button
              onClick={handleAddToCart}
              style={product.stock === 0 ? styles.buttonDisabled : styles.button}
              disabled={product.stock === 0}
            >
              {translate('addToCart', language)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    padding: '1rem',
  },
  modal: {
    background: 'white',
    borderRadius: '12px',
    maxWidth: '900px',
    width: '100%',
    maxHeight: '90vh',
    overflow: 'auto',
    position: 'relative',
    boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
  },
  closeButton: {
    position: 'absolute',
    top: '1rem',
    right: '1rem',
    background: 'white',
    border: 'none',
    fontSize: '1.5rem',
    cursor: 'pointer',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
    zIndex: 10,
  },
  content: {
    display: 'flex',
    flexDirection: 'row',
    gap: '2rem',
    padding: '2rem',
  },
  contentMobile: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    padding: '1rem',
  },
  imageSection: {
    flex: '1',
    minWidth: '300px',
  },
  image: {
    width: '100%',
    height: 'auto',
    borderRadius: '8px',
    objectFit: 'cover',
  },
  detailsSection: {
    flex: '1',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  title: {
    fontSize: '1.8rem',
    fontWeight: 'bold',
    color: '#333',
    margin: 0,
  },
  priceSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  price: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#667eea',
  },
  originalPrice: {
    fontSize: '1.2rem',
    color: '#999',
    textDecoration: 'line-through',
  },
  ecoInfo: {
    background: '#f0f9ff',
    padding: '1rem',
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  ecoItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ecoLabel: {
    fontSize: '0.95rem',
    color: '#666',
  },
  ecoValue: {
    fontSize: '0.95rem',
    fontWeight: 'bold',
    color: '#333',
  },
  section: {
    marginTop: '0.5rem',
  },
  sectionTitle: {
    fontSize: '1.1rem',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '0.5rem',
  },
  description: {
    fontSize: '0.95rem',
    color: '#666',
    lineHeight: '1.6',
  },
  sellerInfo: {
    fontSize: '0.9rem',
    color: '#666',
  },
  specsList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  specItem: {
    fontSize: '0.9rem',
    color: '#666',
    padding: '0.3rem 0',
  },
  stockInfo: {
    marginTop: '0.5rem',
  },
  inStock: {
    color: '#10b981',
    fontWeight: 'bold',
  },
  outOfStock: {
    color: '#ef4444',
    fontWeight: 'bold',
  },
  button: {
    width: '100%',
    padding: '1rem',
    background: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 'bold',
    marginTop: '1rem',
    transition: 'background 0.3s ease',
  },
  buttonDisabled: {
    width: '100%',
    padding: '1rem',
    background: '#ccc',
    color: '#666',
    border: 'none',
    borderRadius: '8px',
    cursor: 'not-allowed',
    fontSize: '1rem',
    fontWeight: 'bold',
    marginTop: '1rem',
  },
};

export default ProductDetailsModal;
