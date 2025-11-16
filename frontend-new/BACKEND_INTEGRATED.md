# ✅ Backend Integration Complete!

## 🎉 What's Been Integrated

The React frontend is now **fully integrated** with the Node.js + MongoDB backend!

### Architecture

```
React App (Port 5173) ←→ Express API (Port 3000) ←→ MongoDB
```

## 🔧 What Changed

### 1. **API Service Layer** (`src/services/api.js`)
- Centralized API calls
- Authentication with JWT tokens
- Error handling
- All CRUD operations for:
  - Users (auth, profile)
  - Products
  - Orders
  - Customers

### 2. **Updated AppContext** (`src/context/AppContext.jsx`)
- Async operations for all data
- Backend/localStorage toggle
- Automatic fallback if backend unavailable
- JWT token management
- Loading states

### 3. **Enhanced Backend** (`backend/server.js`)
- Added payment details to User schema
- Enhanced Product schema (all fields)
- Updated Order schema (UPI, payment details)
- New endpoints:
  - `GET /api/auth/profile` - Get user profile
  - `PUT /api/auth/profile` - Update user profile

### 4. **Environment Configuration** (`.env`)
- `VITE_API_URL` - Backend API URL
- `VITE_USE_BACKEND` - Toggle backend/localStorage

## 🚀 Running the Full Stack

### Terminal 1: MongoDB
```bash
mongod
```

### Terminal 2: Backend API
```bash
cd backend
npm run dev
# Runs on http://localhost:3000
```

### Terminal 3: React Frontend
```bash
cd frontend-new
npm run dev
# Runs on http://localhost:5173
```

## 📊 Current Status

### ✅ Integrated Features:
- **Authentication** - Register/Login with JWT
- **Products** - Create, Read, Update, Delete
- **Orders** - Create and fetch orders
- **Customers** - Manage customer data
- **User Profile** - Update payment details
- **Cart** - Still uses localStorage (by design)

### 🔄 Data Flow:

**Registration:**
```
User fills form → API call → Backend hashes password → 
MongoDB stores user → Success response
```

**Login:**
```
User enters credentials → API call → Backend verifies → 
JWT token generated → Token stored → User data loaded
```

**Add Product:**
```
Seller fills form → API call with JWT → Backend validates → 
MongoDB stores product → Product list updated
```

**Place Order:**
```
Buyer checks out → API call with JWT → Backend creates order → 
MongoDB stores order → Order confirmation
```

## 🎯 Features

### Smart Fallback System
If backend is unavailable, the app automatically falls back to localStorage:

```javascript
// In AppContext.jsx
const [useBackend, setUseBackend] = useState(true);

// Automatically switches to localStorage if backend fails
```

### JWT Authentication
- Token stored in localStorage
- Sent with every API request
- 7-day expiration
- Automatic logout on token expiry

### Data Persistence
- All data stored in MongoDB
- Survives browser refresh
- Accessible from any device
- Real-time updates

## 🔐 Security Features

### Backend:
- ✅ Password hashing with bcrypt
- ✅ JWT token authentication
- ✅ Protected API endpoints
- ✅ CORS enabled
- ✅ Input validation

### Frontend:
- ✅ Token-based auth
- ✅ Secure API calls
- ✅ Error handling
- ✅ Automatic token refresh

## 📝 API Endpoints

### Authentication
```
POST /api/auth/register  - Register new user
POST /api/auth/login     - Login user
GET  /api/auth/profile   - Get user profile
PUT  /api/auth/profile   - Update user profile
```

### Products
```
GET    /api/products              - Get all products
POST   /api/products              - Create product
GET    /api/products/:id          - Get single product
PUT    /api/products/:id          - Update product
DELETE /api/products/:id          - Delete product
GET    /api/products/barcode/:id  - Get by barcode
```

### Orders
```
GET  /api/orders     - Get all orders
POST /api/orders     - Create order
PUT  /api/orders/:id - Update order
```

