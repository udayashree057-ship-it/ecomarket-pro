# 🔧 Troubleshooting Guide

## Common Issues and Solutions

### 1. MongoDB ObjectId Error

**Error:**
```
Product validation failed: _id: Cast to ObjectId failed for value "1763283886007" (type string)
```

**Cause:** Sending a string `id` field when MongoDB expects `_id` to be an ObjectId.

**Solution:** ✅ Fixed!
- Don't send `id` field when creating products via API
- MongoDB auto-generates `_id`
- Frontend now handles both `_id` (MongoDB) and `id` (localStorage)

### 2. Backend Not Connecting

**Error:** `Failed to add product: Network error` or `ECONNREFUSED`

**Solutions:**
1. Check if backend is running:
   ```bash
   # Should see: 🚀 EcoMarket API Server running on port 3000
   ```

2. Check if MongoDB is running:
   ```bash
   mongod
   # Or check service: net start MongoDB
   ```

3. Verify `.env` file in `frontend-new/`:
   ```env
   VITE_API_URL=http://localhost:3000/api
   VITE_USE_BACKEND=true
   ```

4. Check CORS - backend has CORS enabled by default

### 3. CORS Errors

**Error:** `Access to fetch at 'http://localhost:3000/api/...' has been blocked by CORS policy`

**Solutions:**
1. Ensure backend is running
2. Check backend has `app.use(cors())` (already included)
3. Restart both servers

### 4. JWT Token Expired

**Error:** `Invalid token` or `Token expired`

**Solution:**
- Login again to get a new token
- Token expires after 7 days
- Clear localStorage and login again:
  ```javascript
  localStorage.clear()
  ```

### 5. Products Not Loading

**Symptoms:** Empty product list after adding products

**Solutions:**
1. Check browser console for errors
2. Check backend logs
3. Verify MongoDB connection:
   ```bash
   mongosh
   use ecomarket
   db.products.find()
   ```
4. Try switching to localStorage mode:
   ```env
   VITE_USE_BACKEND=false
   ```

### 6. Image Upload Issues

**Error:** Images not displaying or upload fails

**Solutions:**
1. Check image size (backend limit: 50MB)
2. Verify base64 encoding is working
3. Check MongoDB document size limit (16MB)
4. For production, use cloud storage (Cloudinary, S3)

### 7. Port Already in Use

**Error:** `EADDRINUSE: address already in use :::3000`

**Solutions:**

**Windows:**
```bash
# Find process using port 3000
netstat -ano | findstr :3000

# Kill the process
taskkill /PID <PID> /F
```

**Mac/Linux:**
```bash
# Find and kill process
lsof -ti:3000 | xargs kill -9
```

### 8. MongoDB Connection Failed

**Error:** `MongoServerError: connect ECONNREFUSED`

**Solutions:**
1. Start MongoDB:
   ```bash
   mongod
   ```

2. Check MongoDB is installed:
   ```bash
   mongod --version
   ```

3. Check MongoDB URI in `backend/.env`:
   ```env
   MONGODB_URI=mongodb://localhost:27017/ecomarket
   ```

4. Create data directory:
   ```bash
   # Windows
   mkdir C:\data\db
   
   # Mac/Linux
   sudo mkdir -p /data/db
   ```

### 9. UPI App Not Opening

**Symptoms:** UPI payment modal shows but app doesn't open

**Solutions:**
1. **On Mobile:** Works best on mobile browsers
2. **On Desktop:** Shows manual instructions (expected behavior)
3. **In-app browsers:** Open in default browser
4. Check UPI app is installed
5. Try different browser (Chrome works best)

### 10. Data Not Persisting

**Symptoms:** Data disappears after refresh

**Solutions:**
1. Check if using backend mode:
   ```javascript
   // In browser console
   localStorage.getItem('token')
   // Should return a JWT token
   ```

2. Verify MongoDB is storing data:
   ```bash
   mongosh
   use ecomarket
   db.products.count()
   db.users.count()
   ```

3. Check browser localStorage:
   ```javascript
   // In browser console
   localStorage.getItem('currentUser')
   ```

### 11. Login/Register Not Working

**Error:** `Invalid credentials` or `Registration failed`

**Solutions:**
1. Check backend logs for errors
2. Verify MongoDB connection
3. Check password requirements
4. Try with simple credentials first
5. Check network tab in browser DevTools

### 12. Products Not Showing for Seller

**Symptoms:** Seller adds products but they don't appear in inventory

**Solutions:**
1. Check `sellerEmail` matches current user email
2. Verify product was saved:
   ```bash
   mongosh
   use ecomarket
   db.products.find({ sellerEmail: "your@email.com" })
   ```
3. Check browser console for errors
4. Try refreshing the page

### 13. Payment Details Not Saving

**Error:** `Failed to save payment details`

**Solutions:**
1. Ensure user is logged in
2. Check JWT token is valid
3. Verify backend `/api/auth/profile` endpoint
4. Check MongoDB user document:
   ```bash
   db.users.findOne({ email: "your@email.com" })
   ```

### 14. Fallback to localStorage

**When backend is unavailable, app automatically uses localStorage**

To manually switch:
```env
# In frontend-new/.env
VITE_USE_BACKEND=false
```

Or in code:
```javascript
const { setUseBackend } = useApp();
setUseBackend(false);
```

## 🔍 Debugging Tips

### Check Backend Health
```bash
curl http://localhost:3000/api/health
```

### Check MongoDB
```bash
mongosh
use ecomarket
show collections
db.users.find().pretty()
db.products.find().pretty()
db.orders.find().pretty()
```

### Check Frontend State
```javascript
// In browser console
localStorage.getItem('token')
localStorage.getItem('currentUser')
localStorage.getItem('cart')
```

### View Network Requests
1. Open DevTools (F12)
2. Go to Network tab
3. Filter by "Fetch/XHR"
4. Check request/response

### Check Logs
- **Backend:** Terminal where `npm run dev` is running
- **Frontend:** Browser console (F12)
- **MongoDB:** Terminal where `mongod` is running

## 🆘 Still Having Issues?

1. **Clear everything and start fresh:**
   ```bash
   # Stop all servers
   # Clear MongoDB
   mongosh
   use ecomarket
   db.dropDatabase()
   
   # Clear browser
   localStorage.clear()
   
   # Restart servers
   ```

2. **Check versions:**
   ```bash
   node --version  # Should be v14+
   npm --version
   mongod --version
   ```

3. **Reinstall dependencies:**
   ```bash
   cd backend
   rm -rf node_modules package-lock.json
   npm install
   
   cd ../frontend-new
   rm -rf node_modules package-lock.json
   npm install
   ```

## 📚 Useful Commands

```bash
# Check what's running on ports
netstat -ano | findstr :3000
netstat -ano | findstr :5173
netstat -ano | findstr :27017

# View MongoDB logs
mongod --logpath C:\data\log\mongodb.log

# Test API endpoints
curl http://localhost:3000/api/health
curl http://localhost:3000/api/products

# Check MongoDB status
mongosh --eval "db.adminCommand('ping')"
```

## ✅ Verification Checklist

- [ ] MongoDB is running (`mongod`)
- [ ] Backend is running (`npm run dev` in backend/)
- [ ] Frontend is running (`npm run dev` in frontend-new/)
- [ ] No errors in backend terminal
- [ ] No errors in browser console
- [ ] Can access http://localhost:5173
- [ ] Can access http://localhost:3000/api/health
- [ ] MongoDB has `ecomarket` database
- [ ] JWT token in localStorage
- [ ] User can register and login
- [ ] Products can be added and viewed

If all checked, everything should be working! 🎉
