const router = require("express").Router();
const pool = require("../db");
const authMiddleware = require("../middleware/auth");

// POST /api/appointments — book an appointment
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { doctor_id, appointment_date, appointment_time, reason } = req.body;
    if (!doctor_id || !appointment_date || !appointment_time)
      return res.status(400).json({ error: "Doctor, date and time required" });

    const result = await pool.query(
      `INSERT INTO appointments (user_id, doctor_id, appointment_date, appointment_time, reason, status)
       VALUES ($1,$2,$3,$4,$5,'pending') RETURNING *`,
      [req.user.id, doctor_id, appointment_date, appointment_time, reason || "General consultation"]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/appointments/my — patient's own appointments
router.get("/my", authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT a.*, d.name as doctor_name, d.speciality, d.hospital
       FROM appointments a
       JOIN doctors d ON a.doctor_id = d.id
       WHERE a.user_id = $1 ORDER BY a.appointment_date DESC`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/appointments/all — admin sees all appointments
router.get("/all", authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT a.*, d.name as doctor_name, d.speciality, u.name as patient_name, u.email as patient_email
       FROM appointments a
       JOIN doctors d ON a.doctor_id = d.id
       JOIN users u ON a.user_id = u.id
       ORDER BY a.appointment_date DESC`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/appointments/ambulance-log — admin sees all ambulance requests
router.get("/ambulance-log", authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT ar.*, a.driver_name, a.vehicle_number, a.phone as ambulance_phone, a.location as ambulance_location,
              u.name as patient_name, u.email as patient_email
       FROM ambulance_requests ar
       JOIN ambulances a ON ar.ambulance_id = a.id
       JOIN users u ON ar.user_id = u.id
       ORDER BY ar.requested_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
