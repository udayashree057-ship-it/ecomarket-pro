# 🚀 Deploy EcoMarket - 100% FREE

Deploy your full-stack app using **Render** (backend) + **Vercel** (frontend).

**No credit card required. No trial limitations. Completely FREE forever.**

---


## ✅ What You'll Use

- **Backend**: Render (Free tier - 750 hours/month)
- **Frontend**: Vercel (Free tier - unlimited)
- **Database**: MongoDB Atlas (Free tier - 512MB)

**Total Cost**: $0/month forever

---

## � Beefore You Start: Configure MongoDB Atlas

**Important:** Allow Render to connect to your database.

1. Go to https://cloud.mongodb.com
2. Login to your account
3. Click on your cluster: **ekart**
4. Go to **"Network Access"** (left sidebar)
5. Click **"Add IP Address"**
6. Click **"Allow Access from Anywhere"**
7. Enter: `0.0.0.0/0`
8. Click **"Confirm"**

This allows your deployed backend to connect to MongoDB.

---

## 🚀 Deploy in 3 Steps (10 minutes)

### Step 1: Deploy Backend on Render (5 minutes)

#### 1.1 Create Render Account
1. Go to https://render.com
2. Click **"Get Started"**
3. Sign up with **GitHub** (no credit card needed)
4. Authorize Render

#### 1.2 Create Web Service
1. Click **"New +"** → **"Web Service"**
2. Click **"Connect account"** → Authorize GitHub
3. Find and select: **ecomarket-pro**
4. Click **"Connect"**

#### 1.3 Configure Service
```
Name: ecomarket-api
Region: Oregon (or closest to you)
Branch: main
Root Directory: backend
Runtime: Node
Build Command: npm install
Start Command: node server.js
Instance Type: Free
```

#### 1.4 Add Environment Variables
Click **"Advanced"** → **"Add Environment Variable"**

Add these 4 variables:

```env
MONGODB_URI
mongodb+srv://udayashree057_db_user:CHDAhOw88WUSEO50@ekart.4fmc4mp.mongodb.net/ecomarket?retryWrites=true&w=majority

JWT_SECRET
ecomarket-production-secret-key-12345

NODE_ENV
production

PORT
3001
```

#### 1.5 Deploy
1. Click **"Create Web Service"**
2. Wait 5 minutes for deployment
3. Once deployed, copy your backend URL
   - Example: `https://ecomarket-api.onrender.com`

---

### Step 2: Deploy Frontend on Vercel (3 minutes)

#### 2.1 Create Vercel Account
1. Go to https://vercel.com
2. Click **"Sign Up"**
3. Sign up with **GitHub** (no credit card needed)
4. Authorize Vercel

#### 2.2 Import Project
1. Click **"Add New..."** → **"Project"**
2. Find **ecomarket-pro** → Click **"Import"**

#### 2.3 Configure Project
```
Framework Preset: Vite
Root Directory: frontend-new
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

#### 2.4 Add Environment Variables
Click **"Environment Variables"**

Add these 2 variables:

```env
VITE_API_URL
https://ecomarket-api.onrender.com/api
(Replace with YOUR backend URL from Step 1)

VITE_USE_BACKEND
true
```

#### 2.5 Deploy
1. Click **"Deploy"**
2. Wait 2-3 minutes
3. Your app is live! 🎉

---

### Step 3: Test Your App (2 minutes)

1. Visit your Vercel URL (e.g., `https://ecomarket-pro.vercel.app`)
2. Click **"Register"**
3. Create a new account
4. Login
5. Select **"Seller"** → Add a product
6. Select **"Buyer"** → Browse products
7. Add to cart → Checkout

**Everything works?** Congratulations! 🎉

---

## 🎯 Your Live URLs

After deployment:

```
Frontend: https://ecomarket-pro.vercel.app
Backend:  https://ecomarket-api.onrender.com
Database: MongoDB Atlas (already configured)
GitHub:   https://github.com/udayashree057-ship-it/ecomarket-pro.git
```

---

## ⚠️ Important Notes

### Render Free Tier
- **Sleeps after 15 minutes** of inactivity
- **30-second cold start** when waking up
- **750 hours/month** (enough for 24/7 if only one service)
- No credit card required

### Vercel Free Tier
- **100GB bandwidth/month**
- **Unlimited deployments**
- **Always on** (no sleep)
- No credit card required

