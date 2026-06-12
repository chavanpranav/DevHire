const isAdmin = (req, res, next) => {
  // Check for both uppercase COMPANY and ADMIN roles
  if (req.user && (req.user.role === "ADMIN" || req.user.role === "COMPANY")) {
    next();
  } else {
    res.status(403).json({ message: "Admin or Company permissions required" });
  }
};

export default isAdmin;