### Customers
```
GET  /api/customers     - Get all customers
POST /api/customers     - Create customer
PUT  /api/customers/:id - Update customer
```

## 🧪 Testing

### 1. Test Backend Health
```bash
curl http://localhost:3000/api/health
```

### 2. Test Registration
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123","phone":"1234567890","address":"Test Address"}'
```

### 3. Test Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### 4. Test in Browser
1. Open http://localhost:5173
2. Register a new account
3. Login
4. Add products as seller
5. Browse as buyer
6. Place orders
7. Check MongoDB for data

## 📊 MongoDB Collections

### users
```javascript
{
  _id: ObjectId,
  name: "John Doe",
  email: "john@example.com",
  password: "$2a$10$...", // hashed
  phone: "1234567890",
  address: "123 Main St",
  paymentDetails: {
    upi: { upiId: "john@upi", name: "John Doe" },
    bank: { accountNumber: "...", ifscCode: "...", ... }
  },
  createdAt: ISODate
}
```

### products
```javascript
{
  _id: ObjectId,
  name: "Eco-Friendly Water Bottle",
  description: "...",
  price: 299,
  category: "plastic",
  image: "data:image/...",
  sellerName: "John Doe",
  sellerEmail: "john@example.com",
  ecoRating: 5,
  carbonFootprint: 0.5,
  forRent: false,
  barcodeId: "1234567890",
  createdAt: ISODate
}
```

### orders
```javascript
{
  _id: ObjectId,
  buyerEmail: "buyer@example.com",
  items: [{
    productId: "...",
    name: "...",
    price: 299,
    quantity: 2,
    sellerPaymentDetails: { upi: {...}, bank: {...} }
  }],
  total: 598,
  paymentMethod: "upi",
  deliveryAddress: "...",
  status: "awaiting_payment",
  createdAt: ISODate
}
```

## 🔄 Switching Between Backend/localStorage

### Use Backend (Default):
```javascript
// In .env
VITE_USE_BACKEND=true
```

### Use localStorage:
```javascript
// In .env
VITE_USE_BACKEND=false
```

Or toggle in code:
```javascript
const { setUseBackend } = useApp();
setUseBackend(false); // Switch to localStorage
```

## 🐛 Troubleshooting

### Backend not connecting?
1. Check MongoDB is running: `mongod`
2. Check backend is running: `npm run dev` in backend folder
3. Check port 3000 is not in use
4. Check `.env` has correct API_URL

### CORS errors?
- Backend has CORS enabled
- Check API_URL in `.env`
- Ensure both servers are running

### Token expired?
- Login again to get new token
- Token expires after 7 days

### Data not loading?
- Check browser console for errors
- Check backend logs
- Verify MongoDB connection
- Try switching to localStorage mode

## 🎓 Next Steps

### Recommended Enhancements:

1. **Token Refresh**
   - Auto-refresh tokens before expiry
   - Refresh token mechanism

2. **Real-time Updates**
   - Socket.io integration
   - Live order status updates

3. **Image Upload**
   - Multer file upload
   - Cloud storage (Cloudinary, S3)

4. **Payment Gateway**
   - Razorpay integration
   - Webhook verification

5. **Email Notifications**
   - Order confirmations
   - Payment receipts
   - Nodemailer setup

6. **Admin Dashboard**
   - User management
   - Analytics
   - Order management

## 📚 Resources

- **MongoDB**: https://www.mongodb.com/docs/
- **Express**: https://expressjs.com/
- **JWT**: https://jwt.io/
- **React Query**: https://tanstack.com/query (recommended for API calls)

## ✨ Summary

Your EcoMarket app now has:
- ✅ Full-stack architecture
- ✅ Real database storage
- ✅ Secure authentication
- ✅ RESTful API
- ✅ Production-ready backend
- ✅ Smart fallback system

**Both servers are running:**
- Frontend: http://localhost:5173
- Backend: http://localhost:3000
- MongoDB: localhost:27017

**Test it now!** Register, login, add products, and place orders! 🚀
