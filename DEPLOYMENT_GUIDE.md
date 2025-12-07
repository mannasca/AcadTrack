# AcadTrack Deployment Guide

## Overview
This guide provides step-by-step instructions to deploy AcadTrack to production:
- **Backend API**: Render.com
- **Frontend App**: Netlify

---

## Part 1: Backend Deployment (Render)

### Prerequisites
- Render account (https://render.com)
- GitHub repository with code
- MongoDB Atlas account for database
- Environment variables ready

### Step 1: Prepare MongoDB Atlas

1. Go to **MongoDB Atlas** (https://www.mongodb.com/cloud/atlas)
2. Create a free cluster or use existing one
3. Create a database user:
   - Click "Security" → "Database Access"
   - Click "Add New Database User"
   - Username: `acadtrack_user`
   - Password: Generate a secure password
   - Database User Privileges: "Atlas Admin"
4. Whitelist IP addresses:
   - Click "Security" → "Network Access"
   - Click "Add IP Address"
   - Add `0.0.0.0/0` (allows all IPs - for Render)
5. Get connection string:
   - Click "Databases" → "Connect"
   - Choose "Connect your application"
   - Select "Node.js" and copy the connection string
   - Replace `<username>` and `<password>` with your credentials
   - Replace `<database>` with `acadtrack`

   **Example:**
   ```
   mongodb+srv://acadtrack_user:YOUR_PASSWORD@cluster0.mongodb.net/acadtrack?retryWrites=true&w=majority
   ```

### Step 2: Deploy on Render

#### Option A: Connect GitHub Repository (Recommended)

1. Go to **Render Dashboard** (https://render.com)
2. Click **"New +"** → Select **"Web Service"**
3. Click **"Connect a repository"**
4. Select your GitHub repository (`AcadTrack`)
5. Configure the service:
   - **Name**: `acadtrack-api`
   - **Environment**: `Node`
   - **Region**: Choose closest region (e.g., Ohio, Virginia)
   - **Branch**: `main`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
6. Add environment variables:
   - Click **"Environment"** tab
   - Add the following variables:

   ```
   NODE_ENV = production
   MONGODB_URI = mongodb+srv://acadtrack_user:PASSWORD@cluster0.mongodb.net/acadtrack?retryWrites=true&w=majority
   JWT_SECRET = your-super-secret-jwt-key-change-this-in-production
   ADMIN_CODE = your-admin-registration-code
   PORT = 10000
   ```

7. Click **"Create Web Service"**
8. Wait for deployment (5-10 minutes)
9. Once deployed, you'll get a URL like: `https://acadtrack-api.onrender.com`

#### Option B: Manual Deployment via Git

```bash
# 1. Create Render account and download Render CLI
npm install -g @render-com/cli

# 2. Login to Render
render login

# 3. Deploy backend
cd backend
render deploy --service-name acadtrack-api
```

### Step 3: Verify Backend Deployment

Test your backend API:

```bash
# Test health check
curl https://acadtrack-api.onrender.com/

# Test API endpoints
curl https://acadtrack-api.onrender.com/api/auth/health
```

**Note**: Render free tier may experience cold starts (first request takes 30-60 seconds). Subscribe to Pro for always-on service.

---

## Part 2: Frontend Deployment (Netlify)

### Prerequisites
- Netlify account (https://netlify.com)
- GitHub repository with code
- Backend API URL from Render

### Step 1: Update Frontend Environment Variables

Update `frontend/.env.production` with your Render API URL:

```env
VITE_API_URL=https://acadtrack-api.onrender.com
```

Or update `frontend/src/services/api.js`:

```javascript
const API_URL = import.meta.env.VITE_API_URL || 'https://acadtrack-api.onrender.com';
```

### Step 2: Deploy on Netlify

#### Option A: Connect GitHub (Recommended)

1. Go to **Netlify Dashboard** (https://app.netlify.com)
2. Click **"Add new site"** → **"Import an existing project"**
3. Select **"GitHub"** as your Git provider
4. Connect your GitHub account (if needed)
5. Select the `AcadTrack` repository
6. Configure the build settings:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`
7. Add environment variables:
   - Click **"Site settings"** → **"Build & deploy"** → **"Environment"**
   - Add:
     ```
     VITE_API_URL=https://acadtrack-api.onrender.com
     ```
8. Click **"Deploy site"**
9. Wait for build and deployment (2-3 minutes)
10. Once deployed, you'll get a URL like: `https://acadtrack.netlify.app`

#### Option B: Deploy via Netlify CLI

```bash
# 1. Install Netlify CLI
npm install -g netlify-cli

# 2. Login to Netlify
netlify login

# 3. Go to frontend directory
cd frontend

# 4. Deploy
netlify deploy --prod
```

### Step 3: Configure Custom Domain (Optional)

1. In Netlify Dashboard:
   - Go to **"Site settings"** → **"Domain management"**
   - Click **"Add custom domain"**
   - Enter your domain (e.g., `acadtrack.com`)
   - Follow DNS configuration steps

2. Enable HTTPS:
   - Netlify automatically provisions SSL certificate
   - Check **"HTTPS"** under **"Domain management"**

### Step 4: Verify Frontend Deployment

1. Visit your Netlify URL: `https://acadtrack.netlify.app`
2. Test login functionality
3. Verify API calls are reaching Render backend
4. Open browser DevTools → Network tab to confirm API URLs

---

## Part 3: Post-Deployment Configuration

### Enable CORS on Backend

Update `backend/server.js`:

```javascript
const cors = require('cors');

app.use(cors({
  origin: [
    'https://acadtrack.netlify.app',
    'https://yourdomain.com', // if using custom domain
    'http://localhost:3000'   // for local development
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

Redeploy backend to Render with these changes.

### Update API Service in Frontend

Ensure `frontend/src/services/api.js` uses the correct backend URL:

```javascript
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://acadtrack-api.onrender.com';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor for auth token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

---

## Part 4: Monitoring & Maintenance

### Monitor Render Backend

1. Go to Render Dashboard
2. Select your service (`acadtrack-api`)
3. View:
   - **Logs**: Real-time application logs
   - **Metrics**: CPU, memory, request count
   - **Deployments**: View deployment history

### Monitor Netlify Frontend

1. Go to Netlify Dashboard
2. Select your site
3. View:
   - **Deploys**: Deployment history and status
   - **Analytics**: Site traffic and performance
   - **Functions**: Serverless function logs (if used)

### Setup Alerts

**Render**:
- Click "Alerts" tab
- Set CPU/memory thresholds
- Get notifications via email

**Netlify**:
- Click "Notifications"
- Setup deploy notifications
- Configure Slack/Discord webhooks

---

## Part 5: Troubleshooting

### Backend Issues

**Problem**: "Cannot connect to MongoDB"
```
Solution:
1. Check MONGODB_URI in Render environment variables
2. Verify IP whitelist in MongoDB Atlas (add 0.0.0.0/0)
3. Test connection string locally first
```

**Problem**: "Cold start delays on Render"
```
Solution:
1. Upgrade to Paid plan for always-on service
2. Or use a keep-alive service like UptimeRobot
3. Accept 30-60 second delay for first request
```

**Problem**: "CORS errors in browser console"
```
Solution:
1. Update CORS configuration in backend/server.js
2. Add frontend URL to allowed origins
3. Redeploy backend and clear browser cache
```

### Frontend Issues

**Problem**: "API endpoints return 404"
```
Solution:
1. Check VITE_API_URL environment variable
2. Verify Render backend is running (check logs)
3. Test API URL in browser: https://acadtrack-api.onrender.com/api/auth/health
```

**Problem**: "Build fails on Netlify"
```
Solution:
1. Check build logs in Netlify Dashboard
2. Ensure base directory is set to "frontend"
3. Run "npm run build" locally to test
4. Check for environment variable issues
```

**Problem**: "Page reloads show 404"
```
Solution:
This is already handled by netlify.toml redirect rules.
If still occurring, manually add in Netlify Dashboard:
- Redirect from: /*
- Redirect to: /index.html
- Status code: 200 (rewrite)
```

---

## Part 6: Environment Variables Reference

### Backend (Render)

| Variable | Example | Description |
|----------|---------|-------------|
| `NODE_ENV` | `production` | Environment mode |
| `MONGODB_URI` | `mongodb+srv://...` | MongoDB Atlas connection |
| `JWT_SECRET` | `super-secret-key` | JWT signing secret |
| `ADMIN_CODE` | `ADMIN2024` | Admin registration code |
| `PORT` | `10000` | Server port |

### Frontend (Netlify)

| Variable | Example | Description |
|----------|---------|-------------|
| `VITE_API_URL` | `https://acadtrack-api.onrender.com` | Backend API URL |

---

## Part 7: Deployment Checklist

- [ ] MongoDB Atlas cluster created and configured
- [ ] MongoDB user created with strong password
- [ ] MongoDB IP whitelist configured (0.0.0.0/0)
- [ ] Render account created
- [ ] GitHub repository connected to Render
- [ ] Backend environment variables added to Render
- [ ] Backend deployed successfully
- [ ] Backend API responding (test health endpoint)
- [ ] Netlify account created
- [ ] Frontend GitHub repository connected to Netlify
- [ ] Frontend build command configured
- [ ] Frontend environment variables added
- [ ] Frontend deployed successfully
- [ ] CORS configured in backend
- [ ] API endpoints responding from frontend
- [ ] Login/authentication working end-to-end
- [ ] Database operations (CRUD) working
- [ ] Service Worker active (check DevTools)
- [ ] PWA manifest loading
- [ ] Performance metrics recorded

---

## Part 8: Performance Tips

1. **Enable caching** in both services
2. **Use CDN** - Netlify provides automatic CDN
3. **Optimize images** - Use WebP format
4. **Monitor cold starts** - Consider Render Pro for always-on
5. **Set up error tracking** - Use Sentry or similar
6. **Enable gzip compression** - Already configured in backend
7. **Test from multiple regions** - Use WebPageTest.org

---

## Support & Additional Resources

- **Render Documentation**: https://render.com/docs
- **Netlify Documentation**: https://docs.netlify.com
- **MongoDB Atlas Docs**: https://docs.atlas.mongodb.com
- **MERN Stack Guide**: https://www.mongodb.com/languages/mern-stack-tutorial

---

**Deployment Status**: Ready for production
**Last Updated**: December 7, 2025
