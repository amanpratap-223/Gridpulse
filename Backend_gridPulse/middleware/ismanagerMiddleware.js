
export const isManager = (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized: Please login first" });
  if (req.user.role !== "manager") return res.status(403).json({ message: "Forbidden: Managers only" });
  next();
};
