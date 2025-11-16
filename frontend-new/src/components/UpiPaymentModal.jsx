import { useEffect, useState, useRef } from 'react';
import QRCode from 'qrcode';
import { paymentsAPI } from '../services/api';

const UpiPaymentModal = ({ isOpen, onClose, sellerUpiId, amount, orderId, onPaymentVerified }) => {
  const [countdown, setCountdown] = useState(3);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('pending'); // pending, verifying, success, failed
  const [transactionId, setTransactionId] = useState('');
  const canvasRef = useRef(null);

  useEffect(() => {
    if (isOpen && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, countdown]);

  // Generate QR Code
  useEffect(() => {
    if (isOpen && sellerUpiId) {
      const upiString = `upi://pay?pa=${sellerUpiId}&pn=EcoMarket&am=${amount}&cu=INR&tn=Order ${orderId}`;
      
      // Generate QR code as data URL
      QRCode.toDataURL(upiString, {
        width: 250,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      })
      .then(url => {
        setQrCodeUrl(url);
      })
      .catch(err => {
        console.error('Error generating QR code:', err);
      });
    }
  }, [isOpen, sellerUpiId, amount, orderId]);

  const handlePaymentConfirmation = async () => {
    if (!transactionId.trim()) {
      alert('Please enter transaction ID');
      return;
    }
    
    setPaymentStatus('verifying');
    
    try {
      // Call backend to verify payment
      const result = await paymentsAPI.verify({
        orderId,
        transactionId,
        paymentMethod: 'upi'
      });
      
      if (result.success) {
        setPaymentStatus('success');
        
        // Notify parent component
        if (onPaymentVerified) {
          onPaymentVerified(result.order);
        }
        
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        setPaymentStatus('failed');
        alert('Payment verification failed: ' + result.message);
      }
    } catch (error) {
      console.error('Payment verification error:', error);
      setPaymentStatus('failed');
      alert('Payment verification failed. Please try again or contact support.');
    }
  };

  if (!isOpen) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h2 style={styles.title}>📱 Opening UPI App...</h2>
        </div>

        <div style={styles.content}>
          <div style={styles.spinner}>
            <div style={styles.spinnerCircle}></div>
          </div>

          {/* QR Code Section */}
          {qrCodeUrl && (
            <div style={styles.qrSection}>
              <h3 style={styles.qrTitle}>Scan QR Code to Pay</h3>
              <img src={qrCodeUrl} alt="UPI QR Code" style={styles.qrImage} />
              <p style={styles.qrInstruction}>
                Open any UPI app and scan this QR code
              </p>
            </div>
          )}

          <div style={styles.divider}>
            <span style={styles.dividerText}>OR</span>
          </div>

          <div style={styles.paymentDetails}>
            <h3 style={styles.detailsTitle}>Payment Details</h3>
            <div style={styles.detailRow}>
              <span style={styles.label}>Pay to:</span>
              <span style={styles.value}>{sellerUpiId}</span>
            </div>
            <div style={styles.detailRow}>
              <span style={styles.label}>Amount:</span>
              <span style={styles.amountValue}>₹{amount}</span>
            </div>
            <div style={styles.detailRow}>
              <span style={styles.label}>Order ID:</span>
              <span style={styles.value}>{orderId}</span>
            </div>
          </div>

          <div style={styles.instructions}>
            <p style={styles.instructionText}>
              ✓ Your UPI app should open automatically
            </p>
            <p style={styles.instructionText}>
              ✓ Complete the payment in your UPI app
            </p>
            <p style={styles.instructionText}>
              ✓ Return here after payment
            </p>
          </div>

          <div style={styles.appIcons}>
            <span style={styles.appIcon}>📱</span>
            <span style={styles.appText}>GPay • PhonePe • Paytm • BHIM</span>
          </div>

          {countdown === 0 && (
            <div style={styles.troubleshoot}>
              <p style={styles.troubleshootTitle}>UPI app didn't open?</p>
              <div style={styles.manualSteps}>
                <p>1. Open any UPI app manually</p>
                <p>2. Select "Send Money" or "Pay"</p>
                <p>3. Enter UPI ID: <strong>{sellerUpiId}</strong></p>
                <p>4. Enter Amount: <strong>₹{amount}</strong></p>
                <p>5. Add Note: <strong>Order {orderId}</strong></p>
              </div>
            </div>
          )}
        </div>

        <div style={styles.footer}>
          {paymentStatus === 'pending' && (
            <>
              <div style={styles.verificationSection}>
                <p style={styles.verificationTitle}>After payment, enter Transaction ID:</p>
                <input
                  type="text"
                  placeholder="Enter UPI Transaction ID"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  style={styles.transactionInput}
                />
              </div>
              <button onClick={handlePaymentConfirmation} style={styles.verifyBtn}>
                ✅ Verify Payment
              </button>
              <button onClick={onClose} style={styles.skipBtn}>
                Skip Verification
              </button>
            </>
          )}

          {paymentStatus === 'verifying' && (
            <div style={styles.verifyingState}>
              <div style={styles.spinner}></div>
              <p>Verifying payment...</p>
            </div>
          )}

          {paymentStatus === 'success' && (
            <div style={styles.successState}>
              <div style={styles.successIcon}>✅</div>
              <p style={styles.successText}>Payment Verified Successfully!</p>
            </div>
          )}
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
    background: 'rgba(0,0,0,0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2000,
    animation: 'fadeIn 0.3s ease',
  },
  modal: {
    background: 'white',
    borderRadius: '16px',
    maxWidth: '500px',
    width: '90%',
    maxHeight: '90vh',
    overflow: 'auto',
    boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
  },
  header: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '1.5rem',
    borderRadius: '16px 16px 0 0',
  },
  title: {
    margin: 0,
    color: 'white',
    textAlign: 'center',
    fontSize: '1.5rem',
  },
  content: {
    padding: '2rem',
  },
  spinner: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '2rem',
  },
  spinnerCircle: {
    width: '60px',
    height: '60px',
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #667eea',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  paymentDetails: {
    background: '#f8f9fa',
    padding: '1.5rem',
    borderRadius: '12px',
    marginBottom: '1.5rem',
    border: '2px solid #667eea',
  },
  detailsTitle: {
    margin: '0 0 1rem 0',
    color: '#333',
    fontSize: '1.1rem',
  },
  detailRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '0.8rem',
    alignItems: 'center',
  },
  label: {
    color: '#666',
    fontWeight: '500',
  },
  value: {
    color: '#333',
    fontWeight: 'bold',
  },
  amountValue: {
    color: '#667eea',
    fontWeight: 'bold',
    fontSize: '1.3rem',
  },
  instructions: {
    background: '#e8f4f8',
    padding: '1rem',
    borderRadius: '8px',
    marginBottom: '1rem',
  },
  instructionText: {
    margin: '0.5rem 0',
    color: '#28a745',
    fontWeight: '500',
  },
  appIcons: {
    textAlign: 'center',
    padding: '1rem',
    background: '#fff9e6',
    borderRadius: '8px',
    marginBottom: '1rem',
  },
  appIcon: {
    fontSize: '2rem',
    display: 'block',
    marginBottom: '0.5rem',
  },
  appText: {
    color: '#666',
    fontSize: '0.9rem',
  },
  troubleshoot: {
    background: '#fff3cd',
    padding: '1rem',
    borderRadius: '8px',
    border: '2px solid #ffc107',
    marginTop: '1rem',
  },
  troubleshootTitle: {
    fontWeight: 'bold',
    color: '#856404',
    marginBottom: '0.8rem',
  },
  manualSteps: {
    color: '#856404',
    fontSize: '0.9rem',
  },
  footer: {
    padding: '1rem 2rem 2rem',
  },
  qrSection: {
    textAlign: 'center',
    padding: '1.5rem',
    background: 'white',
    borderRadius: '12px',
    marginBottom: '1rem',
    border: '2px solid #667eea',
  },
  qrTitle: {
    margin: '0 0 1rem 0',
    color: '#333',
    fontSize: '1.1rem',
  },
  qrImage: {
    width: '250px',
    height: '250px',
    border: '4px solid #667eea',
    borderRadius: '8px',
    padding: '10px',
    background: 'white',
  },
  qrInstruction: {
    marginTop: '1rem',
    color: '#666',
    fontSize: '0.9rem',
  },
  divider: {
    textAlign: 'center',
    margin: '1.5rem 0',
    position: 'relative',
  },
  dividerText: {
    background: 'white',
    padding: '0 1rem',
    color: '#999',
    fontWeight: 'bold',
    position: 'relative',
    zIndex: 1,
  },
  verificationSection: {
    marginBottom: '1rem',
  },
  verificationTitle: {
    fontWeight: 'bold',
    marginBottom: '0.5rem',
    color: '#333',
  },
  transactionInput: {
    width: '100%',
    padding: '0.8rem',
    border: '2px solid #667eea',
    borderRadius: '8px',
    fontSize: '1rem',
    marginBottom: '1rem',
  },
  verifyBtn: {
    width: '100%',
    padding: '1rem',
    background: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '1rem',
    marginBottom: '0.5rem',
  },
  skipBtn: {
    width: '100%',
    padding: '0.8rem',
    background: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.9rem',
  },
  verifyingState: {
    textAlign: 'center',
    padding: '2rem',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #667eea',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    margin: '0 auto 1rem',
  },
  successState: {
    textAlign: 'center',
    padding: '2rem',
  },
  successIcon: {
    fontSize: '4rem',
    marginBottom: '1rem',
  },
  successText: {
    fontSize: '1.2rem',
    color: '#28a745',
    fontWeight: 'bold',
  },
};

// Add keyframe animations
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;
document.head.appendChild(styleSheet);

export default UpiPaymentModal;
