import { useState } from 'react';
import { useApp } from '../context/AppContext';

const Chatbot = ({ isOpen, onClose }) => {
  const { language, products } = useApp();
  const [messages, setMessages] = useState([
    { text: 'Hello! I\'m your EcoMarket assistant. How can I help you today?', sender: 'bot' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: 'user' };
    setMessages([...messages, userMessage]);

    // Generate bot response
    setTimeout(() => {
      const botResponse = generateResponse(input);
      setMessages(prev => [...prev, { text: botResponse, sender: 'bot' }]);
    }, 500);

    setInput('');
  };

  const generateResponse = (query) => {
    const lowerQuery = query.toLowerCase();

    if (lowerQuery.includes('hello') || lowerQuery.includes('hi')) {
      return 'Hello! Welcome to EcoMarket. I can help you find eco-friendly products, check your cart, or answer questions about sustainable shopping.';
    } else if (lowerQuery.includes('product') || lowerQuery.includes('buy')) {
      return `We have ${products.length} products available! You can browse them in the Buyer section. All products have eco-ratings and carbon footprint information.`;
    } else if (lowerQuery.includes('eco') || lowerQuery.includes('sustainable') || lowerQuery.includes('green')) {
      return 'EcoMarket is committed to sustainability! Every product has an eco-rating (1-5 stars) and carbon footprint tracking. We help you make environmentally conscious choices.';
    } else if (lowerQuery.includes('cart')) {
      return 'You can view your shopping cart by clicking the cart icon in the Buyer page. From there, you can proceed to checkout.';
    } else if (lowerQuery.includes('order')) {
      return 'To view your orders, go to the home page and select "My Orders". You can track all your purchases there.';
    } else if (lowerQuery.includes('sell')) {
      return 'Want to sell products? Select the Seller role from the home page. You can add products with details like eco-rating, carbon footprint, and pricing.';
    } else if (lowerQuery.includes('rent')) {
      return 'We offer rental options too! Select the Renter role to browse products available for rent. It\'s a great way to reduce waste!';
    } else if (lowerQuery.includes('payment') || lowerQuery.includes('pay')) {
      return 'We accept multiple payment methods: Cash on Delivery (COD), Credit/Debit Cards, and UPI. Choose your preferred method at checkout.';
    } else if (lowerQuery.includes('help')) {
      return 'I can help you with:\n• Finding products\n• Shopping cart\n• Orders\n• Eco-friendly information\n• Selling products\n• Rental options\n\nWhat would you like to know?';
    } else {
      return 'I\'m here to help! You can ask me about products, orders, eco-ratings, selling, renting, or sustainable shopping. What would you like to know?';
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  if (!isOpen) return null;

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <h2 style={styles.title}>💬 Chat Assistant</h2>
          <span style={styles.close} onClick={onClose}>&times;</span>
        </div>
        
        <div style={styles.messagesContainer}>
          {messages.map((msg, index) => (
            <div
              key={index}
              style={{
                ...styles.message,
                ...(msg.sender === 'user' ? styles.userMessage : styles.botMessage),
              }}
            >
              {msg.text}
            </div>
          ))}
        </div>

        <div style={styles.inputContainer}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            style={styles.input}
          />
          <button onClick={handleSend} style={styles.sendBtn}>
            Send
          </button>
        </div>

        <div style={styles.quickActions}>
          <button onClick={() => setInput('Show me products')} style={styles.quickBtn}>
            🛍️ Products
          </button>
          <button onClick={() => setInput('Tell me about eco-ratings')} style={styles.quickBtn}>
            🌿 Eco Info
          </button>
          <button onClick={() => setInput('How do I sell?')} style={styles.quickBtn}>
            🏪 Sell
          </button>
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
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modal: {
    background: 'white',
    borderRadius: '12px',
    maxWidth: '500px',
    width: '90%',
    height: '600px',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  header: {
    padding: '1rem 1.5rem',
    borderBottom: '2px solid #667eea',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: '#f8f9fa',
  },
  title: {
    margin: 0,
    color: '#333',
  },
  close: {
    fontSize: '2rem',
    cursor: 'pointer',
    color: '#999',
  },
  messagesContainer: {
    flex: 1,
    padding: '1rem',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.8rem',
  },
  message: {
    padding: '0.8rem 1rem',
    borderRadius: '12px',
    maxWidth: '80%',
    wordWrap: 'break-word',
    whiteSpace: 'pre-wrap',
  },
  userMessage: {
    background: '#667eea',
    color: 'white',
    alignSelf: 'flex-end',
    marginLeft: 'auto',
  },
  botMessage: {
    background: '#f0f0f0',
    color: '#333',
    alignSelf: 'flex-start',
  },
  inputContainer: {
    padding: '1rem',
    borderTop: '1px solid #ddd',
    display: 'flex',
    gap: '0.5rem',
  },
  input: {
    flex: 1,
    padding: '0.8rem',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '0.95rem',
  },
  sendBtn: {
    padding: '0.8rem 1.5rem',
    background: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  quickActions: {
    padding: '0.5rem 1rem 1rem',
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap',
  },
  quickBtn: {
    padding: '0.5rem 1rem',
    background: '#e8f4f8',
    border: '1px solid #667eea',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '0.85rem',
    color: '#667eea',
    fontWeight: '500',
  },
};

export default Chatbot;
