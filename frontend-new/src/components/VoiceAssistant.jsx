import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';

const VoiceAssistant = ({ isOpen, onClose }) => {
  const { language } = useApp();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = language === 'hi' ? 'hi-IN' : language === 'kn' ? 'kn-IN' : 'en-US';

      recognitionInstance.onresult = (event) => {
        const speechResult = event.results[0][0].transcript;
        setTranscript(speechResult);
        handleVoiceCommand(speechResult);
        setIsListening(false);
      };

      recognitionInstance.onerror = () => {
        setIsListening(false);
        setResponse('Sorry, I could not understand. Please try again.');
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    }
  }, [language]);

  const handleVoiceCommand = (command) => {
    const lowerCommand = command.toLowerCase();
    
    if (lowerCommand.includes('hello') || lowerCommand.includes('hi')) {
      setResponse('Hello! How can I help you with EcoMarket today?');
      speak('Hello! How can I help you with EcoMarket today?');
    } else if (lowerCommand.includes('product') || lowerCommand.includes('search')) {
      setResponse('You can browse products in the Buyer section. What are you looking for?');
      speak('You can browse products in the Buyer section. What are you looking for?');
    } else if (lowerCommand.includes('cart')) {
      setResponse('Your shopping cart is available in the Buyer page. Click the cart icon to view items.');
      speak('Your shopping cart is available in the Buyer page.');
    } else if (lowerCommand.includes('order')) {
      setResponse('You can view your orders in the Orders section from the home page.');
      speak('You can view your orders in the Orders section from the home page.');
    } else if (lowerCommand.includes('eco') || lowerCommand.includes('sustainable')) {
      setResponse('EcoMarket promotes sustainable shopping with eco-ratings and carbon footprint tracking for all products!');
      speak('EcoMarket promotes sustainable shopping with eco-ratings and carbon footprint tracking for all products!');
    } else {
      setResponse('I can help you with products, cart, orders, and eco-friendly shopping. What would you like to know?');
      speak('I can help you with products, cart, orders, and eco-friendly shopping.');
    }
  };

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'hi' ? 'hi-IN' : language === 'kn' ? 'kn-IN' : 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  const startListening = () => {
    if (recognition) {
      setTranscript('');
      setResponse('');
      setIsListening(true);
      recognition.start();
    } else {
      setResponse('Voice recognition is not supported in your browser.');
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <span style={styles.close} onClick={onClose}>&times;</span>
        <h2 style={styles.title}>🎤 Voice Assistant</h2>
        
        <div style={styles.content}>
          <div style={styles.micContainer}>
            <button
              onClick={isListening ? stopListening : startListening}
              style={{
                ...styles.micButton,
                background: isListening ? '#ff6b6b' : '#667eea',
              }}
            >
              {isListening ? '🔴 Listening...' : '🎤 Start Speaking'}
            </button>
          </div>

          {transcript && (
            <div style={styles.transcript}>
              <strong>You said:</strong>
              <p>{transcript}</p>
            </div>
          )}

          {response && (
            <div style={styles.response}>
              <strong>Assistant:</strong>
              <p>{response}</p>
            </div>
          )}

          <div style={styles.suggestions}>
            <p style={styles.suggestionsTitle}>Try saying:</p>
            <ul style={styles.suggestionsList}>
              <li>"Show me products"</li>
              <li>"What's in my cart?"</li>
              <li>"View my orders"</li>
              <li>"Tell me about eco-friendly shopping"</li>
            </ul>
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
    padding: '2rem',
    position: 'relative',
    maxHeight: '80vh',
    overflow: 'auto',
  },
  close: {
    position: 'absolute',
    top: '1rem',
    right: '1rem',
    fontSize: '2rem',
    cursor: 'pointer',
    color: '#999',
  },
  title: {
    marginBottom: '1.5rem',
    color: '#333',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  micContainer: {
    display: 'flex',
    justifyContent: 'center',
  },
  micButton: {
    padding: '1rem 2rem',
    fontSize: '1.1rem',
    color: 'white',
    border: 'none',
    borderRadius: '50px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
  },
  transcript: {
    background: '#f0f0f0',
    padding: '1rem',
    borderRadius: '8px',
    borderLeft: '4px solid #667eea',
  },
  response: {
    background: '#e8f4f8',
    padding: '1rem',
    borderRadius: '8px',
    borderLeft: '4px solid #28a745',
  },
  suggestions: {
    background: '#fff9e6',
    padding: '1rem',
    borderRadius: '8px',
  },
  suggestionsTitle: {
    fontWeight: 'bold',
    marginBottom: '0.5rem',
    color: '#666',
  },
  suggestionsList: {
    margin: 0,
    paddingLeft: '1.5rem',
    color: '#666',
  },
};

export default VoiceAssistant;
