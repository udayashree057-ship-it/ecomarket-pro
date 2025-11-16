import { useApp } from '../context/AppContext';
import { translate } from '../utils/translations';
import { useNavigate } from 'react-router-dom';

const RoleSelection = () => {
  const { language } = useApp();
  const navigate = useNavigate();

  const roles = [
    { id: 'buyer', icon: '🛒', key: 'buyer', descKey: 'buyerDesc', path: '/buyer' },
    { id: 'seller', icon: '🏪', key: 'seller', descKey: 'sellerDesc', path: '/seller' },
    { id: 'renter', icon: '🔄', key: 'renter', descKey: 'renterDesc', path: '/renter' },
    { id: 'orders', icon: '📦', key: 'My Orders', descKey: 'View your purchase history', path: '/orders' },
  ];

  return (
    <div style={styles.container}>
      <div style={styles.banner}>
        <h1>🌱 Welcome to EcoMarket</h1>
        <p>Sustainable Shopping for a Better Tomorrow</p>
      </div>
      
      <div style={styles.roleContainer}>
        <h2 style={styles.title}>{translate('selectRole', language)}</h2>
        <div style={styles.roleCards}>
          {roles.map((role) => (
            <div
              key={role.id}
              style={styles.roleCard}
              onClick={() => navigate(role.path)}
            >
              <div style={styles.roleIcon}>{role.icon}</div>
              <h3>{translate(role.key, language)}</h3>
              <p>{translate(role.descKey, language)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
  banner: {
    color: 'white',
    padding: '60px 20px',
    textAlign: 'center',
    borderBottom: '3px solid #fff',
  },
  roleContainer: {
    maxWidth: '1000px',
    margin: '60px auto',
    padding: '0 2rem',
  },
  title: {
    textAlign: 'center',
    color: 'white',
    marginBottom: '3rem',
    fontSize: '2.5rem',
  },
  roleCards: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '2rem',
  },
  roleCard: {
    background: 'white',
    padding: '2rem',
    borderRadius: '12px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
    border: '2px solid transparent',
  },
  roleIcon: {
    fontSize: '3.5rem',
    marginBottom: '1rem',
  },
};

export default RoleSelection;
