// Load environment variables
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
// Backend API only - no static file serving
// Frontend is served separately on port 5173 by Vite

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecomarket';
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// --- Database Schemas & Models ---

// User Schema
const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    phone: String,
    address: String,
    role: { type: String, enum: ['buyer', 'seller', 'renter'], default: 'buyer' },
    paymentDetails: {
        upi: {
            upiId: String,
            name: String
        },
        bank: {
            accountName: String,
            accountNumber: String,
            ifscCode: String,
            bankName: String
        }
    },
    createdAt: { type: Date, default: Date.now }
});

// Product Schema
const productSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: Number,
    originalPrice: Number,
    category: String,
    image: String,
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    sellerName: String,
    sellerEmail: String,
    sellerLocation: String,
    sellerRating: Number,
    ecoRating: Number,
    carbonFootprint: Number,
    manufacturer: String,
    manufacturerLocation: String,
    manufactureDate: String,
    expiryDate: String,
    usageInstructions: String,
    recyclingInfo: String,
    specifications: Object,
    stock: { type: Number, default: 10 },
    forRent: { type: Boolean, default: false },
    barcodeId: String,
    createdAt: { type: Date, default: Date.now }
});

// Customer Schema
const customerSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    address: String,
    createdAt: { type: Date, default: Date.now }
});

// Order Schema
const orderSchema = new mongoose.Schema({
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    buyerEmail: String,
    buyerUpiId: String,
    items: [{
        productId: String,
        name: String,
        price: Number,
        quantity: Number,
        image: String,
        sellerName: String,
        sellerEmail: String,
        sellerPaymentDetails: mongoose.Schema.Types.Mixed
    }],
    total: Number,
    paymentMethod: String,
    deliveryAddress: String,
    transactionId: String,
    paymentVerifiedAt: Date,
    status: { type: String, enum: ['pending', 'awaiting_payment', 'paid', 'confirmed', 'shipped', 'delivered'], default: 'pending' },
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const Product = mongoose.model('Product', productSchema);
const Customer = mongoose.model('Customer', customerSchema);
const Order = mongoose.model('Order', orderSchema);

// --- API Routes ---

// Health Check
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'EcoMarket API is running',
        timestamp: new Date().toISOString()
    });
});

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, email, password, phone, address, role } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashedPassword, phone, address, role });
        await user.save();
        const userResponse = user.toObject();
        delete userResponse.password;
        res.status(201).json({ message: 'User registered successfully', user: userResponse });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ error: 'User not found' });
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(401).json({ error: 'Invalid password' });
        const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
        const userResponse = user.toObject();
        delete userResponse.password;
        res.json({ token, user: userResponse });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get user profile
app.get('/api/auth/profile', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return res.status(401).json({ error: 'No token provided' });
        
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.userId).select('-password');
        if (!user) return res.status(404).json({ error: 'User not found' });
        
        res.json(user);
    } catch (err) {
        res.status(401).json({ error: 'Invalid token' });
    }
});

// Update user profile
app.put('/api/auth/profile', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return res.status(401).json({ error: 'No token provided' });
        
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findByIdAndUpdate(
            decoded.userId,
            { $set: req.body },
            { new: true }
        ).select('-password');
        
        res.json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Product Routes
app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find().populate('seller', 'name email');
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/products', async (req, res) => {
    try {
        const product = new Product(req.body);
        await product.save();
        res.status(201).json(product);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.get('/api/products/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('seller', 'name email');
        if (!product) return res.status(404).json({ error: 'Product not found' });
        res.json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/products/:id', async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(product);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.delete('/api/products/:id', async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: 'Product deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/products/barcode/:barcodeId', async (req, res) => {
    try {
        const product = await Product.findOne({ barcodeId: req.params.barcodeId });
        if (!product) return res.status(404).json({ error: 'Product not found' });
        res.json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Customer Routes
app.get('/api/customers', async (req, res) => {
    try {
        const customers = await Customer.find();
        res.json(customers);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/customers', async (req, res) => {
    try {
        const customer = new Customer(req.body);
        await customer.save();
        res.status(201).json(customer);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.put('/api/customers/:id', async (req, res) => {
    try {
        const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(customer);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Order Routes
app.get('/api/orders', async (req, res) => {
    try {
        const orders = await Order.find().populate('customer').populate('products');
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/orders', async (req, res) => {
    try {
        const order = new Order(req.body);
        await order.save();
        res.status(201).json(order);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.put('/api/orders/:id', async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(order);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Payment Verification Route
app.post('/api/payments/verify', async (req, res) => {
    try {
        const { orderId, transactionId, paymentMethod } = req.body;
        
        // In production, verify with payment gateway (Razorpay, PayU, etc.)
        // For now, we'll do basic validation
        
        if (!orderId || !transactionId) {
            return res.status(400).json({ error: 'Order ID and Transaction ID required' });
        }

        // Find and update order
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        // Update order status
        order.status = 'paid';
        order.transactionId = transactionId;
        order.paymentVerifiedAt = new Date();
        await order.save();

        res.json({ 
            success: true, 
            message: 'Payment verified successfully',
            order 
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Statistics Route
app.get('/api/statistics', async (req, res) => {
    try {
        const userCount = await User.countDocuments();
        const productCount = await Product.countDocuments();
        const orderCount = await Order.countDocuments();
        const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(5).populate('customer').populate('products');
        res.json({ userCount, productCount, orderCount, recentOrders });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// API-only backend - no catch-all route
// Frontend is served separately by Vite on port 5173

// Start server
app.listen(PORT, () => {
    console.log(`🚀 EcoMarket API Server running on port ${PORT}`);
    console.log(`📍 API URL: http://localhost:${PORT}`);
    console.log(`🔍 Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;
