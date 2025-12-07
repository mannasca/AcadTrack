# AcadTrack Quick Deployment Reference

## 🚀 Quick Start (5 minutes)

### Backend to Render

1. **Create MongoDB Atlas Database**
   ```
   Connection: mongodb+srv://user:pass@cluster.mongodb.net/acadtrack
   ```

2. **Push to GitHub** (if not already done)
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

3. **Deploy Backend**
   - Go to https://render.com
   - Click "New +" → "Web Service"
   - Connect GitHub → select `AcadTrack` repo
   - Set:
     - Build Command: `npm install`
     - Start Command: `npm start`
     - Base directory: `backend`
   - Add Environment Variables:
     - `MONGODB_URI`: Your MongoDB Atlas URI
     - `JWT_SECRET`: Any secret string
     - `ADMIN_CODE`: Registration code
     - `NODE_ENV`: production
   - Deploy!
   - **Result**: `https://acadtrack-api.onrender.com`

### Frontend to Netlify

1. **Deploy Frontend**
   - Go to https://app.netlify.com
   - Click "Add new site" → "Import an existing project"
   - Select GitHub → `AcadTrack` repo
   - Set:
     - Base directory: `frontend`
     - Build command: `npm run build`
     - Publish directory: `frontend/dist`
   - Add Environment Variable:
     - `VITE_API_URL`: `https://acadtrack-api.onrender.com`
   - Deploy!
   - **Result**: `https://acadtrack.netlify.app`

---

## 📋 Environment Variables

### Render Backend
```
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/acadtrack
JWT_SECRET=your-secret-key-min-32-chars
ADMIN_CODE=ADMIN2024
PORT=10000
```

### Netlify Frontend
```
VITE_API_URL=https://acadtrack-api.onrender.com
```

---

## ✅ Verification Checklist

- [ ] MongoDB Atlas configured with security
- [ ] Backend deployed to Render
- [ ] Backend responding at: `https://acadtrack-api.onrender.com/`
- [ ] Frontend deployed to Netlify
- [ ] Frontend responding at: `https://acadtrack.netlify.app`
- [ ] Login page loads
- [ ] Can register new account
- [ ] Can login with credentials
- [ ] Can create/view/edit/delete activities
- [ ] API calls visible in Network tab (DevTools)
- [ ] No CORS errors in console

---

## 🔗 Useful Links

| Service | Link | Purpose |
|---------|------|---------|
| Render | https://render.com | Backend hosting |
| Netlify | https://netlify.com | Frontend hosting |
| MongoDB Atlas | https://www.mongodb.com/cloud/atlas | Database |
| GitHub | https://github.com/mannasca/AcadTrack | Repository |

---

## 🆘 Common Issues & Fixes

### Backend won't start on Render
```
✓ Check logs: Dashboard → Select service → Logs
✓ Verify MONGODB_URI format
✓ Ensure MongoDB user has Atlas Admin role
✓ Check IP whitelist (set to 0.0.0.0/0)
```

### Frontend shows API 404 errors
```
✓ Verify VITE_API_URL is correct
✓ Check Render backend is running (test URL in browser)
✓ Clear browser cache (Ctrl+Shift+Delete)
✓ Check CORS configuration in backend
```

### Netlify build fails
```
✓ Check build logs in Netlify Dashboard
✓ Ensure base directory is "frontend"
✓ Run: npm run build (locally to test)
✓ Check for missing environment variables
```

### Page shows 404 on refresh
```
✓ Netlify redirects are already configured in netlify.toml
✓ If still failing, check Redirects in Netlify Dashboard
✓ Should show: /* → /index.html (status: 200)
```

---

## 📱 Testing the Deployed App

### 1. Test Backend API
```bash
# Health check
curl https://acadtrack-api.onrender.com/

# Test auth endpoint
curl https://acadtrack-api.onrender.com/api/auth/health
```

### 2. Test Frontend
- Visit: https://acadtrack.netlify.app
- Register: Use any email
- Login: With credentials from register
- Create Activity: Add test activity
- Verify: Check DevTools Network tab for API calls

### 3. Performance Check
- Open DevTools: F12
- Go to Lighthouse tab
- Run audit
- Check scores (target: 90+)

---

## 🔐 Security Tips

1. **Never commit .env files** - Already in .gitignore ✓
2. **Use strong JWT_SECRET** - Min 32 characters
3. **Enable HTTPS** - Both Render & Netlify do this automatically
4. **Set MongoDB IP** - Use specific IPs or 0.0.0.0/0 (only for dev/testing)
5. **CORS setup** - Only allow your frontend domain
6. **Rate limiting** - Consider adding on Render

---

## 💰 Pricing (Free Tier Limits)

| Service | Free Tier | Cost if Upgrading |
|---------|-----------|-------------------|
| Render | Web: 750 hrs/month | $7/month |
| Netlify | Unlimited | Pro: $19/month |
| MongoDB | 512MB storage | Pay as you grow |

**Note**: Free Render tier has 15-min inactivity timeout (cold start).

---

## 📞 Support

- See `DEPLOYMENT_GUIDE.md` for detailed steps
- Check service documentation links
- Review application logs in dashboards
- Test locally before deploying

---

**Status**: ✅ Ready for Production
**Last Updated**: December 7, 2025
