# ✅ Pre-Deployment Checklist

Before deploying your EcoMarket app to production, complete these steps:

## 🔒 Security

### Backend
- [ ] Change `JWT_SECRET` to a strong random string (at least 32 characters)
- [ ] Update MongoDB connection string to production database
- [ ] Remove any console.log statements with sensitive data
- [ ] Verify CORS is configured for your frontend domain only
- [ ] Check all API endpoints have proper authentication
- [ ] Ensure passwords are hashed (already done with bcrypt)

### Frontend
- [ ] Update `VITE_API_URL` to production backend URL
- [ ] Remove any console.log statements
- [ ] Check no API keys or secrets in code
- [ ] Verify environment variables are set correctly

### Database
- [ ] Use strong password for MongoDB user
- [ ] Configure IP whitelist (or use 0.0.0.0/0 for public access)
- [ ] Enable database backups
- [ ] Set up monitoring alerts

## 📝 Configuration Files

- [ ] Create `.env` files (don't commit them!)
- [ ] Update `.env.example` files with all required variables
- [ ] Add `.env` to `.gitignore`
- [ ] Verify `vercel.json` is configured correctly
- [ ] Verify `render.yaml` is configured correctly

## 🧪 Testing

### Local Testing
- [ ] Test registration and login
- [ ] Test product creation (as seller)
- [ ] Test product browsing (as buyer)
- [ ] Test add to cart and checkout
- [ ] Test order placement
- [ ] Test payment flow
- [ ] Test all three user roles (buyer/seller/renter)
- [ ] Test multilingual support
- [ ] Test on mobile devices

### API Testing
- [ ] Test all API endpoints
- [ ] Verify authentication works
- [ ] Check error handling
- [ ] Test with invalid data
- [ ] Verify CORS headers

## 📦 Build

### Frontend
- [ ] Run `npm run build` successfully
- [ ] Check build output in `dist/` folder
- [ ] Test production build locally
- [ ] Verify all assets load correctly

### Backend
- [ ] Run `npm install` successfully
- [ ] Start server without errors
- [ ] Check all dependencies are in `package.json`
- [ ] Verify Node version compatibility

## 🌐 Domain & DNS (Optional)

- [ ] Purchase domain name
- [ ] Configure DNS records
- [ ] Set up SSL certificate (automatic on Vercel/Render)
- [ ] Test domain access

## 📊 Monitoring & Analytics

- [ ] Set up error tracking (Sentry, optional)
- [ ] Add analytics (Google Analytics, optional)
- [ ] Configure uptime monitoring
- [ ] Set up logging

## 📚 Documentation

- [ ] Update README.md with production URLs
- [ ] Document API endpoints
- [ ] Create user guide (optional)
- [ ] Document deployment process

## 🚀 Deployment Steps

### 1. Database (MongoDB Atlas)
- [ ] Create account
- [ ] Create cluster
- [ ] Create database user
- [ ] Configure network access
- [ ] Get connection string
- [ ] Test connection

### 2. Backend (Render/Railway)
- [ ] Create account
- [ ] Connect GitHub repository
- [ ] Configure build settings
- [ ] Add environment variables
- [ ] Deploy
- [ ] Test health endpoint
- [ ] Verify database connection

### 3. Frontend (Vercel)
- [ ] Create account
- [ ] Import project
- [ ] Configure build settings
- [ ] Add environment variables
- [ ] Deploy
- [ ] Test frontend loads
- [ ] Verify API connection

## ✅ Post-Deployment

### Immediate Testing
- [ ] Visit production URL
- [ ] Register new account
- [ ] Login successfully
- [ ] Create a product
- [ ] Browse products
- [ ] Add to cart
- [ ] Place an order
- [ ] Check order history
- [ ] Test on mobile device

### Monitoring
- [ ] Check backend logs
- [ ] Monitor database usage
- [ ] Check error rates
- [ ] Monitor response times
- [ ] Set up alerts

### Share
- [ ] Share production URL with team
- [ ] Create demo account (optional)
- [ ] Announce launch
- [ ] Gather feedback

## 🔧 Environment Variables Checklist

### Backend (.env)
```
PORT=3001
NODE_ENV=production
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-super-secret-random-string-here
```

### Frontend (.env)
```
VITE_API_URL=https://your-backend.onrender.com/api
VITE_USE_BACKEND=true
```

## 📱 URLs to Save

After deployment, save these URLs:

- [ ] Frontend URL: `https://___________________`
- [ ] Backend URL: `https://___________________`
- [ ] Database URL: `mongodb+srv://___________________`
- [ ] Admin Panel: `https://___________________` (if applicable)

## 🎯 Success Criteria

Your deployment is successful when:

- ✅ Frontend loads without errors
- ✅ Backend API responds to health check
- ✅ Database connection is established
- ✅ Users can register and login
- ✅ Products can be created and viewed
- ✅ Orders can be placed
- ✅ All features work as expected
- ✅ No console errors
- ✅ Mobile responsive
- ✅ HTTPS enabled

## 🚨 Rollback Plan

If something goes wrong:

1. **Frontend Issues**
   - Revert to previous deployment in Vercel
   - Check environment variables
   - Review build logs

2. **Backend Issues**
   - Revert to previous deployment in Render
   - Check database connection
   - Review server logs

3. **Database Issues**
   - Check connection string
   - Verify network access
   - Check user permissions

## 📞 Support Resources

- **Vercel Docs**: https://vercel.com/docs
- **Render Docs**: https://render.com/docs
- **MongoDB Atlas**: https://docs.atlas.mongodb.com
- **Your Deployment Guide**: `DEPLOYMENT_GUIDE.md`

---

## ✨ Ready to Deploy?

Once all items are checked:

1. Commit all changes
2. Push to GitHub
3. Follow `DEPLOYMENT_GUIDE.md`
4. Test thoroughly
5. Share with the world! 🌍

**Good luck with your deployment!** 🚀
