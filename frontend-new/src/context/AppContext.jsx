import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, productsAPI, ordersAPI, customersAPI } from '../services/api';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentRole, setCurrentRole] = useState(null);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [language, setLanguage] = useState('en');
  const [loading, setLoading] = useState(true);
  const [useBackend, setUseBackend] = useState(true); // Toggle for backend/localStorage

  // Load initial data
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Check if user is logged in
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('currentUser');
        
        if (token && storedUser) {
          setCurrentUser(JSON.parse(storedUser));
          
          if (useBackend) {
            // Load data from backend
            await loadProductsFromBackend();
            await loadOrdersFromBackend();
            await loadCustomersFromBackend();
          }
        }
        
        // Load cart from localStorage (always local)
        const storedCart = localStorage.getItem('cart');
        if (storedCart) setCart(JSON.parse(storedCart));
        
        // If not using backend, load from localStorage
        if (!useBackend) {
          const storedProducts = localStorage.getItem('products');
          const storedOrders = localStorage.getItem('orders');
          const storedCustomers = localStorage.getItem('customers');
          
          if (storedProducts) setProducts(JSON.parse(storedProducts));
          if (storedOrders) setOrders(JSON.parse(storedOrders));
          if (storedCustomers) setCustomers(JSON.parse(storedCustomers));
        }
      } catch (error) {
        console.error('Error initializing app:', error);
        // Fallback to localStorage if backend fails
        setUseBackend(false);
      } finally {
        setLoading(false);
      }
    };

    initializeApp();
  }, [useBackend]);

  // Load products from backend
  const loadProductsFromBackend = async () => {
    try {
      const data = await productsAPI.getAll();
      setProducts(data);
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };

  // Load orders from backend
  const loadOrdersFromBackend = async () => {
    try {
      const data = await ordersAPI.getAll();
      setOrders(data);
    } catch (error) {
      console.error('Error loading orders:', error);
    }
  };

  // Load customers from backend
  const loadCustomersFromBackend = async () => {
    try {
      const data = await customersAPI.getAll();
      setCustomers(data);
    } catch (error) {
      console.error('Error loading customers:', error);
    }
  };

  // Save cart to localStorage (always local)
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Fallback: Save to localStorage if not using backend
  useEffect(() => {
    if (!useBackend) {
      localStorage.setItem('products', JSON.stringify(products));
    }
  }, [products, useBackend]);

  useEffect(() => {
    if (!useBackend) {
      localStorage.setItem('orders', JSON.stringify(orders));
    }
  }, [orders, useBackend]);

  useEffect(() => {
    if (!useBackend) {
      localStorage.setItem('customers', JSON.stringify(customers));
    }
  }, [customers, useBackend]);

  const login = async (email, password) => {
    try {
      if (useBackend) {
        const data = await authAPI.login({ email, password });
        setCurrentUser(data.user);
        localStorage.setItem('token', data.token);
        localStorage.setItem('currentUser', JSON.stringify(data.user));
        
        // Load user's data
        await loadProductsFromBackend();
        await loadOrdersFromBackend();
        
        return { success: true };
      } else {
        // Fallback to localStorage
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
          setCurrentUser(user);
          localStorage.setItem('currentUser', JSON.stringify(user));
          return { success: true };
        }
        return { success: false, message: 'Invalid credentials' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: error.message || 'Login failed' };
    }
  };

  const register = async (userData) => {
    try {
      if (useBackend) {
        const data = await authAPI.register(userData);
        return { success: true, message: data.message };
      } else {
        // Fallback to localStorage
        const users = JSON.parse(localStorage.getItem('users')) || [];
        
        if (users.find(u => u.email === userData.email)) {
          return { success: false, message: 'Email already registered' };
        }

        users.push(userData);
        localStorage.setItem('users', JSON.stringify(users));
        return { success: true, message: 'Registration successful' };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, message: error.message || 'Registration failed' };
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setCurrentRole(null);
    setCart([]);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
  };

  const addToCart = (productId) => {
    // Find product by either _id (MongoDB) or id (localStorage)
    const product = products.find(p => (p._id || p.id) === productId);
    if (!product) {
      console.error('Product not found:', productId);
      return;
    }

    // Use a consistent ID for cart items
    const cartItemId = product._id || product.id;
    const existingItem = cart.find(item => (item._id || item.id) === cartItemId);
    
    if (existingItem) {
      setCart(cart.map(item => {
        const itemId = item._id || item.id;
        return itemId === cartItemId ? { ...item, quantity: item.quantity + 1 } : item;
      }));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => (item._id || item.id) !== productId));
  };

  const updateCartQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart(cart.map(item => {
        const itemId = item._id || item.id;
        return itemId === productId ? { ...item, quantity } : item;
      }));
    }
  };

  const addProduct = async (product) => {
    try {
      if (useBackend) {
        const newProduct = await productsAPI.create(product);
        setProducts([...products, newProduct]);
        return { success: true, product: newProduct };
      } else {
        // For localStorage, add id field
        const productWithId = { ...product, id: Date.now().toString() };
        setProducts([...products, productWithId]);
        return { success: true, product: productWithId };
      }
    } catch (error) {
      console.error('Error adding product:', error);
      return { success: false, message: error.message };
    }
  };

  const updateProduct = async (productId, updatedProduct) => {
    try {
      if (useBackend) {
        const updated = await productsAPI.update(productId, updatedProduct);
        setProducts(products.map(p => p._id === productId || p.id === productId ? updated : p));
        return { success: true };
      } else {
        setProducts(products.map(p => p.id === productId ? { ...p, ...updatedProduct } : p));
        return { success: true };
      }
    } catch (error) {
      console.error('Error updating product:', error);
      return { success: false, message: error.message };
    }
  };

  const deleteProduct = async (productId) => {
    try {
      if (useBackend) {
        await productsAPI.delete(productId);
        setProducts(products.filter(p => p._id !== productId && p.id !== productId));
        return { success: true };
      } else {
        setProducts(products.filter(p => p.id !== productId));
        return { success: true };
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      return { success: false, message: error.message };
    }
  };

  const addOrder = async (order) => {
    try {
      if (useBackend) {
        const newOrder = await ordersAPI.create(order);
        setOrders([...orders, newOrder]);
        return { success: true, order: newOrder };
      } else {
        // For localStorage, add id field
        const orderWithId = { ...order, id: Date.now().toString() };
        setOrders([...orders, orderWithId]);
        return { success: true, order: orderWithId };
      }
    } catch (error) {
      console.error('Error adding order:', error);
      return { success: false, message: error.message };
    }
  };

  const addCustomer = async (customer) => {
    try {
      if (useBackend) {
        const newCustomer = await customersAPI.create(customer);
        setCustomers([...customers, newCustomer]);
        return { success: true, customer: newCustomer };
      } else {
        setCustomers([...customers, customer]);
        return { success: true, customer };
      }
    } catch (error) {
      console.error('Error adding customer:', error);
      return { success: false, message: error.message };
    }
  };

  const updateUserProfile = async (updates) => {
    try {
      if (useBackend) {
        const token = localStorage.getItem('token');
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}/auth/profile`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(updates),
        });
        const updatedUser = await response.json();
        setCurrentUser(updatedUser);
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        return { success: true };
      } else {
        // Update in localStorage
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const userIndex = users.findIndex(u => u.email === currentUser.email);
        if (userIndex !== -1) {
          users[userIndex] = { ...users[userIndex], ...updates };
          localStorage.setItem('users', JSON.stringify(users));
          const updatedUser = users[userIndex];
          setCurrentUser(updatedUser);
          localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        }
        return { success: true };
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      return { success: false, message: error.message };
    }
  };

  const value = {
    currentUser,
    currentRole,
    setCurrentRole,
    products,
    cart,
    orders,
    customers,
    language,
    setLanguage,
    loading,
    useBackend,
    setUseBackend,
    login,
    register,
    logout,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    addProduct,
    updateProduct,
    deleteProduct,
    addOrder,
    addCustomer,
    updateUserProfile,
    setCart,
    loadProductsFromBackend,
    loadOrdersFromBackend,
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌱</div>
          <div>Loading EcoMarket...</div>
        </div>
      </div>
    );
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
