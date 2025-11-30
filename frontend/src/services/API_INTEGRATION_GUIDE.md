/**
 * ===============================================
 * API INTEGRATION GUIDE
 * React UI ↔ Express CRUD API Communication
 * ===============================================
 * 
 * This document explains how the React frontend connects to the Express backend
 * and implements seamless data transfer between UI and API.
 */

// ===============================================
// 1. API SERVICE LAYER ARCHITECTURE
// ===============================================

/**
 * Location: frontend/src/services/api.js
 * 
 * The API service layer provides:
 * - Centralized API endpoint management
 * - Automatic token injection (Bearer token)
 * - Consistent error handling
 * - Request/response transformation
 * - Logout functionality
 */

// ===============================================
// 2. AVAILABLE API METHODS
// ===============================================

/**
 * AUTHENTICATION ENDPOINTS (authAPI)
 * 
 * 1. authAPI.register(name, email, password, adminCode)
 *    - Creates new user account
 *    - Optional adminCode for admin registration
 *    - Response: { token, user }
 * 
 * 2. authAPI.login(email, password)
 *    - Authenticates user and returns JWT token
 *    - Token stored in localStorage
 *    - Response: { token, user }
 * 
 * 3. authAPI.getAllUsers()
 *    - Admin-only: retrieves all system users
 *    - Response: { users: [User] }
 * 
 * 4. authAPI.logout()
 *    - Clears local storage
 *    - Client-side only
 */

/**
 * ACTIVITY ENDPOINTS (activityAPI)
 * 
 * 1. activityAPI.getAll()
 *    - Fetches all activities for authenticated user
 *    - Response: [Activity]
 * 
 * 2. activityAPI.getById(id)
 *    - Fetches single activity by ID
 *    - Response: Activity
 * 
 * 3. activityAPI.create(activityData)
 *    - Admin-only: creates new activity
 *    - Request: { title, description, course, date, status }
 *    - Response: Activity
 * 
 * 4. activityAPI.update(id, activityData)
 *    - Admin-only: updates existing activity
 *    - Request: { title, description, course, date, status }
 *    - Response: Activity
 * 
 * 5. activityAPI.delete(id)
 *    - Admin-only: deletes activity
 *    - Response: { message }
 */

// ===============================================
// 3. USAGE EXAMPLES
// ===============================================

/**
 * EXAMPLE 1: Login
 */
// import { authAPI, storeUserData } from '../services/api';
// 
// const handleLogin = async (email, password) => {
//   const result = await authAPI.login(email, password);
//   
//   if (result.success) {
//     storeUserData(result.data.token, result.data.user);
//     navigate('/dashboard');
//   } else {
//     setError(result.error);
//   }
// };

/**
 * EXAMPLE 2: Fetch Activities
 */
// import { activityAPI } from '../services/api';
// 
// useEffect(() => {
//   const fetchActivities = async () => {
//     const result = await activityAPI.getAll();
//     
//     if (result.success) {
//       setActivities(result.data);
//     } else {
//       setError(result.error);
//     }
//   };
//   
//   fetchActivities();
// }, []);

/**
 * EXAMPLE 3: Create Activity
 */
// import { activityAPI } from '../services/api';
// 
// const handleCreate = async (formData) => {
//   const result = await activityAPI.create(formData);
//   
//   if (result.success) {
//     navigate('/dashboard');
//   } else {
//     setError(result.error);
//   }
// };

// ===============================================
// 4. UTILITY FUNCTIONS
// ===============================================

/**
 * isAuthenticated()
 * - Returns: boolean
 * - Check if user has valid token
 * 
 * getCurrentUser()
 * - Returns: User object or null
 * - Get current logged-in user data
 * 
 * isAdmin()
 * - Returns: boolean
 * - Check if current user is admin
 * 
 * storeUserData(token, user)
 * - Store token and user in localStorage
 * - Called after successful login/register
 * 
 * clearUserData()
 * - Remove all user data from localStorage
 * - Called on logout
 */

// ===============================================
// 5. ERROR HANDLING
// ===============================================

/**
 * All API methods return consistent response format:
 * 
 * Success:
 * {
 *   success: true,
 *   data: { ... },
 *   status: 200
 * }
 * 
 * Error:
 * {
 *   success: false,
 *   error: "Error message",
 *   status: null
 * }
 * 
 * Always check result.success before using result.data
 */

// ===============================================
// 6. AUTHENTICATION FLOW
// ===============================================

