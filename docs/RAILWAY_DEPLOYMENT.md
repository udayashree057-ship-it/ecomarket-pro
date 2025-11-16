# 🚀 Deploy EcoMarket on Railway

Complete guide to deploy your full-stack EcoMarket app on Railway.

---

## 📋 What You'll Deploy

- **Frontend**: React + Vite app
- **Backend**: Node.js + Express API
- **Database**: MongoDB Atlas (already configured)

**Total Time**: 10 minutes
**Cost**: FREE (Railway free tier)

---

## ✅ Prerequisites

- [x] Code pushed to GitHub: https://github.com/udayashree057-ship-it/ecomarket-pro.git
- [x] MongoDB Atlas configured
- [ ] Railway account (we'll create this)

---

## 🚂 Step 1: Create Railway Account (1 minute)

1. Go to https://railway.app
2. Click **"Login"**
3. Sign in with **GitHub**
4. Authorize Railway to access your repositories

---

## 🗄️ Step 2: Deploy Backend (4 minutes)

### 2.1 Create New Project

1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Choose **"ecomarket-pro"**
4. Railway will detect your project

### 2.2 Configure Backend Service

1. Railway will show multiple folders - select **"backend"**
2. Click **"Add variables"**
3. Add these environment variables:

```env
MONGODB_URI=mongodb+srv://udayashree057_db_user:CHDAhOw88WUSEO50@ekart.4fmc4mp.mongodb.net/ecomarket?retryWrites=true&w=majority

JWT_SECRET=ecomarket-railway-production-secret-key-12345

NODE_ENV=production

PORT=3001
```

4. Click **"Deploy"**
5. Wait 3-4 minutes for deployment

### 2.3 Get Backend URL

1. Click on your backend service
2. Go to **"Settings"** tab
3. Click **"Generate Domain"**
4. Copy your backend URL (e.g., `https://ecomarket-api.up.railway.app`)

---

## 🎨 Step 3: Deploy Frontend (4 minutes)

### 3.1 Add Frontend Service

1. In the same project, click **"New"**
2. Select **"GitHub Repo"** → **"ecomarket-pro"**
3. This time select **"frontend-new"** folder

### 3.2 Configure Frontend Service

1. Click **"Add variables"**
2. Add these environment variables:

```env
VITE_API_URL=https://your-backend-url.up.railway.app/api

VITE_USE_BACKEND=true
```

**Important**: Replace `your-backend-url` with the actual URL from Step 2.3

3. Go to **"Settings"** tab
4. Set **"Root Directory"** to `frontend-new`
5. Set **"Build Command"** to `npm run build`
6. Set **"Start Command"** to `npm run preview` or leave default
7. Click **"Deploy"**

### 3.3 Get Frontend URL

1. Go to **"Settings"** tab
2. Click **"Generate Domain"**
3. Copy your frontend URL (e.g., `https://ecomarket-pro.up.railway.app`)

---

## 🧪 Step 4: Test Your App (1 minute)

1. Visit your frontend URL
2. Click **"Register"**
3. Create a new account
4. Login
5. Select **"Seller"** → Add a product
6. Select **"Buyer"** → Browse products
7. Add to cart → Checkout

**Everything works?** Congratulations! 🎉

---

## 🔧 Alternative: Single Service Deployment

If you want to deploy both frontend and backend as one service:

### Option A: Backend serves Frontend

1. Build frontend locally:
```bash
cd frontend-new
npm run build
```

2. Copy `dist` folder to backend:
```bash
cp -r dist ../backend/public
```

3. Update `backend/server.js` to serve static files:
```javascript
app.use(express.static('public'));
```

4. Deploy only backend to Railway
5. Access everything from backend URL

---

## 💰 Cost Breakdown

### Railway Free Tier
- **$5 credit/month** (free)
- **500 hours** of usage
- **100GB bandwidth**
- **1GB RAM** per service

### Your Setup
- Backend service: ~$2.50/month worth
- Frontend service: ~$2.50/month worth
- **Total: FREE** (within $5 credit)

---

## 🔒 Security Best Practices

### 1. Update JWT Secret

Generate a strong random secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Update `JWT_SECRET` in Railway environment variables.

### 2. Configure CORS

Update `backend/server.js`:
```javascript
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'https://your-frontend.up.railway.app'
  ],
  credentials: true
};

app.use(cors(corsOptions));
```

### 3. Environment Variables

Never commit `.env` files to GitHub. Railway handles them securely.

---

## 🔄 Automatic Deployments

Railway automatically redeploys when you push to GitHub:

```bash
# Make changes
git add .
git commit -m "Update feature"
git push origin main
```

Railway will automatically:
1. Detect the push
2. Rebuild your services
3. Deploy new version
4. Zero downtime!

---

## 📊 Monitor Your App

### Railway Dashboard

1. **Metrics**: View CPU, memory, network usage
2. **Logs**: Real-time logs for debugging
3. **Deployments**: History of all deployments
4. **Variables**: Manage environment variables

### Check Backend Health

```bash
curl https://your-backend.up.railway.app/api/health
```

Should return:
```json
{
  "status": "OK",
  "message": "EcoMarket API is running"
}
```

---

## 🚨 Troubleshooting

### Backend not responding

**Check:**
1. Railway logs for errors
2. Environment variables are correct
3. MongoDB connection string is valid
4. Port is set to 3001

**Solution:**
```bash
# View logs in Railway dashboard
# Or use Railway CLI:
railway logs
```

### Frontend can't connect to backend

**Check:**
1. `VITE_API_URL` is correct
2. Backend URL ends with `/api`
3. Backend is deployed and running
4. CORS is configured

**Solution:**
Update `VITE_API_URL` in Railway frontend variables.

### Build fails

**Check:**
1. `package.json` has all dependencies
2. Node version compatibility
3. Build command is correct

**Solution:**
Check Railway build logs for specific errors.

---

## 🎯 Your Live URLs

After deployment:

```
Frontend: https://ecomarket-pro.up.railway.app
Backend:  https://ecomarket-api.up.railway.app
Database: MongoDB Atlas (already configured)
GitHub:   https://github.com/udayashree057-ship-it/ecomarket-pro.git
```

---

## 📱 Share Your App

**Live App**: https://ecomarket-pro.up.railway.app

**Demo Account** (create one):
```
Email: demo@ecomarket.com
Password: demo123
```

---

## 🔧 Railway CLI (Optional)

Install Railway CLI for advanced features:

```bash
# Install
npm i -g @railway/cli

# Login
railway login

# Link project
railway link

# View logs
railway logs

# Run locally with Railway variables
railway run npm start
```

---

## 📚 Additional Resources

- **Railway Docs**: https://docs.railway.app
- **Railway Discord**: https://discord.gg/railway
- **MongoDB Atlas**: https://cloud.mongodb.com

---

## ✅ Deployment Checklist

- [ ] Railway account created
- [ ] Backend deployed
- [ ] Backend domain generated
- [ ] Backend environment variables set
- [ ] Frontend deployed
- [ ] Frontend domain generated
- [ ] Frontend environment variables set
- [ ] Backend health check passing
- [ ] Frontend loads successfully
- [ ] Can register and login
- [ ] Can create products
- [ ] Can place orders
- [ ] All features working

---

## 🎉 Success!

Your EcoMarket app is now live on Railway!

**Features Deployed:**
- ✅ User authentication
- ✅ Three user roles
- ✅ Product management
- ✅ Shopping cart
- ✅ UPI payments
- ✅ Order tracking
- ✅ Multilingual support
- ✅ AI chatbot
- ✅ Voice assistant
- ✅ Cloud database

**Next Steps:**
1. Share your app URL
2. Gather user feedback
3. Monitor performance
4. Add more features
5. Scale when needed

---

**Your app is live!** 🌍🌱

**Railway Dashboard**: https://railway.app/dashboard
