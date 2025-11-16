# 🌱 EcoMarket - Sustainable E-Commerce Platform

A full-stack e-commerce platform for eco-friendly products with Buy/Sell/Rent functionality, built with React and Node.js.

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v14+)
- MongoDB (local or cloud)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd ecomarket
```

2. **Start MongoDB**
```bash
mongod
```

3. **Start Backend** (Terminal 1)
```bash
cd backend
npm install
npm run dev
# Runs on http://localhost:3001
```

4. **Start Frontend** (Terminal 2)
```bash
cd frontend-new
npm install
npm run dev
# Runs on http://localhost:5173
```

5. **Open Browser**
```
http://localhost:5173
```

---

## ✨ Features

### 🔐 Authentication
- User registration and login
- JWT token authentication
- Secure password hashing (bcrypt)
- Role-based access control

### 👥 Three User Roles
- **Buyer** - Browse and purchase products
- **Seller** - List and manage products
- **Renter** - Rent products temporarily

### 🛍️ Product Management
- Add/Edit/Delete products
- Image upload support
- Product categories
- Eco-rating (1-5 stars)
- Carbon footprint tracking
- Stock management
- Product details modal

### 🛒 Shopping Experience
- Product search and filters
- Shopping cart
- Add to cart from product details
- Checkout process
- Order placement

### 💳 Payment System
- UPI payment with QR code
- Payment verification
- Order tracking
- Payment status updates

### 📦 Order Management
- Order history
- Order status tracking
- Seller payment details
- Retry payment option

### 🌍 Multilingual Support
- English
- Hindi (हिंदी)
- Kannada (ಕನ್ನಡ)
- Language switcher in navbar

### 🤖 AI Features
- Voice Assistant - Voice commands for navigation
- Chatbot - AI-powered customer support

---

## 📁 Project Structure

```
ecomarket/
├── backend/                    # Node.js + Express + MongoDB
│   ├── server.js              # API server
│   └── package.json
│
├── frontend-new/              # React + Vite
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   │   ├── Cart.jsx
│   │   │   ├── Chatbot.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProductCard.jsx
│   │   │   ├── ProductDetailsModal.jsx
│   │   │   ├── UpiPaymentModal.jsx
│   │   │   └── VoiceAssistant.jsx
│   │   │
│   │   ├── context/          # State management
│   │   │   └── AppContext.jsx
│   │   │
│   │   ├── pages/            # Page components
│   │   │   ├── Auth.jsx
│   │   │   ├── Buyer.jsx
│   │   │   ├── Orders.jsx
│   │   │   ├── Renter.jsx
│   │   │   ├── RoleSelection.jsx
│   │   │   └── Seller.jsx
│   │   │
│   │   ├── services/         # API layer
│   │   │   └── api.js
│   │   │
│   │   ├── utils/            # Utilities
│   │   │   └── translations.js
│   │   │
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   └── package.json
│
├── QUICK_START.md            # Quick start guide
├── TROUBLESHOOTING.md        # Common issues
└── README.md                 # This file
```

---

## 🔧 Technology Stack

### Frontend
- **React 19** - UI framework
- **Vite** - Build tool
- **React Router** - Navigation
- **Context API** - State management
- **QRCode.js** - QR code generation
- **jsQR** - QR code scanning

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **Multer** - File uploads
- **CORS** - Cross-origin requests

---

## 📱 How to Use

### As a Buyer
1. Register/Login
2. Select "Buyer" role
3. Browse products
4. Click on product for details
5. Add to cart
6. Checkout
7. Complete payment
8. Track orders

### As a Seller
1. Register/Login
2. Select "Seller" role
3. Add payment details (UPI/Bank)
4. Add products with details
5. Manage inventory
6. View orders

### As a Renter
1. Register/Login
2. Select "Renter" role
3. Browse rental products
4. Search and filter
5. Rent products

---

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get profile
- `PUT /api/auth/profile` - Update profile

### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Create product
- `GET /api/products/:id` - Get product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Orders
- `GET /api/orders` - Get all orders
- `POST /api/orders` - Create order
- `PUT /api/orders/:id` - Update order

### Payments
- `POST /api/payments/verify` - Verify payment

---

## 🔐 Environment Variables

### Backend (`backend/.env`)
```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/ecomarket
JWT_SECRET=your-secret-key-change-in-production
```

### Frontend (`frontend-new/.env`)
```env
VITE_API_URL=http://localhost:3001/api
VITE_USE_BACKEND=true
```

---

## 🧪 Testing

### Test Backend
```bash
curl http://localhost:3001/api/health
```

### Test Frontend
1. Open http://localhost:5173
2. Register a new account
3. Login
4. Add products as seller
5. Browse as buyer
6. Place an order

---

## 📖 Documentation

### Getting Started
- **QUICK_START.md** - Local development setup
- **TROUBLESHOOTING.md** - Common issues and solutions

### Deployment
- **deploy.md** - Quick deploy (5 minutes)
- **DEPLOYMENT_QUICK_START.md** - Visual step-by-step guide
- **DEPLOYMENT_GUIDE.md** - Complete deployment guide
- **PRE_DEPLOYMENT_CHECKLIST.md** - Pre-deployment checklist

### Features
- **frontend-new/FEATURES.md** - Complete feature list
- **frontend-new/PRODUCT_DETAILS.md** - Product details modal
- **frontend-new/UPI_PAYMENT_GUIDE.md** - Payment integration

---

## 🚀 Deployment

### Deploy to Production (FREE - 5 Minutes)

**Quick Start**: Open `START_DEPLOYMENT.txt` or `deploy.md`

#### Three Simple Steps:

1. **Database** (MongoDB Atlas) - 2 min
   - Free 512MB cluster
   - https://mongodb.com/cloud/atlas

2. **Backend** (Render) - 2 min
   - Free 750 hours/month
   - https://render.com

3. **Frontend** (Vercel) - 1 min
   - Free 100GB bandwidth
   - https://vercel.com

**Total Cost**: $0/month on free tier

**Detailed Guides**:
- `deploy.md` - Ultra-quick guide (5 min)
- `DEPLOYMENT_QUICK_START.md` - Visual step-by-step
- `DEPLOYMENT_GUIDE.md` - Complete guide (30 min)
- `PRE_DEPLOYMENT_CHECKLIST.md` - Pre-flight checklist

---

## 🐛 Troubleshooting

**Backend shows login page?**
- Backend is API-only, use http://localhost:5173 for frontend

**Products not loading?**
- Check backend is running on port 3001
- Check MongoDB is running
- Check browser console for errors

**Payment not working?**
- Verify UPI ID format
- Check payment details saved
- Check order creation

See **TROUBLESHOOTING.md** for more help.

---

## 🎯 Key Features Implemented

✅ User authentication with JWT  
✅ Three user roles (Buyer/Seller/Renter)  
✅ Product management with images  
✅ Product details modal  
✅ Shopping cart and checkout  
✅ UPI payment with QR codes  
✅ Order tracking and history  
✅ Payment verification  
✅ Multilingual support (3 languages)  
✅ Voice assistant  
✅ AI chatbot  
✅ Responsive design  
✅ MongoDB database  
✅ RESTful API  

---

## 📄 License

Open source - Free to use for educational and commercial purposes.

---

## 🤝 Contributing

Contributions welcome! Please open an issue or submit a pull request.

---

**Built with ❤️ for sustainable e-commerce 🌱**

**Ready to use!** Start both servers and visit http://localhost:5173
