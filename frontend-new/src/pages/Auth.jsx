import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { translate } from '../utils/translations';

const Auth = () => {
  const { login, register, language } = useApp();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    address: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isLogin) {
      const result = await login(formData.email, formData.password);
      if (!result.success) {
        alert(result.message || 'Invalid credentials');
      }
    } else {
      const result = await register(formData);
      if (result.success) {
        alert(result.message);
        setIsLogin(true);
        setFormData({ email: '', password: '', name: '', phone: '', address: '' });
      } else {
        alert(result.message);
      }
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div style={styles.container}>
      <div style={styles.authBox}>
        <h1>🌱 EcoMarket</h1>
        <p>{translate('tagline', language)}</p>
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <h2>{isLogin ? translate('login', language) : translate('register', language)}</h2>
          
          {!isLogin && (
            <input
              type="text"
              name="name"
              placeholder={translate('fullName', language)}
              value={formData.name}
              onChange={handleChange}
              style={styles.input}
              required
            />
          )}
          
          <input
            type="email"
            name="email"
            placeholder={translate('email', language)}
            value={formData.email}
            onChange={handleChange}
            style={styles.input}
            required
          />
          
          <input
            type="password"
            name="password"
            placeholder={translate('password', language)}
            value={formData.password}
            onChange={handleChange}
            style={styles.input}
            required
          />
          
          {!isLogin && (
            <>
              <input
                type="tel"
                name="phone"
                placeholder={translate('phone', language)}
                value={formData.phone}
                onChange={handleChange}
                style={styles.input}
                required
              />
              <textarea
                name="address"
                placeholder={translate('address', language)}
                value={formData.address}
                onChange={handleChange}
                style={styles.textarea}
                required
              />
            </>
          )}
          
          <button type="submit" style={styles.button}>
            {isLogin ? translate('loginBtn', language) : translate('registerBtn', language)}
          </button>
          
          <p style={styles.toggle}>
            {isLogin ? translate('noAccount', language) : translate('haveAccount', language)}{' '}
            <a onClick={() => setIsLogin(!isLogin)} style={styles.link}>
              {isLogin ? translate('registerLink', language) : translate('loginLink', language)}
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
  authBox: {
    maxWidth: '400px',
    width: '100%',
    background: 'white',
    padding: '2rem',
    borderRadius: '10px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  input: {
    width: '100%',
    padding: '0.8rem',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '1rem',
  },
  textarea: {
    width: '100%',
    padding: '0.8rem',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '1rem',
    minHeight: '80px',
  },
  button: {
    width: '100%',
    padding: '0.8rem',
    background: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1rem',
    marginTop: '1rem',
  },
  toggle: {
    marginTop: '1rem',
  },
  link: {
    color: '#667eea',
    cursor: 'pointer',
    textDecoration: 'underline',
  },
};

export default Auth;
