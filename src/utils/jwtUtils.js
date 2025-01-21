const jwt = require("jsonwebtoken");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const generateToken = (payload) => {
  if (!JWT_SECRET_KEY) {
    throw new Error("JWT_SECRET_KEY is not defined");
  }
  const token = jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: "1h" });
  return token;
};

const refreshToken = (token) => {
  try {
    if (!JWT_SECRET_KEY) {
      throw new Error("JWT_SECRET_KEY is not defined");
    }
    const decoded = jwt.verify(token, JWT_SECRET_KEY);
    const payload = { userId: decoded.userId, isAdmin: decoded.isAdmin };
    const newToken = generateToken(payload);
    return newToken;
  } catch (error) {
    console.error("Error refreshing token:", error);
    return null;
  }
};

module.exports = { generateToken, refreshToken };
