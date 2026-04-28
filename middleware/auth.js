const jwt = require("jsonwebtoken");
const SECRET = "mysecretkey";

module.exports = function(req, res, next) {
  const token = req.headers["authorization"];

  if (!token) return res.status(401).json({ error: "No token" });

  try {
    const verified = jwt.verify(token, SECRET);
    req.user = verified;
    next();
  } catch {
    res.status(400).json({ error: "Invalid token" });
  }
};