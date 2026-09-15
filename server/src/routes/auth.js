const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const pool = require("../config/db");

const makeToken = (u) =>
  jwt.sign({ id: u.id, role: u.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
const publicUser = (u) => ({
  id: u.id,
  fullName: u.full_name,
  email: u.email,
  mobile: u.mobile,
  city: u.city,
  state: u.state,
  country: u.country,
  role: u.role,
});

router.post("/register", async (req, res, next) => {
  try {
    const {
      fullName,
      mobile,
      email,
      city = "",
      state = "",
      country = "भारत",
      password,
    } = req.body;
    if (!fullName || !mobile || !email || !password)
      return res
        .status(400)
        .json({ message: "नाम, मोबाइल, ईमेल और पासवर्ड आवश्यक हैं।" });
    if (String(password).length < 6)
      return res
        .status(400)
        .json({ message: "पासवर्ड कम से कम 6 अक्षर का रखें।" });
    const [exists] = await pool.query(
      "SELECT id FROM users WHERE email=? OR mobile=? LIMIT 1",
      [email, mobile],
    );
    if (exists.length)
      return res
        .status(409)
        .json({ message: "यह ईमेल या मोबाइल पहले से पंजीकृत है।" });
    const id = uuidv4();
    const hash = await bcrypt.hash(password, 12);
    await pool.query(
      "INSERT INTO users (id,full_name,mobile,email,city,state,country,password_hash,role) VALUES (?,?,?,?,?,?,?,?,?)",
      [id, fullName, mobile, email, city, state, country, hash, "user"],
    );
    const user = {
      id,
      full_name: fullName,
      mobile,
      email,
      city,
      state,
      country,
      role: "user",
    };
    res.status(201).json({ token: makeToken(user), user: publicUser(user) });
  } catch (e) {
    next(e);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE email=? AND status="active" LIMIT 1',
      [email],
    );
    const user = rows[0];
    if (!user || !(await bcrypt.compare(password || "", user.password_hash)))
      return res.status(401).json({ message: "ईमेल या पासवर्ड गलत है।" });
    res.json({ token: makeToken(user), user: publicUser(user) });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
