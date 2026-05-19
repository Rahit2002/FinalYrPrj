const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../db");

// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, phone, role, doctor_id, admin_code } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ error: "Name, email, password required" });

    // Block admin registration without correct secret code
    if (role === "admin") {
      const correctCode = process.env.ADMIN_SECRET_CODE || "seva@admin2024";
      if (admin_code !== correctCode)
        return res.status(403).json({ error: "Invalid admin code. Access denied." });
    }

    const existing = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
    if (existing.rows.length > 0)
      return res.status(409).json({ error: "Email already registered" });

    const hashed = await bcrypt.hash(password, 10);
    const userRole = role || "patient";
    const linkedDoctorId = userRole === "doctor" ? (doctor_id || null) : null;

    const result = await pool.query(
      "INSERT INTO users (name, email, password, phone, role, doctor_id) VALUES ($1,$2,$3,$4,$5,$6) RETURNING id, name, email, role, doctor_id",
      [name, email, hashed, phone, userRole, linkedDoctorId]
    );

    const user = result.rows[0];
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, doctor_id: user.doctor_id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({ token, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (result.rows.length === 0)
      return res.status(401).json({ error: "Invalid credentials" });

    const user = result.rows[0];
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, doctor_id: user.doctor_id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role, doctor_id: user.doctor_id }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
