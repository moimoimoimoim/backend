const jwt = require("jsonwebtoken");

// Authorization 헤더에서 Bearer 토큰을 사용하는 방식
const authenticateJWT = (req, res, next) => {
  const token = req.cookies["token"];

  if (!token) {
    return res.status(401).json({ message: "Access denied. Token missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded; // JWT payload을 req.user로 저장
    next();
  } catch (error) {
    console.error("Token validation error:", error);
    return res.status(403).json({ message: "Invalid or expired token." });
  }
};

module.exports = { authenticateJWT };
