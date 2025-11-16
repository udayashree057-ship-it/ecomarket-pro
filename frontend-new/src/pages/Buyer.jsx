import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { translate } from '../utils/translations';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import Cart from '../components/Cart';

const Buyer = () => {
  const { products, language, cart } = useApp();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [showCart, setShowCart] = useState(false);

  const filteredProducts = products
    .filter(p => !p.forRent)
    .filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.description || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = category === 'all' || p.category === category;
      return matchesSearch && matchesCategory;
    });

  return (
    <div>
      <div style={styles.header}>
        <h2>🛒 Browse Products</h2>
        <div style={styles.headerButtons}>
          <button onClick={() => navigate('/orders')} style={styles.ordersBtn}>
            📦 My Orders
          </button>
          <button onClick={() => navigate('/')} style={styles.backBtn}>
            ← Back
          </button>
        </div>
      </div>

      <div style={styles.searchBar}>
        <input
          type="text"
          placeholder={translate('searchProducts', language)}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={styles.searchInput}
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={styles.select}
        >
          <option value="all">{translate('allCategories', language)}</option>
          <option value="plastic">Plastic</option>
          <option value="wood">Wood</option>
          <option value="steel">Steel</option>
          <option value="electric">Electric</option>
          <option value="bamboo">Bamboo</option>
          <option value="metals">Metals</option>
        </select>
        <button onClick={() => setShowCart(true)} style={styles.cartBtn}>
          🛒 {cart.length}
        </button>
      </div>

      <div style={styles.productGrid}>
        {filteredProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {showCart && <Cart onClose={() => setShowCart(false)} />}
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
  headerButtons: {
    display: 'flex',
    gap: '10px',
  },
  ordersBtn: {
    padding: '8px 16px',
    background: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
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
    display: 'flex',
    gap: '0.8rem',
    margin: '1.5rem 2rem',
    flexWrap: 'wrap',
  },
  searchInput: {
    flex: 1,
    padding: '0.8rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    minWidth: '200px',
  },
  select: {
    padding: '0.8rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    minWidth: '150px',
  },
  cartBtn: {
    padding: '0.8rem 1.2rem',
    background: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  productGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '1.5rem',
    padding: '2rem',
  },
};

export default Buyer;
