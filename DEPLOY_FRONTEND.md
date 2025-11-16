# 🎨 Deploy Frontend to Vercel

Your backend is live at: `https://ecomarket-pro.onrender.com` ✅

Now let's deploy the frontend!

---

## ✅ Prerequisites

Make sure MongoDB Atlas allows connections:
1. MongoDB Atlas → Network Access
2. IP `0.0.0.0/0` should be whitelisted
3. Backend should be working: https://ecomarket-pro.onrender.com/api/health

---

## 🚀 Deploy Frontend (3 minutes)

### Step 1: Go to Vercel

1. Open https://vercel.com
2. Click **"Sign Up"** (if not already signed in)
3. Choose **"Continue with GitHub"**
4. Authorize Vercel

---

### Step 2: Import Project

1. Click **"Add New..."** → **"Project"**
2. Find **"ecomarket-pro"** in the list
3. Click **"Import"**

---

### Step 3: Configure Project

On the configuration page, set:

```
Framework Preset: Vite
Root Directory: frontend-new
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

---

### Step 4: Add Environment Variables

Click **"Environment Variables"** section

Add these 2 variables:

**Variable 1:**
```
Name: VITE_API_URL
Value: https://ecomarket-pro.onrender.com/api
```

**Variable 2:**
```
Name: VITE_USE_BACKEND
Value: true
```

---

### Step 5: Deploy

1. Click **"Deploy"**
2. Wait 2-3 minutes
3. Done! 🎉

---

## ✅ After Deployment

Your app will be live at:
```
https://ecomarket-pro.vercel.app
```

(or similar URL)

---

## 🧪 Test Your App

1. Visit your Vercel URL
2. Click **"Register"**
3. Create account:
   - Name: Test User
   - Email: test@test.com
   - Password: test123
   - Phone: 1234567890
   - Address: Test Address
4. Login
5. Select **"Seller"** → Add a product
6. Select **"Buyer"** → Browse products
7. Add to cart → Checkout

**Everything works?** Congratulations! 🎉

---

## 🔗 Your Live URLs

```
Frontend: https://ecomarket-pro.vercel.app
Backend:  https://ecomarket-pro.onrender.com
Database: MongoDB Atlas
GitHub:   https://github.com/udayashree057-ship-it/ecomarket-pro.git
```

---

## 🚨 Troubleshooting

### Frontend can't connect to backend

**Check:**
1. Environment variables are correct
2. `VITE_API_URL` ends with `/api`
3. Backend URL is correct

**Fix:**
1. Vercel → Your Project → Settings → Environment Variables
2. Update `VITE_API_URL` to: `https://ecomarket-pro.onrender.com/api`
3. Deployments → Redeploy

### Backend is slow (30 seconds)

**This is normal!** Render free tier sleeps after 15 minutes.

First request wakes it up (30s), then it's fast.

---

## 🎉 Success!

Your full-stack EcoMarket app is now live!

**Share your app:**
- Frontend: Your Vercel URL
- Tell friends to register and try it!

---

**Next**: Test all features and share your app! 🌍🌱
