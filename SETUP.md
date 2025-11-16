# EcoMarket - Setup & Quick Start

Welcome to **EcoMarket** — a full-stack e-commerce platform for eco-friendly products with Buy/Sell/Rent functionality.

## 📁 Project Structure

```
ecomarket/
├── frontend/           # Client-side SPA (HTML, CSS, JavaScript)
│   ├── index.html      # Main entry point with role selection
│   ├── app.js          # Core client logic (~5000 LOC)
│   ├── styles.css      # Responsive CSS styling
│   ├── translations.js # 7-language i18n support
│   └── sample-products.json
├── backend/            # Node.js Express API server
│   ├── server.js       # Express server with REST API
│   └── package.json    # Backend dependencies
├── README.md           # Project overview
├── .gitignore          # Git ignore rules
└── vercel.json         # Vercel deployment config
```

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v14+) and npm
- **MongoDB** (local or cloud instance)

### Backend Setup

1. Navigate to the backend folder:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the `backend/` directory:
   ```
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/ecomarket
   JWT_SECRET=your-secret-key-change-in-production
   ```

4. Start the backend server:
   ```bash
   npm start
   ```
   
   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

   The API will be available at: `http://localhost:3000`

### Frontend Setup

The frontend is served automatically by the backend from `../frontend` directory.

Open your browser and navigate to:
```
http://localhost:3000
```

## 📋 Features

### User Roles
- **Buyer** — Browse and purchase eco-friendly products
- **Seller** — List products for sale
- **Renter** — Rent products by duration

### Core Features
- 🔐 **Authentication** — User registration and login with JWT
- 🛒 **E-Commerce** — Add to cart, checkout, order management
- 📦 **Product Management** — Browse, create, update, delete products
- 💳 **Order Tracking** — View orders, delivery status, customer feedback
- 🎤 **Voice Assistant** — Voice commands for hands-free navigation
- 📱 **Barcode Scanning** — QR code and barcode scanning support
- 🗣️ **Multilingual** — 7 languages: English, Hindi, Kannada, Telugu, Urdu, Malayalam, Tamil
- 💬 **Chatbot Support** — In-app chatbot for customer support

### Backend API
- **Auth Routes** — `/api/auth/register`, `/api/auth/login`
- **Products** — CRUD operations for product management
- **Orders** — Order creation, tracking, status updates
- **Customers** — Customer data management
- **Statistics** — Dashboard metrics and analytics

## 🧪 Testing

### Sample Products
A sample product set is included in `frontend/sample-products.json` for testing.

### API Health Check
```bash
curl http://localhost:3000/api/health
```

## 📖 Documentation

- `README.md` — Project overview
- `SETUP.md` — This setup guide
- Additional guides available in root folder

## 🔧 Development

### Frontend Development
- No build step required — vanilla JavaScript
- Edit `frontend/app.js` for logic changes
- Edit `frontend/styles.css` for styling
- Edit `frontend/translations.js` to add new languages

### Backend Development
- Requires `npm install` in `backend/` folder
- Run with `npm run dev` for auto-reload (requires nodemon)
- Add routes and models in `backend/server.js`
- All API responses use JSON format

## 🌐 Deployment

The project includes a `vercel.json` configuration for Vercel deployment.

### Deploy to Vercel
1. Connect your GitHub repository to Vercel
2. Configure environment variables (MONGODB_URI, JWT_SECRET)
3. Deploy — Vercel will automatically detect `vercel.json`

### Deploy to Other Platforms
- Set `NODE_ENV=production`
- Ensure MongoDB is accessible
- Update environment variables on your hosting platform
- Run `npm install` in `backend/` folder on the server

## 📞 Support

For issues or questions:
1. Check the documentation in the root folder
2. Review the API endpoints in `backend/server.js`
3. Check browser console for client-side errors
4. Check server logs for backend errors

## 📄 License

EcoMarket is an open-source project for educational and commercial use.

---

**Happy coding!** 🌱
