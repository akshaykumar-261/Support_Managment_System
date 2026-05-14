const checkRole = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      const roleName = req.user.role?.name;
      if (!allowedRoles.includes(roleName)) {
        return res.status(403).json({
          message: `Access Denied. Allowed roles: ${allowedRoles.join(", ")}`,
        });
      }
      next();
    } catch (error) {
      console.log("Role middleweare Error:", error.message);
      res.status(500).json({ message: "Server Error" });
    }
  };
};

export default checkRole;