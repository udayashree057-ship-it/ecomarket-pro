import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const Seller = () => {
  const { addProduct, products, currentUser, deleteProduct, updateProduct, updateUserProfile } = useApp();
  const navigate = useNavigate();
  const [editingId, setEditingId] = useState(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentType, setPaymentType] = useState('upi');
  const [paymentDetails, setPaymentDetails] = useState({
    upi: currentUser?.paymentDetails?.upi || { upiId: '', name: '' },
    bank: currentUser?.paymentDetails?.bank || { accountName: '', accountNumber: '', ifscCode: '', bankName: '' },
  });
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    ecoRating: '',
    carbonFootprint: '',
    manufacturer: '',
    manufacturerLocation: '',
    manufactureDate: '',
    expiryDate: '',
    usageInstructions: '',
    recyclingInfo: '',
    forRent: false,
    image: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (editingId) {
      // Update existing product
      const updatedProduct = {
        ...formData,
        price: parseFloat(formData.price),
        ecoRating: parseInt(formData.ecoRating),
        carbonFootprint: parseFloat(formData.carbonFootprint),
      };
      const result = await updateProduct(editingId, updatedProduct);
      if (result.success) {
        alert('Product updated successfully!');
        setEditingId(null);
      } else {
        alert('Failed to update product: ' + result.message);
        return;
      }
    } else {
      // Add new product (don't include id, MongoDB will generate _id)
      const product = {
        ...formData,
        price: parseFloat(formData.price),
        ecoRating: parseInt(formData.ecoRating),
        carbonFootprint: parseFloat(formData.carbonFootprint),
        sellerName: currentUser.name,
        sellerEmail: currentUser.email,
        barcodeId: Date.now().toString(),
      };
      const result = await addProduct(product);
      if (result.success) {
        alert('Product added successfully!');
      } else {
        alert('Failed to add product: ' + result.message);
        return;
      }
    }
    
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      ecoRating: '',
      carbonFootprint: '',
      manufacturer: '',
      manufacturerLocation: '',
      manufactureDate: '',
      expiryDate: '',
      usageInstructions: '',
      recyclingInfo: '',
      forRent: false,
      image: '',
    });
  };

  const handleEdit = (product) => {
    const productId = product._id || product.id;
    setEditingId(productId);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      ecoRating: product.ecoRating.toString(),
      carbonFootprint: product.carbonFootprint.toString(),
      manufacturer: product.manufacturer || '',
      manufacturerLocation: product.manufacturerLocation || '',
      manufactureDate: product.manufactureDate || '',
      expiryDate: product.expiryDate || '',
      usageInstructions: product.usageInstructions || '',
      recyclingInfo: product.recyclingInfo || '',
      forRent: product.forRent || false,
      image: product.image || '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      ecoRating: '',
      carbonFootprint: '',
      manufacturer: '',
      manufacturerLocation: '',
      manufactureDate: '',
      expiryDate: '',
      usageInstructions: '',
      recyclingInfo: '',
      forRent: false,
      image: '',
    });
  };

  const savePaymentDetails = async () => {
    const result = await updateUserProfile({ paymentDetails });
    if (result.success) {
      alert('Payment details saved successfully!');
      setShowPaymentForm(false);
    } else {
      alert('Failed to save payment details: ' + result.message);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData({ ...formData, image: event.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const sellerProducts = products.filter(p => p.sellerEmail === currentUser?.email);

  // Helper to get product ID (handles both _id from MongoDB and id from localStorage)
  const getProductId = (product) => product._id || product.id;

  return (
    <div>
      <div style={styles.header}>
        <h2>🏪 Seller Dashboard</h2>
        <button onClick={() => navigate('/')} style={styles.backBtn}>
          ← Back
        </button>
      </div>

      <div style={styles.container}>
        <div style={styles.grid}>
          <div>
            {/* Payment Details Section */}
            <div style={styles.paymentSection}>
              <h3>💳 Payment Details</h3>
              <p style={styles.paymentInfo}>
                {currentUser?.paymentDetails?.upi?.upiId || currentUser?.paymentDetails?.bank?.accountNumber
                  ? '✅ Payment details saved'
                  : '⚠️ Add payment details to receive payments'}
              </p>
              <button onClick={() => setShowPaymentForm(!showPaymentForm)} style={styles.paymentBtn}>
                {showPaymentForm ? 'Hide Payment Form' : 'Manage Payment Details'}
              </button>

              {showPaymentForm && (
                <div style={styles.paymentForm}>
                  <div style={styles.paymentTabs}>
                    <button
                      onClick={() => setPaymentType('upi')}
                      style={{
                        ...styles.tabBtn,
                        background: paymentType === 'upi' ? '#667eea' : '#f0f0f0',
                        color: paymentType === 'upi' ? 'white' : '#333',
                      }}
                    >
                      📱 UPI
                    </button>
                    <button
                      onClick={() => setPaymentType('bank')}
                      style={{
                        ...styles.tabBtn,
                        background: paymentType === 'bank' ? '#667eea' : '#f0f0f0',
                        color: paymentType === 'bank' ? 'white' : '#333',
                      }}
                    >
                      🏦 Bank
                    </button>
                  </div>

                  {paymentType === 'upi' && (
                    <div style={styles.formFields}>
                      <input
                        type="text"
                        placeholder="UPI ID (e.g., yourname@upi)"
                        value={paymentDetails.upi.upiId}
                        onChange={(e) => setPaymentDetails({
                          ...paymentDetails,
                          upi: { ...paymentDetails.upi, upiId: e.target.value }
                        })}
                        style={styles.input}
                      />
                      <input
                        type="text"
                        placeholder="Account Holder Name"
                        value={paymentDetails.upi.name}
                        onChange={(e) => setPaymentDetails({
                          ...paymentDetails,
                          upi: { ...paymentDetails.upi, name: e.target.value }
                        })}
                        style={styles.input}
                      />
                    </div>
                  )}

                  {paymentType === 'bank' && (
                    <div style={styles.formFields}>
                      <input
                        type="text"
                        placeholder="Account Holder Name"
                        value={paymentDetails.bank.accountName}
                        onChange={(e) => setPaymentDetails({
                          ...paymentDetails,
                          bank: { ...paymentDetails.bank, accountName: e.target.value }
                        })}
                        style={styles.input}
                      />
                      <input
                        type="text"
                        placeholder="Account Number"
                        value={paymentDetails.bank.accountNumber}
                        onChange={(e) => setPaymentDetails({
                          ...paymentDetails,
                          bank: { ...paymentDetails.bank, accountNumber: e.target.value }
                        })}
                        style={styles.input}
                      />
                      <input
                        type="text"
                        placeholder="IFSC Code"
                        value={paymentDetails.bank.ifscCode}
                        onChange={(e) => setPaymentDetails({
                          ...paymentDetails,
                          bank: { ...paymentDetails.bank, ifscCode: e.target.value }
                        })}
                        style={styles.input}
                      />
                      <input
                        type="text"
                        placeholder="Bank Name"
                        value={paymentDetails.bank.bankName}
                        onChange={(e) => setPaymentDetails({
                          ...paymentDetails,
                          bank: { ...paymentDetails.bank, bankName: e.target.value }
                        })}
                        style={styles.input}
                      />
                    </div>
                  )}

                  <button onClick={savePaymentDetails} style={styles.savePaymentBtn}>
                    💾 Save Payment Details
                  </button>
                </div>
              )}
            </div>

            <div style={styles.formSection}>
              <h3>{editingId ? '✏️ Edit Product' : '📦 Add New Product'}</h3>
              <form onSubmit={handleSubmit} style={styles.form}>
                <input
                  type="text"
                  placeholder="Product Name *"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={styles.input}
                  required
                />
                <textarea
                  placeholder="Description *"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  style={styles.textarea}
                  required
                />
                <div style={styles.row}>
                  <input
                    type="number"
                    placeholder="Price (₹) *"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    style={styles.input}
                    required
                  />
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    style={styles.input}
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="plastic">Plastic</option>
                    <option value="wood">Wood</option>
                    <option value="steel">Steel</option>
                    <option value="electric">Electric</option>
                    <option value="bamboo">Bamboo</option>
                    <option value="metals">Metals</option>
                    <option value="food">Food</option>
                  </select>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={styles.input}
                />
                <div style={styles.row}>
                  <input
                    type="number"
                    placeholder="Eco Rating (1-5) *"
                    min="1"
                    max="5"
                    value={formData.ecoRating}
                    onChange={(e) => setFormData({ ...formData, ecoRating: e.target.value })}
                    style={styles.input}
                    required
                  />
                  <input
                    type="number"
                    placeholder="Carbon Footprint (kg) *"
                    step="0.01"
                    value={formData.carbonFootprint}
                    onChange={(e) => setFormData({ ...formData, carbonFootprint: e.target.value })}
                    style={styles.input}
                    required
                  />
                </div>
                <div style={styles.row}>
                  <input
                    type="text"
                    placeholder="Manufacturer *"
                    value={formData.manufacturer}
                    onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                    style={styles.input}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Location *"
                    value={formData.manufacturerLocation}
                    onChange={(e) => setFormData({ ...formData, manufacturerLocation: e.target.value })}
                    style={styles.input}
                    required
                  />
                </div>
                <label style={styles.checkbox}>
                  <input
                    type="checkbox"
                    checked={formData.forRent}
                    onChange={(e) => setFormData({ ...formData, forRent: e.target.checked })}
                  />
                  Available for Rent
                </label>
                <button type="submit" style={styles.submitBtn}>
                  {editingId ? '💾 Update Product' : '✨ Add Product'}
                </button>
                {editingId && (
                  <button type="button" onClick={handleCancelEdit} style={styles.cancelBtn}>
                    ❌ Cancel Edit
                  </button>
                )}
              </form>
            </div>
          </div>

          <div>
            <div style={styles.inventoryHeader}>
              <h3>📋 Your Inventory</h3>
              <span style={styles.badge}>{sellerProducts.length} products</span>
            </div>
            <div style={styles.productList}>
              {sellerProducts.length === 0 ? (
                <div style={styles.empty}>
                  <div style={styles.emptyIcon}>📦</div>
                  <div>No products added yet</div>
                </div>
              ) : (
                sellerProducts.map(p => (
                  <div key={getProductId(p)} style={styles.productCard}>
                    <img src={p.image} alt={p.name} style={styles.productImage} />
                    <div style={styles.productInfo}>
                      <div style={styles.productName}>{p.name}</div>
                      <div style={styles.productPrice}>₹{p.price}</div>
                      <div style={styles.productMeta}>
                        <span style={styles.productBadge}>{p.category}</span>
                        {p.forRent && <span style={styles.rentBadge}>For Rent</span>}
                      </div>
                      <div style={styles.productRating}>⭐ {p.ecoRating}/5</div>
                      <div style={styles.productActions}>
                        <button
                          onClick={() => handleEdit(p)}
                          style={styles.editBtn}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('Delete this product?')) {
                              deleteProduct(getProductId(p));
                            }
                          }}
                          style={styles.deleteBtn}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
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
  container: {
    background: 'white',
    margin: '2rem',
    padding: '2rem',
    borderRadius: '8px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '2rem',
  },
  formSection: {
    background: '#f8f9fa',
    padding: '1.5rem',
    borderRadius: '8px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  input: {
    padding: '0.8rem',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '0.95rem',
  },
  textarea: {
    padding: '0.8rem',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '0.95rem',
    minHeight: '80px',
  },
  row: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
  },
  checkbox: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  submitBtn: {
    padding: '1rem',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '1rem',
  },
  inventoryHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
  },
  badge: {
    background: '#667eea',
    color: 'white',
    padding: '0.4rem 0.8rem',
    borderRadius: '20px',
    fontSize: '0.9rem',
  },
  productList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '1.5rem',
    maxHeight: '600px',
    overflowY: 'auto',
  },
  empty: {
    textAlign: 'center',
    padding: '3rem',
    color: '#999',
    gridColumn: '1 / -1',
  },
  emptyIcon: {
    fontSize: '3rem',
    marginBottom: '1rem',
  },
  productCard: {
    background: 'white',
    border: '1px solid #e9ecef',
    borderRadius: '8px',
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: '180px',
    objectFit: 'cover',
  },
  productInfo: {
    padding: '1.2rem',
  },
  productName: {
    fontWeight: 'bold',
    marginBottom: '0.5rem',
  },
  productPrice: {
    color: '#667eea',
    fontSize: '1.2rem',
    fontWeight: 'bold',
    marginBottom: '0.8rem',
  },
  productMeta: {
    display: 'flex',
    gap: '0.5rem',
    marginBottom: '0.8rem',
  },
  productBadge: {
    background: '#e9ecef',
    padding: '0.3rem 0.6rem',
    borderRadius: '4px',
    fontSize: '0.85rem',
  },
  rentBadge: {
    background: '#d4edda',
    color: '#155724',
    padding: '0.3rem 0.6rem',
    borderRadius: '4px',
    fontSize: '0.85rem',
  },
  productRating: {
    color: '#ffc107',
    fontWeight: 'bold',
    marginBottom: '1rem',
  },
  productActions: {
    display: 'flex',
    gap: '0.5rem',
  },
  editBtn: {
    flex: 1,
    padding: '0.6rem',
    background: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  deleteBtn: {
    flex: 1,
    padding: '0.6rem',
    background: '#f8d7da',
    color: '#721c24',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  cancelBtn: {
    padding: '1rem',
    background: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '1rem',
    marginTop: '0.5rem',
  },
  paymentSection: {
    background: '#e8f4f8',
    padding: '1.5rem',
    borderRadius: '8px',
    marginBottom: '2rem',
    borderLeft: '4px solid #17a2b8',
  },
  paymentInfo: {
    margin: '0.5rem 0 1rem',
    color: '#555',
  },
  paymentBtn: {
    padding: '0.8rem 1.5rem',
    background: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  paymentForm: {
    marginTop: '1.5rem',
  },
  paymentTabs: {
    display: 'flex',
    gap: '0.5rem',
    marginBottom: '1rem',
  },
  tabBtn: {
    flex: 1,
    padding: '0.8rem',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  formFields: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.8rem',
    marginBottom: '1rem',
  },
  savePaymentBtn: {
    width: '100%',
    padding: '1rem',
    background: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
};

export default Seller;
