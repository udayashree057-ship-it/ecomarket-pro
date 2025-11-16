# 🚂 Deploy to Railway - Quick Guide

## ✅ Ready to Deploy

Your EcoMarket app is ready to deploy on Railway!

---

## 🚀 Deploy in 4 Steps (10 minutes)

### Step 1: Create Railway Account
1. Go to https://railway.app
2. Sign in with GitHub
3. Authorize Railway

### Step 2: Deploy Backend
1. New Project → Deploy from GitHub
2. Select **ecomarket-pro** → **backend** folder
3. Add environment variables:
   ```
   MONGODB_URI=mongodb+srv://udayashree057_db_user:CHDAhOw88WUSEO50@ekart.4fmc4mp.mongodb.net/ecomarket?retryWrites=true&w=majority
   JWT_SECRET=ecomarket-railway-secret-12345
   NODE_ENV=production
   PORT=3001
   ```
4. Deploy → Generate Domain
5. Copy backend URL

### Step 3: Deploy Frontend
1. Same project → New → GitHub Repo
2. Select **ecomarket-pro** → **frontend-new** folder
3. Add environment variables:
   ```
   VITE_API_URL=https://your-backend-url.up.railway.app/api
   VITE_USE_BACKEND=true
   ```
4. Settings → Root Directory: `frontend-new`
5. Deploy → Generate Domain

### Step 4: Test
1. Visit your frontend URL
2. Register account
3. Test features
4. Done! 🎉

---

## 📚 Full Guide

See complete instructions: **[docs/RAILWAY_DEPLOYMENT.md](docs/RAILWAY_DEPLOYMENT.md)**

---

## 💰 Cost

**FREE** - Railway free tier ($5 credit/month)

---

## 🔗 Your URLs

After deployment:
- Frontend: `https://ecomarket-pro.up.railway.app`
- Backend: `https://ecomarket-api.up.railway.app`
- Database: MongoDB Atlas (already configured)

---

## 🚨 Need Help?

- **Full Guide**: [docs/RAILWAY_DEPLOYMENT.md](docs/RAILWAY_DEPLOYMENT.md)
- **Troubleshooting**: [docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)
- **Railway Docs**: https://docs.railway.app

---

**Start deploying**: https://railway.app 🚂
