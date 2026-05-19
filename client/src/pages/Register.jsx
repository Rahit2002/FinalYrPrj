import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "", role: "patient", doctor_id: "", admin_code: "" });
  const [doctors, setDoctors] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/doctors").then(r => setDoctors(r.data)).catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.role === "doctor" && !form.doctor_id)
      return setError("Please select your doctor profile");
    setLoading(true); setError("");
    try {
      const res = await api.post("/auth/register", form);
      login(res.data.token, res.data.user);
      const role = res.data.user.role;
      navigate(role === "admin" ? "/admin" : "/");
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
    } finally { setLoading(false); }
  };

  const selectStyle = { width: "100%", padding: "12px 16px", background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 10, color: "var(--text)", fontFamily: "DM Sans,sans-serif", fontSize: "0.95rem", outline: "none" };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="auth-logo">seva</div>
        <p className="auth-subtitle">Create your account to get started.</p>
        {error && <div className="error-msg">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>I am a</label>
            <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value, doctor_id: "", admin_code: "" })} style={selectStyle}>
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {form.role === "doctor" && (
            <div className="form-group">
              <label>Select Your Doctor Profile *</label>
              <select value={form.doctor_id} onChange={e => setForm({ ...form, doctor_id: e.target.value })} style={selectStyle}>
                <option value="">-- Select your profile --</option>
                {doctors.map(d => <option key={d.id} value={d.id}>{d.name} — {d.speciality}</option>)}
              </select>
            </div>
          )}

          {form.role === "admin" && (
            <div className="form-group">
              <label>Admin Secret Code *</label>
              <input type="password" placeholder="Enter admin code" value={form.admin_code}
                onChange={e => setForm({ ...form, admin_code: e.target.value })} required />
              <small style={{ color: "var(--muted)", fontSize: "0.75rem", marginTop: 4, display: "block" }}>
                Contact your system administrator for the code.
              </small>
            </div>
          )}

          <div className="form-group">
            <label>Full Name</label>
            <input type="text" placeholder="Your name" value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" placeholder="you@example.com" value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Phone (optional)</label>
            <input type="tel" placeholder="+91 XXXXX XXXXX" value={form.phone}
              onChange={e => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" placeholder="Min 6 characters" value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })} required minLength={6} />
          </div>
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>
        <div className="auth-link">Already have an account? <Link to="/login">Sign in</Link></div>
      </div>
    </div>
  );
}
