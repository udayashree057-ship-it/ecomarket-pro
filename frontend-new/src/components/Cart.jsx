import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import UpiPaymentModal from './UpiPaymentModal';

const Cart = ({ onClose }) => {
  const { cart, removeFromCart, updateCartQuantity, addOrder, setCart, currentUser } = useApp();
  const navigate = useNavigate();
  const [showCheckout, setShowCheckout] = useState(false);
  const [showUpiModal, setShowUpiModal] = useState(false);
  const [upiPaymentDetails, setUpiPaymentDetails] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [deliveryAddress, setDeliveryAddress] = useState(currentUser?.address || '');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    holder: '',
    expiry: '',
    cvv: '',
  });
  const [upiId, setUpiId] = useState('');

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.18;
  const total = subtotal + tax;

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('Cart is empty');
      return;
    }
    setShowCheckout(true);
  };

  const openUpiApp = (sellerUpiId, amount, orderId) => {
    // Generate UPI payment URL with proper encoding
    const upiUrl = `upi://pay?pa=${encodeURIComponent(sellerUpiId)}&pn=${encodeURIComponent('EcoMarket')}&am=${encodeURIComponent(amount)}&cu=INR&tn=${encodeURIComponent('Order ' + orderId)}`;
    
    console.log('Opening UPI app with URL:', upiUrl);
    
    // Method 1: Try window.location (works on most mobile browsers)
    window.location.href = upiUrl;
    
    // Method 2: Try creating a hidden link and clicking it (better for some browsers)
    const link = document.createElement('a');
    link.href = upiUrl;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Method 3: Try window.open as fallback
    setTimeout(() => {
      try {
        window.open(upiUrl, '_blank');
      } catch (e) {
        console.log('window.open failed:', e);
      }
    }, 100);
    
    // Show instructions after delay
    setTimeout(() => {
      const userConfirm = confirm(
        `UPI Payment Request Sent!\n\n` +
        `✓ Check your UPI app for payment notification\n` +
        `✓ Pay to: ${sellerUpiId}\n` +
        `✓ Amount: ₹${amount}\n` +
        `✓ Order ID: ${orderId}\n\n` +
        `Click OK if your UPI app opened, or CANCEL for manual instructions.`
      );
      
      if (!userConfirm) {
        alert(
          `Manual Payment Instructions:\n\n` +
          `1. Open any UPI app (GPay, PhonePe, Paytm, BHIM)\n` +
          `2. Go to "Send Money" or "Pay"\n` +
          `3. Enter UPI ID: ${sellerUpiId}\n` +
          `4. Enter Amount: ₹${amount}\n` +
          `5. Add Note: Order ${orderId}\n` +
          `6. Complete payment with your UPI PIN`
        );
      }
    }, 1500);
  };

  const handlePlaceOrder = async () => {
    if (!deliveryAddress.trim()) {
      alert('Please enter delivery address');
      return;
    }

    if (paymentMethod === 'card') {
      if (!cardDetails.number || !cardDetails.holder || !cardDetails.expiry || !cardDetails.cvv) {
        alert('Please fill all card details');
        return;
      }
    } else if (paymentMethod === 'upi') {
      if (!upiId.trim()) {
        alert('Please enter your UPI ID for payment confirmation');
        return;
      }
    }

    // Get seller payment details for each product
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const orderItems = cart.map(item => {
      const seller = users.find(u => u.email === item.sellerEmail);
      return {
        ...item,
        sellerPaymentDetails: seller?.paymentDetails || null,
      };
    });

    // Check if seller has UPI details for UPI payment
    if (paymentMethod === 'upi') {
      const firstSellerUpi = orderItems[0]?.sellerPaymentDetails?.upi?.upiId;
      if (!firstSellerUpi) {
        alert('Seller has not set up UPI payment. Please choose another payment method.');
        return;
      }
    }

    // Don't include id field - MongoDB will auto-generate _id
    const order = {
      items: orderItems,
      total,
      date: new Date().toISOString(),
      status: paymentMethod === 'cod' ? 'pending' : paymentMethod === 'upi' ? 'awaiting_payment' : 'paid',
      paymentMethod,
      deliveryAddress,
      buyerEmail: currentUser.email,
      buyerName: currentUser.name,
      buyerUpiId: paymentMethod === 'upi' ? upiId : null,
    };

    const result = await addOrder(order);
    if (!result.success) {
      alert('Failed to create order: ' + result.message);
      return;
    }
    
    // Get the created order ID (from MongoDB _id or localStorage id)
    const createdOrderId = result.order?._id || result.order?.id || Date.now().toString();
    
    setCart([]);
    
    // Handle UPI payment
    if (paymentMethod === 'upi') {
      const sellerUpiId = orderItems[0].sellerPaymentDetails.upi.upiId;
      
      // Show UPI payment modal
      setUpiPaymentDetails({
        sellerUpiId,
        amount: total.toFixed(2),
        orderId: createdOrderId,
      });
      setShowUpiModal(true);
      
      // Trigger UPI app opening
      setTimeout(() => {
        openUpiApp(sellerUpiId, total.toFixed(2), createdOrderId);
      }, 500);
      
      // Don't close cart yet - let user close after payment
    } else if (paymentMethod === 'card') {
      alert('Order placed successfully! Payment processed.');
      onClose();
      navigate('/orders');
    } else {
      alert('Order placed successfully! Pay cash on delivery.');
      onClose();
      navigate('/orders');
    }
  };

  const handleUpiModalClose = () => {
    setShowUpiModal(false);
    onClose();
    navigate('/orders');
  };

  const handlePaymentVerified = (verifiedOrder) => {
    console.log('Payment verified:', verifiedOrder);
    // Optionally update order status in local state
  };

  return (
    <>
      {showUpiModal && upiPaymentDetails && (
        <UpiPaymentModal
          isOpen={showUpiModal}
          onClose={handleUpiModalClose}
          sellerUpiId={upiPaymentDetails.sellerUpiId}
          amount={upiPaymentDetails.amount}
          orderId={upiPaymentDetails.orderId}
          onPaymentVerified={handlePaymentVerified}
        />
      )}

      {showCheckout ? (
        <div style={styles.overlay} onClick={onClose}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <span style={styles.close} onClick={onClose}>&times;</span>
            <h2 style={styles.title}>💳 Checkout</h2>
          
          <div style={styles.checkoutForm}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Delivery Address *</label>
              <textarea
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                style={styles.textarea}
                placeholder="Enter your delivery address"
                rows="3"
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Payment Method *</label>
              <div style={styles.paymentMethods}>
                <label style={styles.radioLabel}>
                  <input
                    type="radio"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  💵 Cash on Delivery
                </label>
                <label style={styles.radioLabel}>
                  <input
                    type="radio"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  💳 Credit/Debit Card
                </label>
                <label style={styles.radioLabel}>
                  <input
                    type="radio"
                    value="upi"
                    checked={paymentMethod === 'upi'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  📱 UPI
                </label>
              </div>
            </div>

            {paymentMethod === 'card' && (
              <div style={styles.cardForm}>
                <input
                  type="text"
                  placeholder="Card Number"
                  value={cardDetails.number}
                  onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                  style={styles.input}
                  maxLength="16"
                />
                <input
                  type="text"
                  placeholder="Card Holder Name"
                  value={cardDetails.holder}
                  onChange={(e) => setCardDetails({ ...cardDetails, holder: e.target.value })}
                  style={styles.input}
                />
                <div style={styles.cardRow}>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={cardDetails.expiry}
                    onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                    style={styles.input}
                    maxLength="5"
                  />
                  <input
                    type="text"
                    placeholder="CVV"
                    value={cardDetails.cvv}
                    onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                    style={styles.input}
                    maxLength="3"
                  />
                </div>
              </div>
            )}

            {paymentMethod === 'upi' && (
              <div style={styles.upiForm}>
                {(() => {
                  const users = JSON.parse(localStorage.getItem('users')) || [];
                  const firstItem = cart[0];
                  const seller = firstItem ? users.find(u => u.email === firstItem.sellerEmail) : null;
                  const sellerUpi = seller?.paymentDetails?.upi?.upiId;
                  
                  return sellerUpi ? (
                    <div style={styles.sellerUpiInfo}>
                      <p style={styles.sellerUpiLabel}>💰 You will pay to seller's UPI:</p>
                      <p style={styles.sellerUpiId}>{sellerUpi}</p>
                      <p style={styles.sellerUpiName}>({seller.paymentDetails.upi.name})</p>
                      <p style={styles.upiNote}>
                        ✓ Your UPI app will open automatically after placing the order
                      </p>
                    </div>
                  ) : (
                    <div style={styles.errorBox}>
                      ⚠️ Seller has not set up UPI payment. Please choose another payment method.
                    </div>
                  );
                })()}
                <input
                  type="text"
                  placeholder="Your UPI ID (for confirmation)"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  style={styles.input}
                />
              </div>
            )}

            <div style={styles.summary}>
              <div style={styles.summaryRow}>
                <span>Subtotal:</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div style={styles.summaryRow}>
                <span>Tax (18%):</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>
              <div style={styles.totalRow}>
                <h3>Total:</h3>
                <h3 style={styles.totalAmount}>₹{total.toFixed(2)}</h3>
              </div>
            </div>

            <div style={styles.actions}>
              <button onClick={() => setShowCheckout(false)} style={styles.continueBtn}>
                ← Back to Cart
              </button>
              <button onClick={handlePlaceOrder} style={styles.checkoutBtn}>
                Place Order
              </button>
            </div>
          </div>
        </div>
      </div>
      ) : (
        <div style={styles.overlay} onClick={onClose}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <span style={styles.close} onClick={onClose}>&times;</span>
            <h2 style={styles.title}>🛒 Shopping Cart</h2>
        
        <div style={styles.items}>
          {cart.length === 0 ? (
            <p style={styles.empty}>Your cart is empty</p>
          ) : (
            cart.map(item => {
              const itemId = item._id || item.id;
              return (
                <div key={itemId} style={styles.item}>
                  <img src={item.image} alt={item.name} style={styles.itemImage} />
                  <div style={styles.itemInfo}>
                    <div style={styles.itemName}>{item.name}</div>
                    <div style={styles.itemPrice}>₹{item.price}</div>
                  </div>
                  <div style={styles.quantity}>
                    <button
                      onClick={() => updateCartQuantity(itemId, item.quantity - 1)}
                      style={styles.qtyBtn}
                    >
                      -
                    </button>
                    <span style={styles.qtyText}>{item.quantity}</span>
                    <button
                      onClick={() => updateCartQuantity(itemId, item.quantity + 1)}
                      style={styles.qtyBtn}
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart(itemId)}
                    style={styles.removeBtn}
                  >
                    🗑️
                  </button>
                </div>
              );
            })
          )}
        </div>

        <div style={styles.summary}>
          <div style={styles.summaryRow}>
            <span>Subtotal:</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>
          <div style={styles.summaryRow}>
            <span>Tax (18%):</span>
            <span>₹{tax.toFixed(2)}</span>
          </div>
          <div style={styles.totalRow}>
            <h3>Total:</h3>
            <h3 style={styles.totalAmount}>₹{total.toFixed(2)}</h3>
          </div>
        </div>

        <div style={styles.actions}>
          <button onClick={onClose} style={styles.continueBtn}>
            Continue Shopping
          </button>
          <button onClick={handleCheckout} style={styles.checkoutBtn}>
            Proceed to Checkout
          </button>
        </div>
      </div>
      </div>
      )}
    </>
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
    borderRadius: '8px',
    maxWidth: '600px',
    width: '90%',
    maxHeight: '80vh',
    overflow: 'auto',
    padding: '2rem',
    position: 'relative',
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
    paddingBottom: '15px',
    borderBottom: '2px solid #667eea',
    marginBottom: '20px',
  },
  items: {
    marginBottom: '20px',
  },
  empty: {
    textAlign: 'center',
    color: '#999',
    padding: '2rem',
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1rem',
    borderBottom: '1px solid #eee',
  },
  itemImage: {
    width: '60px',
    height: '60px',
    objectFit: 'cover',
    borderRadius: '4px',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontWeight: 'bold',
  },
  itemPrice: {
    color: '#667eea',
  },
  quantity: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  qtyBtn: {
    width: '30px',
    height: '30px',
    border: '1px solid #ddd',
    background: 'white',
    cursor: 'pointer',
    borderRadius: '4px',
  },
  qtyText: {
    minWidth: '30px',
    textAlign: 'center',
  },
  removeBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1.2rem',
  },
  summary: {
    padding: '20px',
    background: '#f9f9f9',
    borderRadius: '8px',
    marginTop: '20px',
    border: '2px solid #667eea',
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '15px',
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingTop: '15px',
    borderTop: '2px solid #ddd',
  },
  totalAmount: {
    color: '#667eea',
    fontSize: '1.5rem',
  },
  actions: {
    display: 'flex',
    gap: '10px',
    marginTop: '20px',
  },
  continueBtn: {
    flex: 1,
    padding: '12px',
    background: '#f0f0f0',
    color: '#333',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  checkoutBtn: {
    flex: 1,
    padding: '12px',
    background: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  checkoutForm: {
    marginBottom: '20px',
  },
  formGroup: {
    marginBottom: '1.5rem',
  },
  label: {
    display: 'block',
    fontWeight: 'bold',
    marginBottom: '0.5rem',
    color: '#333',
  },
  textarea: {
    width: '100%',
    padding: '0.8rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '0.95rem',
    fontFamily: 'inherit',
  },
  input: {
    width: '100%',
    padding: '0.8rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '0.95rem',
    marginBottom: '0.8rem',
  },
  paymentMethods: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.8rem',
  },
  radioLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.8rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  cardForm: {
    marginBottom: '1rem',
  },
  cardRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '0.8rem',
  },
  upiForm: {
    marginBottom: '1rem',
  },
  sellerUpiInfo: {
    background: '#e8f4f8',
    padding: '1rem',
    borderRadius: '8px',
    marginBottom: '1rem',
    border: '2px solid #17a2b8',
  },
  sellerUpiLabel: {
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '0.5rem',
  },
  sellerUpiId: {
    fontSize: '1.2rem',
    color: '#667eea',
    fontWeight: 'bold',
    margin: '0.5rem 0',
  },
  sellerUpiName: {
    color: '#666',
    fontSize: '0.9rem',
    marginBottom: '0.5rem',
  },
  upiNote: {
    color: '#28a745',
    fontSize: '0.85rem',
    marginTop: '0.5rem',
    fontWeight: '500',
  },
  errorBox: {
    background: '#fff3cd',
    border: '2px solid #ffc107',
    padding: '1rem',
    borderRadius: '8px',
    color: '#856404',
    marginBottom: '1rem',
    fontWeight: '500',
  },
};

export default Cart;
