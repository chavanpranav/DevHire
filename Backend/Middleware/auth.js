import jwt from "jsonwebtoken";

/**
 * Verify JWT Token
 */

export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
};

/**
 * Role Based Access Control (RBAC)
 *
 * Example:
 * roleMiddleware("ADMIN")
 * roleMiddleware("COMPANY")
 * roleMiddleware("ADMIN", "COMPANY")
 */

export const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized.",
        });
      }

      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: "Forbidden. Insufficient permissions.",
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Authorization error.",
      });
    }
  };
};