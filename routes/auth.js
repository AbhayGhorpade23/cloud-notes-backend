const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    let user = await User.findOne({ email });
    if (user) return res.json({ error: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    user = new User({ email, password: hashedPassword });
    await user.save();

    res.json({ message: "User registered" });
  } catch {
    res.json({ error: "Server error" });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.json({ error: "Invalid password" });

    const token = jwt.sign(
      { id: user._id },                 // ✅ payload
      process.env.JWT_SECRET,           // ✅ same secret
      { expiresIn: "1d" }
    );

    res.json({ token });
  } catch {
    res.json({ error: "Server error" });
  }
});

module.exports = router;