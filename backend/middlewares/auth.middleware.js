// middleware/auth.middleware.js

import jwt from "jsonwebtoken";

// VERIFY TOKEN

export const verifyToken = async (req, res, next) => {
  try {
    // Get token from cookies
    const token = req.cookies.token;

    // Check token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - No token provided",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, "SECRET");
    // Attach user data to request
    req.user = decoded;

    next();
  } catch (error) {
    console.error("Verify Token Error:", error);
    return res.status(401).json({
      success: false,
      message: "Unauthorized - Invalid token",
    });
  }
};

// AUTHORIZE ROLES

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    // Check role exists
    if (!req.user?.role) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }
    // Check allowed roles
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to access this route",
      });
    }
    next();
  };
};

// validate trhough zod schema

export const validate = (schema) => {
  return async (req, res, next) => {
    try {
      const result = schema.safeParse(req.body);

      if (!result.success) {
        const errors = result.error.issues.map((err) => ({
          field: err.path[0],
          message: err.message,
        }));

        return res.status(400).json({
          success: false,
          errors,
        });
      }

      req.body = result.data;

      next();
    } catch (error) {
      console.error("Validation Error:", error);

      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  };
};
