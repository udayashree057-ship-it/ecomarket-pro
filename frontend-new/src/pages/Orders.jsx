import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { ordersAPI } from '../services/api';

const Orders = () => {
  const { orders, currentUser, loadOrdersFromBackend } = useApp();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('buyer'); // 'buyer' or 'seller'

  // Filter orders based on view mode
  const userOrders = viewMode === 'buyer' 
    ? orders.filter(o => o.buyerEmail === currentUser?.email)
    : orders.filter(o => o.items?.some(item => item.sellerEmail === currentUser?.email));

  const openUpiApp = (sellerUpiId, amount, orderId) => {
    const upiUrl = `upi://pay?pa=${sellerUpiId}&pn=EcoMarket&am=${amount}&cu=INR&tn=Order ${orderId}`;
    window.location.href = upiUrl;
    
    setTimeout(() => {
      alert(`If your UPI app didn't open:\n\n1. Open any UPI app\n2. Pay to: ${sellerUpiId}\n3. Amount: ₹${amount}\n4. Reference: Order ${orderId}`);
    }, 2000);
  };

  const handlePayNow = (order) => {
    const orderId = order._id || order.id;
    const sellerUpi = order.items[0]?.sellerPaymentDetails?.upi?.upiId;
    if (sellerUpi) {
      openUpiApp(sellerUpi, order.total.toFixed(2), orderId);
    } else {
      alert('Seller UPI details not available');
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await ordersAPI.update(orderId, { status: newStatus });
      await loadOrdersFromBackend();
      alert('Order status updated successfully!');
    } catch (error) {
      alert('Failed to update order status: ' + error.message);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#ffc107',
      awaiting_payment: '#ff9800',
      paid: '#28a745',
      confirmed: '#17a2b8',
      shipped: '#007bff',
      delivered: '#28a745',
    };
    return colors[status] || '#6c757d';
  };

  return (
    <div>
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <h2>📦 Orders</h2>
          <div style={styles.toggleContainer}>
            <button
              onClick={() => setViewMode('buyer')}
              style={{
                ...styles.toggleBtn,
                background: viewMode === 'buyer' ? '#667eea' : '#f0f0f0',
                color: viewMode === 'buyer' ? 'white' : '#333',
              }}
            >
              🛒 My Purchases
            </button>
            <button
              onClick={() => setViewMode('seller')}
              style={{
                ...styles.toggleBtn,
                background: viewMode === 'seller' ? '#667eea' : '#f0f0f0',
                color: viewMode === 'seller' ? 'white' : '#333',
              }}
            >
              🏪 My Sales
            </button>
          </div>
        </div>
        <button onClick={() => navigate('/')} style={styles.backBtn}>
          ← Back
        </button>
      </div>

      <div style={styles.container}>
        {userOrders.length === 0 ? (
          <div style={styles.empty}>
            <div style={styles.emptyIcon}>📦</div>
            <div>No orders yet</div>
          </div>
        ) : (
          userOrders.map(order => {
            const orderId = order._id || order.id;
            return (
              <div key={orderId} style={styles.orderCard}>
                <div style={styles.orderHeader}>
                  <h4>Order #{orderId.slice(-8)}</h4>
                  <span 
                    style={{
                      ...styles.statusBadge,
                      background: getStatusColor(order.status),
                    }}
                  >
                    {order.status}
                  </span>
                </div>
                <p style={styles.date}>
                  {new Date(order.date || order.createdAt).toLocaleDateString()}
                </p>
                
                {viewMode === 'buyer' && order.buyerName && (
                  <p style={styles.buyerInfo}>Buyer: {order.buyerName}</p>
                )}
                
                <div style={styles.items}>
                  {order.items.map((item, idx) => {
                    const itemId = item._id || item.id || idx;
                    // For seller view, only show items they're selling
                    if (viewMode === 'seller' && item.sellerEmail !== currentUser?.email) {
                      return null;
                    }
                    
                    return (
                      <div key={itemId} style={styles.itemWrapper}>
                        <div style={styles.item}>
                          <span>{item.name}</span>
                          <span>x{item.quantity}</span>
                          <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                        {viewMode === 'buyer' && item.sellerPaymentDetails && (
                          <div style={styles.sellerPayment}>
                            <small style={styles.sellerLabel}>Seller: {item.sellerName}</small>
                            {item.sellerPaymentDetails.upi?.upiId && (
                              <small>UPI: {item.sellerPaymentDetails.upi.upiId}</small>
                            )}
                            {item.sellerPaymentDetails.bank?.accountNumber && (
                              <small>Bank: {item.sellerPaymentDetails.bank.bankName} - {item.sellerPaymentDetails.bank.accountNumber}</small>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  }).filter(Boolean)}
              </div>
              <div style={styles.total}>
                <strong>Total:</strong>
                <strong style={styles.totalAmount}>₹{order.total.toFixed(2)}</strong>
              </div>
              <div style={styles.orderInfo}>
                <div style={styles.status}>
                  Status: <span style={styles.statusBadge}>{order.status}</span>
                </div>
                <div style={styles.paymentInfo}>
                  Payment: <strong>{order.paymentMethod?.toUpperCase() || 'COD'}</strong>
                </div>
                {order.deliveryAddress && (
                  <div style={styles.addressInfo}>
                    <strong>Delivery Address:</strong>
                    <p>{order.deliveryAddress}</p>
                  </div>
                )}
                {viewMode === 'buyer' && order.paymentMethod === 'upi' && order.status === 'awaiting_payment' && (
                  <button onClick={() => handlePayNow(order)} style={styles.payNowBtn}>
                    📱 Pay Now via UPI
                  </button>
                )}
                
                {/* Seller Actions */}
                {viewMode === 'seller' && (
                  <div style={styles.sellerActions}>
                    <h4 style={styles.actionsTitle}>Order Actions:</h4>
                    <div style={styles.actionButtons}>
                      {order.status === 'paid' && (
                        <button 
                          onClick={() => updateOrderStatus(orderId, 'confirmed')}
                          style={{...styles.actionBtn, background: '#17a2b8'}}
                        >
                          ✅ Confirm Order
                        </button>
                      )}
                      {order.status === 'confirmed' && (
                        <button 
                          onClick={() => updateOrderStatus(orderId, 'shipped')}
                          style={{...styles.actionBtn, background: '#007bff'}}
                        >
                          🚚 Mark as Shipped
                        </button>
                      )}
                      {order.status === 'shipped' && (
                        <button 
                          onClick={() => updateOrderStatus(orderId, 'delivered')}
                          style={{...styles.actionBtn, background: '#28a745'}}
                        >
                          📦 Mark as Delivered
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
            );
          })
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
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '2rem',
  },
  toggleContainer: {
    display: 'flex',
    gap: '0.5rem',
    background: '#f0f0f0',
    padding: '4px',
    borderRadius: '8px',
  },
  toggleBtn: {
    padding: '8px 16px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '500',
    transition: 'all 0.3s ease',
  },
  backBtn: {
    padding: '8px 16px',
    background: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  container: {
    padding: '2rem',
    maxWidth: '1000px',
    margin: '0 auto',
  },
  empty: {
    textAlign: 'center',
    padding: '3rem',
    color: '#999',
  },
  emptyIcon: {
    fontSize: '3rem',
    marginBottom: '1rem',
  },
  orderCard: {
    background: '#f9f9f9',
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '1.5rem',
    marginBottom: '1.5rem',
  },
  orderHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.5rem',
  },
  date: {
    color: '#666',
    fontSize: '0.9rem',
  },
  buyerInfo: {
    color: '#667eea',
    fontWeight: 'bold',
    marginTop: '0.5rem',
  },
  items: {
    margin: '1rem 0',
  },
  itemWrapper: {
    marginBottom: '1rem',
  },
  item: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0.5rem 0',
    borderBottom: '1px solid #eee',
  },
  sellerPayment: {
    background: '#f8f9fa',
    padding: '0.5rem',
    borderRadius: '4px',
    marginTop: '0.3rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.2rem',
  },
  sellerLabel: {
    fontWeight: 'bold',
    color: '#667eea',
  },
  total: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '1rem',
    paddingTop: '1rem',
    borderTop: '2px solid #ddd',
  },
  totalAmount: {
    color: '#667eea',
    fontSize: '1.2rem',
  },
  orderInfo: {
    marginTop: '1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.8rem',
  },
  status: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  statusBadge: {
    background: '#667eea',
    color: 'white',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '0.85rem',
    fontWeight: 'bold',
  },
  paymentInfo: {
    color: '#555',
  },
  addressInfo: {
    background: '#f8f9fa',
    padding: '0.8rem',
    borderRadius: '4px',
  },
  payNowBtn: {
    marginTop: '1rem',
    padding: '0.8rem 1.5rem',
    background: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '1rem',
    width: '100%',
  },
  sellerActions: {
    marginTop: '1.5rem',
    padding: '1rem',
    background: '#e8f4f8',
    borderRadius: '8px',
    border: '2px solid #17a2b8',
  },
  actionsTitle: {
    margin: '0 0 1rem 0',
    color: '#333',
    fontSize: '1rem',
  },
  actionButtons: {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap',
  },
  actionBtn: {
    padding: '0.8rem 1.2rem',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '0.9rem',
    transition: 'all 0.3s ease',
  },
};

export default Orders;
