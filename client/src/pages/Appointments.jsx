import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import api from "../api";

export default function Appointments() {
  const [doctors, setDoctors] = useState([]);
  const [myAppointments, setMyAppointments] = useState([]);
  const [form, setForm] = useState({ doctor_id: "", appointment_date: "", appointment_time: "", reason: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/doctors").then(r => setDoctors(r.data)).catch(() => {});
    fetchMyAppointments();
  }, []);

  const fetchMyAppointments = () => {
    api.get("/appointments/my").then(r => setMyAppointments(r.data)).catch(() => {});
  };

  const handleBook = async () => {
    if (!form.doctor_id || !form.appointment_date || !form.appointment_time)
      return setError("Please fill all required fields");
    setLoading(true); setError(""); setSuccess(false);
    try {
      await api.post("/appointments", form);
      setSuccess(true);
      setForm({ doctor_id: "", appointment_date: "", appointment_time: "", reason: "" });
      fetchMyAppointments();
    } catch (err) {
      setError(err.response?.data?.error || "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  const statusColor = (s) => {
    if (s === "confirmed") return "#00c48c";
    if (s === "cancelled") return "#ff4757";
    return "#ffc107";
  };

  return (
    <div className="page">
      <Navbar />
      <main className="main">
        <h1 className="page-title">📅 Book Appointment</h1>
        <p className="page-desc">Schedule a consultation with a specialist doctor.</p>

        <div className="card" style={{ marginBottom: 32 }}>
          <h3 style={{ fontFamily: "Syne,sans-serif", marginBottom: 20 }}>New Appointment</h3>
          {error && <div className="error-msg">{error}</div>}
          {success && <div style={{ background: "rgba(0,196,140,0.1)", border: "1px solid rgba(0,196,140,0.3)", color: "var(--primary)", padding: "10px 14px", borderRadius: 8, marginBottom: 16, fontSize: "0.9rem" }}>✅ Appointment booked successfully!</div>}

          <div className="form-group">
            <label>Select Doctor *</label>
            <select value={form.doctor_id} onChange={e => setForm({ ...form, doctor_id: e.target.value })}
              style={{ width: "100%", padding: "12px 16px", background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 10, color: "var(--text)", fontFamily: "DM Sans,sans-serif", fontSize: "0.95rem", outline: "none" }}>
              <option value="">-- Choose a doctor --</option>
              {doctors.map(d => (
                <option key={d.id} value={d.id}>{d.name} — {d.speciality} ({d.hospital})</option>
              ))}
            </select>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div className="form-group">
              <label>Date *</label>
              <input type="date" value={form.appointment_date} min={new Date().toISOString().split("T")[0]}
                onChange={e => setForm({ ...form, appointment_date: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Time *</label>
              <select value={form.appointment_time} onChange={e => setForm({ ...form, appointment_time: e.target.value })}
                style={{ width: "100%", padding: "12px 16px", background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 10, color: "var(--text)", fontFamily: "DM Sans,sans-serif", fontSize: "0.95rem", outline: "none" }}>
                <option value="">-- Select time --</option>
                {["09:00 AM","09:30 AM","10:00 AM","10:30 AM","11:00 AM","11:30 AM","02:00 PM","02:30 PM","03:00 PM","03:30 PM","04:00 PM","04:30 PM"].map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Reason for Visit</label>
            <input type="text" placeholder="e.g. Routine checkup, follow-up..."
              value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })} />
          </div>

          <button className="diagnosis-btn" onClick={handleBook} disabled={loading}>
            {loading ? "Booking..." : "Book Appointment →"}
          </button>
        </div>

        <h2 style={{ fontFamily: "Syne,sans-serif", marginBottom: 16, fontSize: "1.2rem" }}>My Appointments</h2>
        {myAppointments.length === 0 ? (
          <div className="loading">No appointments yet</div>
        ) : (
          myAppointments.map(a => (
            <div key={a.id} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: 20, marginBottom: 12, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
              <div>
                <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 700, marginBottom: 4 }}>{a.doctor_name}</div>
                <div style={{ fontSize: "0.83rem", color: "var(--muted)" }}>{a.speciality} · {a.hospital}</div>
                <div style={{ fontSize: "0.83rem", color: "var(--muted)", marginTop: 4 }}>📅 {new Date(a.appointment_date).toDateString()} at {a.appointment_time}</div>
                <div style={{ fontSize: "0.83rem", color: "var(--muted)" }}>Reason: {a.reason}</div>
              </div>
              <span style={{ padding: "4px 14px", borderRadius: 20, fontSize: "0.78rem", fontWeight: 600, background: `${statusColor(a.status)}22`, color: statusColor(a.status), textTransform: "uppercase", whiteSpace: "nowrap" }}>
                {a.status}
              </span>
            </div>
          ))
        )}
      </main>
    </div>
  );
}
