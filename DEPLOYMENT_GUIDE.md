# 🚀 EcoMarket Deployment Guide

Complete guide to deploy your EcoMarket application and make it publicly accessible.

---

## 📋 Deployment Overview

Your app has 3 components to deploy:
1. **Frontend** (React app) → Vercel/Netlify
2. **Backend** (Node.js API) → Render/Railway/Heroku
3. **Database** (MongoDB) → MongoDB Atlas

---

## 🎯 Recommended Setup (FREE)

### Option 1: Best for Beginners
- **Frontend**: Vercel (Free)
- **Backend**: Render (Free)
- **Database**: MongoDB Atlas (Free)

### Option 2: All-in-One
- **Full Stack**: Railway (Free tier)
- **Database**: MongoDB Atlas (Free)

---

## 📦 Step-by-Step Deployment

## Part 1: Database (MongoDB Atlas)

### 1. Create MongoDB Atlas Account
1. Go to https://www.mongodb.com/cloud/atlas
2. Click "Try Free"
3. Sign up with email/Google

### 2. Create Cluster
1. Choose "FREE" tier (M0)
2. Select region closest to you
3. Click "Create Cluster"
4. Wait 3-5 minutes for cluster creation

### 3. Setup Database Access
1. Click "Database Access" in left menu
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Username: `ecomarket`
5. Password: Generate secure password (save it!)
6. Database User Privileges: "Read and write to any database"
7. Click "Add User"

### 4. Setup Network Access
1. Click "Network Access" in left menu
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (0.0.0.0/0)
4. Click "Confirm"

### 5. Get Connection String
1. Click "Database" in left menu
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your actual password
6. Replace `<dbname>` with `ecomarket`

Example:
```
mongodb+srv://ecomarket:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/ecomarket?retryWrites=true&w=majority
```

**Save this connection string!** You'll need it for backend deployment.

---

## Part 2: Backend Deployment (Render)

### 1. Prepare Backend for Deployment

Create `backend/.env.production`:
```env
PORT=3001
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secret_key_change_this_to_random_string
NODE_ENV=production
```

### 2. Update backend/server.js

Add this at the top after imports:
```javascript
// Load environment variables
require('dotenv').config();
```

### 3. Create Render Account
1. Go to https://render.com
2. Sign up with GitHub (recommended)

### 4. Deploy Backend
1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Or use "Deploy from Git URL"
4. Configure:
   - **Name**: `ecomarket-api`
   - **Environment**: `Node`
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && node server.js`
   - **Instance Type**: Free

5. Add Environment Variables:
   - Click "Advanced" → "Add Environment Variable"
   - Add:
     ```
     MONGODB_URI = your_mongodb_atlas_connection_string
     JWT_SECRET = your_random_secret_key
     NODE_ENV = production
     PORT = 3001
     ```

6. Click "Create Web Service"
7. Wait 5-10 minutes for deployment
8. Copy your backend URL (e.g., `https://ecomarket-api.onrender.com`)

### 5. Test Backend
```bash
curl https://your-backend-url.onrender.com/api/health
```

Should return:
```json
{
  "status": "OK",
  "message": "EcoMarket API is running"
}
```

---

## Part 3: Frontend Deployment (Vercel)

### 1. Update Frontend Environment Variables

Update `frontend-new/.env.production`:
```env
VITE_API_URL=https://your-backend-url.onrender.com/api
VITE_USE_BACKEND=true
```

### 2. Update API Service

Edit `frontend-new/src/services/api.js`:
```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
```

### 3. Create Vercel Account
1. Go to https://vercel.com
2. Sign up with GitHub (recommended)

### 4. Deploy Frontend
1. Click "Add New" → "Project"
2. Import your GitHub repository
3. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend-new`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

4. Add Environment Variables:
   - Click "Environment Variables"
   - Add:
     ```
     VITE_API_URL = https://your-backend-url.onrender.com/api
     VITE_USE_BACKEND = true
     ```

5. Click "Deploy"
6. Wait 2-3 minutes
7. Your app is live! (e.g., `https://ecomarket.vercel.app`)

---

## 🔄 Alternative: Railway (All-in-One)

Railway can host both frontend and backend together.

### 1. Create Railway Account
1. Go to https://railway.app
2. Sign up with GitHub

### 2. Deploy Backend
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose your repository
4. Click "Add variables"
5. Add:
   ```
   MONGODB_URI = your_mongodb_atlas_connection_string
   JWT_SECRET = your_secret_key
   NODE_ENV = production
   PORT = 3001
   ```
6. Set root directory to `backend`
7. Deploy

### 3. Deploy Frontend
1. Click "New" in same project
2. Select same repository
3. Set root directory to `frontend-new`
4. Add environment variable:
   ```
   VITE_API_URL = https://your-backend-url.railway.app/api
   ```
5. Deploy

---

## 🌐 Custom Domain (Optional)

### Vercel Custom Domain
1. Go to your project settings
2. Click "Domains"
3. Add your domain (e.g., `ecomarket.com`)
4. Follow DNS configuration instructions