/**
 * 1. User Registration
 *    - User fills form and submits
 *    - authAPI.register() called
 *    - Backend validates and creates user
 *    - Frontend redirects to login
 * 
 * 2. User Login
 *    - User enters credentials
 *    - authAPI.login() called
 *    - Backend validates and returns token
 *    - Token stored in localStorage
 *    - User data stored in localStorage
 *    - Redirect to dashboard
 * 
 * 3. Token Usage
 *    - getToken() retrieves token from localStorage
 *    - Automatically added to Authorization header
 *    - Bearer format: "Bearer <token>"
 *    - Sent with every authenticated request
 * 
 * 4. User Logout
 *    - authAPI.logout() or clearUserData()
 *    - localStorage cleared
 *    - User redirected to login
 */

// ===============================================
// 7. DATA FLOW DIAGRAM
// ===============================================

/**
 * User Interaction
 *        ↓
 * React Component
 *        ↓
 * Event Handler (handleSubmit, useEffect)
 *        ↓
 * Import & Call API Method (authAPI.login)
 *        ↓
 * API Service Layer (src/services/api.js)
 *        ├─ Get token from localStorage
 *        ├─ Add Authorization header
 *        ├─ Make fetch request
 *        └─ Handle response/error
 *        ↓
 * Express Backend (backend/server.js)
 *        ├─ Route handler
 *        ├─ Middleware (auth, role check)
 *        ├─ Database operation
 *        └─ Return JSON response
 *        ↓
 * API Service (Parse & Format Response)
 *        ↓
 * React Component (Update State & UI)
 */

// ===============================================
// 8. COMPONENTS USING API
// ===============================================

/**
 * ✅ Updated Components:
 * 
 * 1. pages/Login.jsx
 *    - authAPI.login()
 *    - storeUserData()
 * 
 * 2. components/Register.jsx
 *    - authAPI.register()
 * 
 * 3. components/Dashboard.jsx
 *    - activityAPI.getAll()
 *    - activityAPI.delete()
 *    - getCurrentUser()
 * 
 * 4. components/AddActivity.jsx
 *    - activityAPI.create()
 *    - getCurrentUser()
 * 
 * 5. components/EditActivity.jsx
 *    - activityAPI.getById()
 *    - activityAPI.update()
 *    - getCurrentUser()
 * 
 * 6. components/Users.jsx
 *    - authAPI.getAllUsers()
 *    - getCurrentUser()
 * 
 * 7. pages/Profile.jsx
 *    - getCurrentUser()
 * 
 * 8. pages/Home.jsx
 *    - isAuthenticated()
 */

// ===============================================
// 9. ENVIRONMENT CONFIGURATION
// ===============================================

/**
 * .env.local (frontend)
 * 
 * VITE_API_URL=http://localhost:5000
 * 
 * Or leave empty to use default (http://localhost:5000)
 */

// ===============================================
// 10. TESTING API INTEGRATION
// ===============================================

/**
 * 1. Start Backend
 *    cd backend
 *    npm run serve
 * 
 * 2. Start Frontend
 *    cd frontend
 *    npm run dev
 * 
 * 3. Test Registration
 *    - Navigate to /register
 *    - Fill form and submit
 *    - Should redirect to /login
 * 
 * 4. Test Login
 *    - Enter credentials
 *    - Token should appear in localStorage
 *    - Should redirect to /dashboard
 * 
 * 5. Test Activity Creation (Admin)
 *    - Navigate to /add
 *    - Fill activity form
 *    - Should appear in /dashboard
 * 
 * 6. Test Activity Update (Admin)
 *    - Click edit on activity
 *    - Modify fields
 *    - Should update in /dashboard
 * 
 * 7. Test User View (Admin)
 *    - Navigate to /users
 *    - Should display all system users
 */

// ===============================================
// 11. TROUBLESHOOTING
// ===============================================

/**
 * Issue: "Network error"
 * Solution:
 * - Check backend is running on correct port
 * - Verify VITE_API_URL matches backend URL
 * - Check browser console for CORS errors
 * 
 * Issue: "Token not found" after reload
 * Solution:
 * - Token expires after 24 hours (configurable)
 * - Clear localStorage and login again
 * - Check browser Storage tab
 * 
 * Issue: 401 Unauthorized
 * Solution:
 * - Token missing or expired
 * - Check Authorization header format
 * - Verify token in localStorage
 * 
 * Issue: 403 Forbidden
 * Solution:
 * - User doesn't have admin role
 * - Only admin can access certain endpoints
 * - Check user.role in localStorage
 */

// ===============================================
// 12. SECURITY CONSIDERATIONS
// ===============================================

/**
 * ✅ Implemented:
 * 1. JWT Token-based authentication
 * 2. Bearer token in Authorization header
 * 3. Role-based access control (admin/user)
 * 4. Protected routes on backend
 * 5. LocalStorage for token persistence
 * 
 * ⚠️ Important:
 * 1. NEVER hardcode tokens
 * 2. NEVER commit .env files with secrets
 * 3. Use HTTPS in production
 * 4. Validate all user input on backend
 * 5. Implement CSRF protection
 */
