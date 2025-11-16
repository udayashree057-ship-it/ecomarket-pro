import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';

const Renter = () => {
  const { products, language } = useApp();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const rentProducts = products
    .filter(p => p.forRent)
    .filter(p =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.description || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <div>
      <div style={styles.header}>
        <h2>🔄 Rental Products</h2>
        <button onClick={() => navigate('/')} style={styles.backBtn}>
          ← Back
        </button>
      </div>

      <div style={styles.searchBar}>
        <input
          type="text"
          placeholder="Search rental products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={styles.searchInput}
        />
      </div>

      <div style={styles.productGrid}>
        {rentProducts.length === 0 ? (
          <div style={styles.empty}>No rental products available</div>
        ) : (
          rentProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))
        )}
      </div>
    </div>
  );
};

const styles = {
  header: {
    padding: '20px',
    borderBottom: '2px solid #667eea',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: 'white',
  },
  backBtn: {
    padding: '8px 16px',
    background: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  searchBar: {
    padding: '1.5rem 2rem',
  },
  searchInput: {
    width: '100%',
    padding: '0.8rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
  },
  productGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '1.5rem',
    padding: '2rem',
  },
  empty: {
    textAlign: 'center',
    padding: '3rem',
    color: '#999',
    gridColumn: '1 / -1',
  },
};

export default Renter;