### Render Custom Domain
1. Go to your service settings
2. Click "Custom Domain"
3. Add your domain
4. Update DNS records

---

## 🔒 Security Checklist

Before going public:

### Backend
- [ ] Change JWT_SECRET to strong random string
- [ ] Enable CORS only for your frontend domain
- [ ] Add rate limiting
- [ ] Enable HTTPS (automatic on Render/Railway)
- [ ] Add input validation
- [ ] Set secure cookie options

### Frontend
- [ ] Remove console.logs
- [ ] Add error boundaries
- [ ] Enable production build
- [ ] Add analytics (optional)

### Database
- [ ] Use strong password
- [ ] Enable IP whitelist (or use 0.0.0.0/0 for public)
- [ ] Regular backups
- [ ] Monitor usage

---

## 📊 Post-Deployment Testing

### 1. Test Backend
```bash
# Health check
curl https://your-backend-url.com/api/health

# Register user
curl -X POST https://your-backend-url.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"test123","role":"buyer"}'
```

### 2. Test Frontend
1. Visit your frontend URL
2. Register a new account
3. Login
4. Add a product (as seller)
5. Browse products (as buyer)
6. Add to cart
7. Place an order
8. Check orders page

### 3. Test Database
```bash
# Connect to MongoDB Atlas
mongosh "your_connection_string"

# Check data
use ecomarket
db.users.find()
db.products.find()
db.orders.find()
```

---

## 🔧 Update CORS in Backend

Edit `backend/server.js`:

```javascript
// Update CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'https://your-frontend-url.vercel.app',
    'https://ecomarket.com' // your custom domain
  ],
  credentials: true
};

app.use(cors(corsOptions));
```

---

## 📱 Share Your App

Once deployed, share these URLs:

**Public URL**: `https://your-app.vercel.app`

**API Documentation**: `https://your-backend.onrender.com/api/health`

**Demo Credentials** (optional):
```
Email: demo@ecomarket.com
Password: demo123
```

---

## 💰 Cost Breakdown

### Free Tier (Recommended for Start)
- **MongoDB Atlas**: Free (512MB storage)
- **Render**: Free (750 hours/month)
- **Vercel**: Free (100GB bandwidth)
- **Total**: $0/month

### Paid Tier (For Production)
- **MongoDB Atlas**: $9/month (2GB storage)
- **Render**: $7/month (always on)
- **Vercel**: Free or $20/month (Pro)
- **Total**: ~$16-36/month

---

## 🚨 Common Issues

### Backend sleeps on free tier
**Problem**: Render free tier sleeps after 15 min inactivity
**Solution**: 
- Upgrade to paid tier ($7/month)
- Use cron job to ping every 10 minutes
- Accept 30-second cold start

### CORS errors
**Problem**: Frontend can't connect to backend
**Solution**: 
- Add frontend URL to CORS whitelist
- Check environment variables
- Verify API_URL is correct

### MongoDB connection fails
**Problem**: Can't connect to database
**Solution**:
- Check connection string
- Verify password is correct
- Check IP whitelist (use 0.0.0.0/0)
- Check network access in Atlas

### Build fails
**Problem**: Deployment fails during build
**Solution**:
- Check build logs
- Verify package.json is correct
- Check Node version compatibility
- Clear cache and rebuild

---

## 🎯 Quick Deploy Commands

### Using Git (Recommended)

```bash
# 1. Commit your code
git add .
git commit -m "Prepare for deployment"
git push origin main

# 2. Deploy automatically via Vercel/Render GitHub integration
```

### Manual Deploy

```bash
# Frontend
cd frontend-new
npm run build
# Upload dist/ folder to hosting

# Backend
cd backend
# Upload to hosting service
```

---

## 📚 Additional Resources

- **Vercel Docs**: https://vercel.com/docs
- **Render Docs**: https://render.com/docs
- **Railway Docs**: https://docs.railway.app
- **MongoDB Atlas**: https://docs.atlas.mongodb.com

---

## ✅ Deployment Checklist

- [ ] MongoDB Atlas cluster created
- [ ] Database user created
- [ ] Connection string obtained
- [ ] Backend deployed to Render/Railway
- [ ] Backend environment variables set
- [ ] Backend health check working
- [ ] Frontend environment variables updated
- [ ] Frontend deployed to Vercel
- [ ] Frontend can connect to backend
- [ ] Test registration and login
- [ ] Test product creation
- [ ] Test order placement
- [ ] Custom domain configured (optional)
- [ ] SSL certificate active (automatic)
- [ ] Share public URL

---

## 🎉 You're Live!

Your EcoMarket app is now publicly accessible!

**Next Steps:**
1. Share your URL with users
2. Monitor usage and errors
3. Add analytics (Google Analytics, Mixpanel)
4. Set up monitoring (Sentry, LogRocket)
5. Plan for scaling

**Your app is ready for the world!** 🌍🌱

---

**Need help?** Check TROUBLESHOOTING.md or open an issue.
