import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

// Xác thực token
export const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Chưa đăng nhập" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.auth = decoded; // { user_id, role }
    next();
  } catch (err) {
    res.status(403).json({ message: "Token không hợp lệ" });
  }
};

// Kiểm tra quyền
export const requireRoles =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.auth?.role)) {
      return res.status(403).json({ message: "Không đủ quyền" });
    }
    next();
  };