### MongoDB Atlas Free Tier
- **512MB storage**
- **Shared cluster**
- **Always on**
- No credit card required

---

## 🔄 Automatic Deployments

Both Render and Vercel automatically redeploy when you push to GitHub:

```bash
# Make changes
git add .
git commit -m "Update feature"
git push origin main
```

**Automatic deployment!** No manual steps needed.

---

## 🚨 Troubleshooting

### Backend takes 30 seconds to respond

**Cause**: Render free tier sleeps after 15 min inactivity

**Solution**: This is normal. First request wakes it up (30s), then it's fast.

**To keep it awake** (optional):
- Upgrade to paid tier ($7/month)
- Use a cron job to ping every 10 minutes
- Accept the cold start

### Frontend can't connect to backend

**Check:**
1. Backend URL in Vercel environment variables
2. URL must end with `/api`
3. Backend is deployed and running

**Fix:**
1. Go to Vercel → Your Project → Settings → Environment Variables
2. Update `VITE_API_URL` to correct backend URL
3. Redeploy frontend

### "Cannot GET /"

**This is correct!** Backend is API-only.

**Test backend:**
```bash
curl https://your-backend.onrender.com/api/health
```

Should return:
```json
{"status":"OK","message":"EcoMarket API is running"}
```

### "Operation `users.insertOne()` buffering timed out"

**Cause**: MongoDB Atlas is blocking Render's IP addresses.

**Fix:**
1. Go to MongoDB Atlas → Network Access
2. Click "Add IP Address"
3. Select "Allow Access from Anywhere" (0.0.0.0/0)
4. Confirm
5. Redeploy your Render service
6. Wait 2-3 minutes

This allows Render servers to connect to your database.

### Build fails on Render

**Check:**
1. Root Directory is set to `backend`
2. Build Command is `npm install`
3. Start Command is `node server.js`
4. All environment variables are set

**View logs:**
- Click on your service
- Go to "Logs" tab
- Check for errors

### Build fails on Vercel

**Check:**
1. Root Directory is set to `frontend-new`
2. Framework is set to `Vite`
3. Environment variables are set

**View logs:**
- Click on deployment
- Check build logs for errors

---

## 🔒 Security Tips

### 1. Update JWT Secret

Generate a strong random secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Update `JWT_SECRET` in Render environment variables.

### 2. Configure CORS

Update `backend/server.js`:

```javascript
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'https://ecomarket-pro.vercel.app' // your Vercel URL
  ],
  credentials: true
};

app.use(cors(corsOptions));
```

Commit and push to redeploy.

---

## 📊 Monitor Your App

### Render Dashboard
- View logs in real-time
- Check deployment status
- Monitor resource usage
- View metrics

### Vercel Dashboard
- View analytics
- Check deployment history
- Monitor bandwidth usage
- View function logs

### MongoDB Atlas
- Monitor database usage
- View query performance
- Check storage usage
- Set up alerts

---

## 💡 Pro Tips

### 1. Custom Domain (Optional)

**Vercel:**
1. Buy domain from Namecheap/GoDaddy
2. Vercel → Settings → Domains
3. Add your domain
4. Update DNS records

**Render:**
1. Render → Settings → Custom Domain
2. Add your domain
3. Update DNS records

### 2. Environment Variables

To update environment variables:

**Render:**
1. Service → Environment
2. Edit variables
3. Save (auto-redeploys)

**Vercel:**
1. Project → Settings → Environment Variables
2. Edit variables
3. Redeploy manually

### 3. View Logs

**Render:**
```
Service → Logs → Real-time logs
```

**Vercel:**
```
Deployment → Functions → View logs
```

---

## 🎉 Success!

Your EcoMarket app is now live and accessible worldwide!

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
2. Test all features
3. Gather user feedback
4. Monitor performance
5. Add more features

---

## 📚 Resources

- **Render Docs**: https://render.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **MongoDB Atlas**: https://cloud.mongodb.com
- **GitHub Repo**: https://github.com/udayashree057-ship-it/ecomarket-pro.git

---

## 🆘 Need Help?

1. Check [docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)
2. Review Render/Vercel logs
3. Check MongoDB connection
4. Verify environment variables

---

**Your app is live!** 🌍🌱

**100% FREE. No credit card. No trial limits.** ✨
