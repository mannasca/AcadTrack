// Authorization middleware for role-based access control

export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      // Check if user is authenticated
      if (!req.user) {
        return res.status(401).json({ message: "No user found. Please login." });
      }

      // Check if user role is in allowed roles
      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({ 
          message: `Access denied. Required role: ${allowedRoles.join(" or ")}. Your role: ${req.user.role}` 
        });
      }

      next();
    } catch (error) {
      res.status(500).json({ message: "Authorization error", error: error.message });
    }
  };
};
