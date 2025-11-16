import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { translate } from '../utils/translations';
import ProductDetailsModal from './ProductDetailsModal';

const ProductCard = ({ product }) => {
  const { addToCart, language } = useApp();
  const [showDetails, setShowDetails] = useState(false);

  const getPlaceholderImage = () => {
    return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="250" height="200"%3E%3Crect fill="%23ddd" width="250" height="200"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ENo Image%3C/text%3E%3C/svg%3E';
  };

  // Handle both _id (MongoDB) and id (localStorage)
  const productId = product._id || product.id;

  return (
    <>
      <div style={styles.card} onClick={() => setShowDetails(true)}>
        <img
          src={product.image || getPlaceholderImage()}
          alt={product.name}
          style={styles.image}
        />
        <div style={styles.info}>
          <div style={styles.name}>{product.name}</div>
          <div style={styles.price}>₹{product.price}</div>
          <div style={styles.ecoRating}>
            🌿 {translate('ecoRating', language)}: {'⭐'.repeat(product.ecoRating)}
          </div>
          <div style={styles.carbon}>
            🌍 {translate('carbonFootprint', language)}: {product.carbonFootprint} kg CO₂
          </div>
          <div style={styles.seller}>Seller: {product.sellerName}</div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              addToCart(productId);
            }}
            style={styles.button}
          >
            {translate('addToCart', language)}
          </button>
        </div>
      </div>

      {showDetails && (
        <ProductDetailsModal
          product={product}
          onClose={() => setShowDetails(false)}
        />
      )}
    </>
  );
};

const styles = {
  card: {
    background: 'white',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
  },
  image: {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
  },
  info: {
    padding: '1rem',
  },
  name: {
    fontWeight: 'bold',
    fontSize: '1rem',
    color: '#333',
    marginBottom: '0.5rem',
  },
  price: {
    color: '#667eea',
    fontSize: '1.2rem',
    fontWeight: 'bold',
    margin: '0.5rem 0',
  },
  ecoRating: {
    fontSize: '0.85rem',
    color: '#666',
    margin: '0.3rem 0',
  },
  carbon: {
    fontSize: '0.85rem',
    color: '#666',
    margin: '0.3rem 0',
  },
  seller: {
    fontSize: '0.85rem',
    color: '#666',
    margin: '0.3rem 0',
  },
  button: {
    width: '100%',
    padding: '0.6rem',
    background: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    marginTop: '0.5rem',
  },
};

export default ProductCard;
