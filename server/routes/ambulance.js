const router = require("express").Router();
const pool = require("../db");
const authMiddleware = require("../middleware/auth");

// GET /api/ambulance — available ambulances (public for users)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM ambulances WHERE available = true ORDER BY id"
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/ambulance/all — ALL ambulances (admin)
router.get("/all", authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM ambulances ORDER BY id"
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// POST /api/ambulance/request — user requests ambulance
router.post("/request", authMiddleware, async (req, res) => {
  try {
    const { pickup_location } = req.body;
    if (!pickup_location)
      return res.status(400).json({ error: "Pickup location required" });

    const amb = await pool.query(
      "SELECT * FROM ambulances WHERE available = true ORDER BY id LIMIT 1"
    );
    if (amb.rows.length === 0)
      return res.status(503).json({ error: "No ambulances available right now. Please try again shortly." });

    const ambulance = amb.rows[0];

    await pool.query(
      "UPDATE ambulances SET available = false WHERE id = $1",
      [ambulance.id]
    );

    const request = await pool.query(
      "INSERT INTO ambulance_requests (user_id, pickup_location, ambulance_id, status) VALUES ($1,$2,$3,'confirmed') RETURNING *",
      [req.user.id, pickup_location, ambulance.id]
    );

    res.status(201).json({
      message: "Ambulance dispatched!",
      request: request.rows[0],
      ambulance: {
        driver: ambulance.driver_name,
        vehicle: ambulance.vehicle_number,
        phone: ambulance.phone,
        currentLocation: ambulance.location,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// PATCH /api/ambulance/:id/availability — admin toggles availability
router.patch("/:id/availability", authMiddleware, async (req, res) => {
  try {
    const { available } = req.body;
    if (typeof available !== "boolean")
      return res.status(400).json({ error: "available must be true or false" });

    const result = await pool.query(
      "UPDATE ambulances SET available = $1 WHERE id = $2 RETURNING *",
      [available, req.params.id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ error: "Ambulance not found" });

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// POST /api/ambulance/add — admin adds new ambulance
router.post("/add", authMiddleware, async (req, res) => {
  try {
    const { driver_name, vehicle_number, location, phone } = req.body;
    if (!driver_name || !vehicle_number || !phone)
      return res.status(400).json({ error: "Driver name, vehicle number and phone required" });

    const result = await pool.query(
      "INSERT INTO ambulances (driver_name, vehicle_number, location, phone, available) VALUES ($1,$2,$3,$4,true) RETURNING *",
      [driver_name, vehicle_number, location || "Base Station", phone]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/ambulance/my-requests
router.get("/my-requests", authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT ar.*, a.driver_name, a.vehicle_number, a.phone as ambulance_phone
       FROM ambulance_requests ar
       JOIN ambulances a ON ar.ambulance_id = a.id
       WHERE ar.user_id = $1 ORDER BY ar.requested_at DESC`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
