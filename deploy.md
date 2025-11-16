# 🚀 Quick Deploy Instructions

## Fastest Way to Deploy (5 Minutes)

### Step 1: Database (2 minutes)
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up → Create FREE cluster
3. Create database user (save password!)
4. Allow access from anywhere (0.0.0.0/0)
5. Get connection string → Save it!

### Step 2: Backend (2 minutes)
1. Go to https://render.com
2. Sign up with GitHub
3. New Web Service → Connect your repo
4. Settings:
   - Build: `cd backend && npm install`
   - Start: `cd backend && node server.js`
   - Add env vars:
     - `MONGODB_URI` = your connection string
     - `JWT_SECRET` = any random string
5. Deploy → Copy backend URL

### Step 3: Frontend (1 minute)
1. Go to https://vercel.com
2. Sign up with GitHub
3. Import project → Select your repo
4. Settings:
   - Root: `frontend-new`
   - Framework: Vite
   - Add env var:
     - `VITE_API_URL` = your backend URL + `/api`
5. Deploy → Done!

## Your App is Live! 🎉

**Frontend**: https://your-app.vercel.app
**Backend**: https://your-api.onrender.com

## Test It
1. Visit your frontend URL
2. Register a new account
3. Login and use the app!

---

**Need detailed instructions?** See DEPLOYMENT_GUIDE.md
