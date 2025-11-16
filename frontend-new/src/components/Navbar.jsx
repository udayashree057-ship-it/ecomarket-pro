import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { translate } from '../utils/translations';
import { useNavigate } from 'react-router-dom';
import VoiceAssistant from './VoiceAssistant';
import Chatbot from './Chatbot';

const Navbar = () => {
  const { currentUser, logout, language, setLanguage } = useApp();
  const navigate = useNavigate();
  const [showVoice, setShowVoice] = useState(false);
  const [showChat, setShowChat] = useState(false);

  if (!currentUser) return null;

  return (
    <>
      <nav style={styles.navbar}>
        <div style={styles.container}>
          <h1 style={styles.logo} onClick={() => navigate('/')}>
            🌱 EcoMarket
          </h1>
          <div style={styles.navLinks}>
            <button onClick={() => setShowVoice(true)} style={styles.iconBtn} title="Voice Assistant">
              🎤
            </button>
            <button onClick={() => setShowChat(true)} style={styles.iconBtn} title="Chat Assistant">
              💬
            </button>
            <select 
              value={language} 
              onChange={(e) => setLanguage(e.target.value)}
              style={styles.select}
            >
              <option value="en">English</option>
              <option value="kn">ಕನ್ನಡ (Kannada)</option>
              <option value="hi">हिंदी (Hindi)</option>
            </select>
            <span style={styles.greeting}>Hello, {currentUser.name}</span>
            <button onClick={logout} style={styles.button}>
              {translate('logout', language)}
            </button>
          </div>
        </div>
      </nav>
      
      <VoiceAssistant isOpen={showVoice} onClose={() => setShowVoice(false)} />
      <Chatbot isOpen={showChat} onClose={() => setShowChat(false)} />
    </>
  );
};

const styles = {
  navbar: {
    background: 'white',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    padding: '1rem 0',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 2rem',
  },
  logo: {
    margin: 0,
    cursor: 'pointer',
  },
  navLinks: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center',
  },
  select: {
    padding: '0.5rem',
    borderRadius: '4px',
    border: '1px solid #ddd',
  },
  greeting: {
    color: '#333',
  },
  button: {
    padding: '0.5rem 1rem',
    background: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  iconBtn: {
    padding: '0.5rem 0.8rem',
    background: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    cursor: 'pointer',
    fontSize: '1.2rem',
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
};

export default Navbar;
