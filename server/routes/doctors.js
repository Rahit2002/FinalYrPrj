const router = require("express").Router();
const pool = require("../db");
const authMiddleware = require("../middleware/auth");

// GET /api/doctors — all or filter by speciality
router.get("/", authMiddleware, async (req, res) => {
  try {
    const { speciality } = req.query;
    let query = "SELECT * FROM doctors";
    let params = [];

    if (speciality) {
      query += " WHERE LOWER(speciality) LIKE $1";
      params = [`%${speciality.toLowerCase()}%`];
    }

    query += " ORDER BY rating DESC";
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/doctors/specialities — unique list for dropdown
router.get("/specialities", authMiddleware, async (req, res) => {
  try {
    const result = await pool.query("SELECT DISTINCT speciality FROM doctors ORDER BY speciality");
    res.json(result.rows.map((r) => r.speciality));
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
