# AcadTrack - Academic Activity Management System

A full-stack MERN (MongoDB, Express, React, Node.js) application for managing academic activities with authentication, role-based access control, and performance optimization.

## 🌐 Live Demo

- **Frontend**: https://acadtrack.netlify.app
- **Backend API**: https://acadtrack-api.onrender.com

## ✨ Features

- ✅ User Authentication (Login/Register)
- ✅ Role-Based Access Control (Admin/User)
- ✅ Create, Read, Update, Delete Activities
- ✅ Activity Filtering & Sorting
- ✅ Admin Dashboard for User Management
- ✅ Service Worker & PWA Support
- ✅ Offline Functionality
- ✅ Performance Optimized (Lighthouse 90+)

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- npm or yarn
- MongoDB Atlas account
- Git

### Local Development

1. **Clone Repository**
   ```bash
   git clone https://github.com/mannasca/AcadTrack.git
   cd AcadTrack
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   
   # Create .env file
   echo "MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/acadtrack" > .env
   echo "JWT_SECRET=your-secret-key-here" >> .env
   echo "ADMIN_CODE=ADMIN2024" >> .env
   echo "NODE_ENV=development" >> .env
   
   # Start backend
   npm start
   ```

3. **Setup Frontend (New Terminal)**
   ```bash
   cd frontend
   npm install
   
   # Create .env file
   echo "VITE_API_URL=http://localhost:5000" > .env
   
   # Start frontend
   npm run dev
   ```

4. **Access Application**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:5000

## 📦 Deployment

### Deploy to Production

See **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** for comprehensive deployment instructions.

**Quick Summary**:
- **Backend**: Deploy to [Render](https://render.com)
- **Frontend**: Deploy to [Netlify](https://netlify.com)
- **Database**: Use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

### Quick Deploy
```bash
# Windows
.\deploy.ps1

# macOS/Linux
bash deploy.sh
```

See **[QUICK_DEPLOY.md](./QUICK_DEPLOY.md)** for quick reference.

## 📁 Project Structure

```
AcadTrack/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── activityController.js
│   │   └── authController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── roleMiddleware.js
│   ├── models/
│   │   ├── Activity.js
│   │   └── User.js
│   ├── routes/
│   │   ├── activityRoutes.js
│   │   └── authRoutes.js
│   ├── .env
│   ├── package.json
│   ├── render.yaml
│   └── server.js
│
├── frontend/
│   ├── public/
│   │   ├── manifest.json
│   │   └── sw.js
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.production
│   ├── netlify.toml
│   ├── package.json
│   └── vite.config.js
│
├── DEPLOYMENT_GUIDE.md
├── QUICK_DEPLOY.md
├── BUNDLE_OPTIMIZATION.md
├── NETWORK_OPTIMIZATION.md
├── PERFORMANCE_OPTIMIZATION_SUMMARY.md
└── README.md
```

## 🔧 Technologies Used

### Backend
- Node.js & Express.js
- MongoDB & Mongoose
- JWT Authentication
- Compression & Caching Headers
- CORS enabled

### Frontend
- React 19
- React Router 7
- Vite (Build Tool)
- Axios (HTTP Client)
- Service Worker & PWA

### DevOps
- Docker (optional)
- GitHub Actions (optional)
- Render (Hosting)
- Netlify (Hosting)

## 📊 Performance Optimizations

- ✅ React Component Memoization (useCallback, useMemo)
- ✅ Code Splitting & Lazy Loading
- ✅ Gzip Compression (Level 9)
- ✅ Service Worker Caching
- ✅ Tree Shaking & Bundle Optimization
- ✅ Intelligent Cache Headers
- ✅ PWA Manifest

**Results**:
- LCP: 3,420ms → 2,500ms (27% improvement)
- Unused JS: 765 KiB → 100 KiB (87% reduction)
- Network Payloads: 3,165 KiB → 400-500 KiB (85% reduction)

## 🔐 Security Features

- JWT-based authentication
- Password hashing (bcrypt)
- CORS protection
- Role-based authorization
- Secure HTTP headers
- Environment variable protection

## 📝 API Endpoints

### Authentication
```
POST   /api/auth/register     - Register new user
POST   /api/auth/login        - Login user
GET    /api/auth/health       - Health check
```

### Activities
```
GET    /api/activities        - Get all activities
POST   /api/activities        - Create activity (admin)
GET    /api/activities/:id    - Get activity by ID
PUT    /api/activities/:id    - Update activity (admin)
DELETE /api/activities/:id    - Delete activity (admin)
```

### Users (Admin)
```
GET    /api/users             - Get all users (admin only)
GET    /api/users/:id         - Get user by ID
PUT    /api/users/:id         - Update user (admin only)
DELETE /api/users/:id         - Delete user (admin only)
```

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test
```

### Frontend Testing
```bash
cd frontend
npm run test
npm run test:ui  # Interactive mode
```

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints: 320px, 768px, 1024px, 1440px
- Fully responsive UI
- Touch-friendly interface

## ♿ Accessibility

- WCAG 2.1 Level AA compliance
- Semantic HTML
- ARIA labels
- Keyboard navigation
- Color contrast ratios

## 🐛 Troubleshooting

### Cannot connect to MongoDB
```
✓ Check MONGODB_URI in .env
✓ Verify username/password
✓ Ensure IP is whitelisted in MongoDB Atlas
✓ Test connection locally
```

### CORS errors in console
```
✓ Check VITE_API_URL in frontend/.env
✓ Verify backend is running
✓ Check CORS configuration in backend/server.js
```

### Build fails
```
✓ Clear node_modules: rm -rf node_modules
✓ Reinstall: npm install
✓ Clear cache: npm cache clean --force
✓ Try building: npm run build
```

## 📚 Documentation

- [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - Complete deployment guide
- [QUICK_DEPLOY.md](./QUICK_DEPLOY.md) - Quick reference
- [BUNDLE_OPTIMIZATION.md](./BUNDLE_OPTIMIZATION.md) - Bundle analysis
- [NETWORK_OPTIMIZATION.md](./NETWORK_OPTIMIZATION.md) - Network optimization
- [PERFORMANCE_OPTIMIZATION_SUMMARY.md](./PERFORMANCE_OPTIMIZATION_SUMMARY.md) - Performance report

## 👥 Contributors

- Team Members: [Your Team Names]
- GitHub: [@mannasca](https://github.com/mannasca)

## 📄 License

This project is licensed under the MIT License - see LICENSE file for details.

## 🤝 Support

For issues, questions, or suggestions:
1. Check existing issues on GitHub
2. Create a new issue with detailed description
3. Submit pull request with improvements

## 🙏 Acknowledgments

- React & Vite documentation
- Express.js community
- MongoDB Atlas
- Render & Netlify platforms

---

## 📋 Deployment Checklist

- [ ] MongoDB Atlas configured
- [ ] Environment variables set up
- [ ] Backend deployed to Render
- [ ] Frontend deployed to Netlify
- [ ] Custom domain (optional)
- [ ] HTTPS enabled
- [ ] Database backups configured
- [ ] Error tracking setup
- [ ] Performance monitoring active
- [ ] Documentation updated

---

**Status**: ✅ Production Ready
**Version**: 1.0.0
**Last Updated**: December 7, 2025

### Quick Links
- 🌐 [Live App](https://acadtrack.netlify.app)
- 📚 [Documentation](./DEPLOYMENT_GUIDE.md)
- 🚀 [Quick Deploy Guide](./QUICK_DEPLOY.md)
- 📊 [Performance Report](./PERFORMANCE_OPTIMIZATION_SUMMARY.md)
