# 🌱 EcoMarket - Sustainable E-Commerce Platform

A full-stack e-commerce platform for eco-friendly products with Buy/Sell/Rent functionality.

**Live Demo**: [Deploy on Railway](docs/RAILWAY_DEPLOYMENT.md)

---

## ✨ Features

- 🔐 **Authentication** - JWT-based user authentication
- 👥 **Three User Roles** - Buyer, Seller, Renter
- 🛍️ **Product Management** - Add, edit, delete products with images
- 🛒 **Shopping Cart** - Full cart and checkout experience
- 💳 **UPI Payments** - QR code-based payments
- 📦 **Order Tracking** - Complete order management
- 🌍 **Multilingual** - English, Hindi, Kannada
- 🤖 **AI Features** - Chatbot and voice assistant
- 📱 **Responsive** - Works on all devices

---

## 🚀 Quick Start

### Local Development

```bash
# 1. Clone repository
git clone https://github.com/udayashree057-ship-it/ecomarket-pro.git
cd ecomarket-pro

# 2. Start MongoDB
mongod

# 3. Start Backend
cd backend
npm install
npm run dev
# Runs on http://localhost:3001

# 4. Start Frontend (new terminal)
cd frontend-new
npm install
npm run dev
# Runs on http://localhost:5173
```

**See detailed guide**: [docs/QUICK_START.md](docs/QUICK_START.md)

---

## 🚀 Deploy (10 minutes - 100% FREE)

1. Push code to GitHub ✅ (already done)
2. Deploy backend to Render (5 min)
3. Deploy frontend to Vercel (3 min)
4. Your app is live!

**Complete guide**: [DEPLOY.md](DEPLOY.md)

**Cost**: $0/month forever (no credit card needed)

---

## 📁 Project Structure

```
ecomarket-pro/
├── backend/              # Node.js + Express API
│   ├── server.js        # Main server file
│   └── package.json
│
├── frontend-new/        # React + Vite frontend
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── context/     # State management
│   │   └── services/    # API services
│   └── package.json
│
├── docs/                # Documentation
│   ├── RAILWAY_DEPLOYMENT.md
│   ├── QUICK_START.md
│   └── TROUBLESHOOTING.md
│
└── README.md           # This file
```

---

## 🔧 Tech Stack

**Frontend**
- React 19
- Vite
- Context API
- React Router

**Backend**
- Node.js
- Express
- MongoDB + Mongoose
- JWT Authentication
- bcrypt

**Database**
- MongoDB Atlas (Cloud)

---

## 📖 Documentation

- **[Deployment Guide](DEPLOY.md)** - Deploy to production (Render + Vercel)
- **[Quick Start](docs/QUICK_START.md)** - Local development setup
- **[Troubleshooting](docs/TROUBLESHOOTING.md)** - Common issues

---

## 🌐 Environment Variables

### Backend (`backend/.env`)
```env
PORT=3001
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
NODE_ENV=development
```

### Frontend (`frontend-new/.env`)
```env
VITE_API_URL=http://localhost:3001/api
VITE_USE_BACKEND=true
```

---

## 🎯 Key Features

### For Buyers
- Browse eco-friendly products
- Search and filter
- Add to cart
- Checkout with UPI
- Track orders

### For Sellers
- Add products with images
- Set prices and eco-ratings
- Manage inventory
- View orders

### For Renters
- Browse rental products
- Rent items temporarily

---

## 📱 Screenshots

*Coming soon*

---

## 🤝 Contributing

Contributions welcome! Please open an issue or submit a pull request.

---

## 📄 License

Open source - Free to use for educational and commercial purposes.

---

## 🔗 Links

- **GitHub**: https://github.com/udayashree057-ship-it/ecomarket-pro.git
- **Render**: https://render.com
- **Vercel**: https://vercel.com
- **MongoDB Atlas**: https://cloud.mongodb.com

---

## 🎉 Get Started

**For Local Development**: See [docs/QUICK_START.md](docs/QUICK_START.md)

**For Deployment**: See [DEPLOY.md](DEPLOY.md)

**Having Issues?**: See [docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)

---

**Built with ❤️ for sustainable e-commerce** 🌱

**Ready to deploy?** Follow the [Deployment Guide](DEPLOY.md)!
