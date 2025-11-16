# 🚀 EcoMarket Quick Start Guide

## Prerequisites

- Node.js (v14+)
- MongoDB installed and running
- npm or yarn

## 1. Install MongoDB

### Windows:
```bash
# Using Chocolatey
choco install mongodb

# Or download from: https://www.mongodb.com/try/download/community
```

### Mac:
```bash
brew tap mongodb/brew
brew install mongodb-community
```

### Linux:
```bash
sudo apt-get install mongodb
```

## 2. Start MongoDB

```bash
# Start MongoDB service
mongod

# Or on Windows (if installed as service)
net start MongoDB
```

## 3. Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend-new
npm install
```

## 4. Start the Application

### Option A: Using 3 Terminals

**Terminal 1 - MongoDB:**
```bash
mongod
```

**Terminal 2 - Backend:**
```bash
cd backend
npm run dev
# Server runs on http://localhost:3000
```

**Terminal 3 - Frontend:**
```bash
cd frontend-new
npm run dev
# App runs on http://localhost:5173
```

### Option B: Using npm scripts (if configured)

```bash
# From root directory
npm run start:all
```

## 5. Access the Application

Open your browser and go to:
```
http://localhost:5173
```

## 6. Test the Integration

1. **Register a new account**
   - Click "Register"
   - Fill in details
   - Submit

2. **Login**
   - Use your credentials
   - You'll be redirected to role selection

3. **As Seller:**
   - Add payment details (UPI/Bank)
   - Add products
   - View inventory

4. **As Buyer:**
   - Browse products
   - Add to cart
   - Checkout with UPI
   - UPI app opens automatically (on mobile)

5. **Check MongoDB:**
   ```bash
   # Open MongoDB shell
   mongosh
   
   # Switch to ecomarket database
   use ecomarket
   
   # View collections
   show collections
   
   # View users
   db.users.find().pretty()
   
   # View products
   db.products.find().pretty()
   ```

## 🔧 Configuration

### Backend (.env in backend folder)
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/ecomarket
JWT_SECRET=your-secret-key-change-in-production
```

### Frontend (.env in frontend-new folder)
```env
VITE_API_URL=http://localhost:3000/api
VITE_USE_BACKEND=true
```

## 🐛 Troubleshooting

### MongoDB not starting?
```bash
# Check if MongoDB is installed
mongod --version

# Check if port 27017 is in use
netstat -an | findstr 27017

# Try starting with specific data directory
mongod --dbpath C:\data\db
```

### Backend not connecting to MongoDB?
- Ensure MongoDB is running
- Check MONGODB_URI in backend/.env
- Check MongoDB logs

### Frontend not connecting to backend?
- Ensure backend is running on port 3000
- Check VITE_API_URL in frontend-new/.env
- Check browser console for CORS errors

### Port already in use?
```bash
# Windows - Kill process on port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3000 | xargs kill -9
```

## 📊 Verify Everything is Working

### 1. Check Backend Health
```bash
curl http://localhost:3000/api/health
```

Expected response:
```json
{
  "status": "OK",
  "message": "EcoMarket API is running",
  "timestamp": "2024-..."
}
```

### 2. Check Frontend
- Open http://localhost:5173
- Should see EcoMarket login page
- No console errors

### 3. Check MongoDB
```bash
mongosh
use ecomarket
db.stats()
```

## 🎯 What's Running

| Service | Port | URL |
|---------|------|-----|
| Frontend (React) | 5173 | http://localhost:5173 |
| Backend (Express) | 3000 | http://localhost:3000 |
| MongoDB | 27017 | mongodb://localhost:27017 |

## 📝 Default Test Account

After first registration, you can use:
- Email: test@ecomarket.com
- Password: test123

## 🔄 Switching to localStorage Mode

If you don't want to use MongoDB:

1. Edit `frontend-new/.env`:
```env
VITE_USE_BACKEND=false
```

2. Restart frontend
3. App will use localStorage instead

## 🎓 Next Steps

1. ✅ Register and login
2. ✅ Add products as seller
3. ✅ Browse and buy as buyer
4. ✅ Test UPI payment flow
5. ✅ Check orders page
6. ✅ Try voice assistant and chatbot

## 📚 Documentation

- [Backend Integration](./BACKEND_INTEGRATION.md)
- [UPI Payment Guide](./frontend-new/UPI_PAYMENT_GUIDE.md)
- [Features](./frontend-new/FEATURES.md)
- [Migration Guide](./frontend-new/MIGRATION.md)

## 🆘 Need Help?

Check the logs:
- Backend logs: Terminal where `npm run dev` is running
- Frontend logs: Browser console (F12)
- MongoDB logs: Terminal where `mongod` is running

## ✨ You're All Set!

Your full-stack EcoMarket application is now running with:
- ✅ React frontend
- ✅ Express backend
- ✅ MongoDB database
- ✅ JWT authentication
- ✅ UPI payment integration
- ✅ Voice assistant & chatbot

Happy coding! 🌱
