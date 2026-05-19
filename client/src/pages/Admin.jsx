import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import api from "../api";

export default function Admin() {
  const [ambulanceLogs, setAmbulanceLogs] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [ambulances, setAmbulances] = useState([]);
  const [tab, setTab] = useState("appointments");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [newAmb, setNewAmb] = useState({ driver_name: "", vehicle_number: "", location: "", phone: "" });
  const [addError, setAddError] = useState("");
  const [addSuccess, setAddSuccess] = useState(false);

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      const [ambLog, appt, allAmb] = await Promise.all([
        api.get("/appointments/ambulance-log"),
        api.get("/appointments/all"),
        api.get("/ambulance/all"),
      ]);
      setAmbulanceLogs(ambLog.data);
      setAppointments(appt.data);
      setAmbulances(allAmb.data);
    } catch (e) {}
    finally { setLoading(false); }
  };

  const updateApptStatus = async (id, status) => {
    setUpdating(`appt-${id}`);
    try {
      await api.patch(`/appointments/${id}/status`, { status });
      setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    } catch { alert("Update failed"); }
    finally { setUpdating(null); }
  };

  const toggleAmbulance = async (id, current) => {
    setUpdating(`amb-${id}`);
    try {
      const res = await api.patch(`/ambulance/${id}/availability`, { available: !current });
      setAmbulances(prev => prev.map(a => a.id === id ? res.data : a));
    } catch { alert("Update failed"); }
    finally { setUpdating(null); }
  };

  const addAmbulance = async () => {
    if (!newAmb.driver_name || !newAmb.vehicle_number || !newAmb.phone)
      return setAddError("Driver name, vehicle number and phone are required");
    setAddError(""); setAddSuccess(false);
    try {
      const res = await api.post("/ambulance/add", newAmb);
      setAmbulances(prev => [...prev, res.data]);
      setNewAmb({ driver_name: "", vehicle_number: "", location: "", phone: "" });
      setAddSuccess(true);
      setTimeout(() => setAddSuccess(false), 3000);
    } catch (err) {
      setAddError(err.response?.data?.error || "Failed to add ambulance");
    }
  };

  const statusColor = (s) => {
    if (s === "confirmed" || s === "completed") return "#00c48c";
    if (s === "cancelled") return "#ff4757";
    return "#ffc107";
  };

  const stats = [
    { label: "Appointments", val: appointments.length, color: "var(--primary)" },
    { label: "Pending", val: appointments.filter(a => a.status === "pending").length, color: "#ffc107" },
    { label: "Ambulances", val: ambulances.length, color: "#7c83fd" },
    { label: "Available", val: ambulances.filter(a => a.available).length, color: "#00c48c" },
    { label: "Dispatched", val: ambulances.filter(a => !a.available).length, color: "#ff4757" },
    { label: "Total Calls", val: ambulanceLogs.length, color: "#ff7f50" },
  ];

  const tabs = [
    { key: "appointments", label: "📅 Appointments" },
    { key: "ambulances", label: "🚑 Manage Ambulances" },
    { key: "logs", label: "📋 Dispatch Log" },
  ];

  return (
    <div className="page">
      <Navbar />
      <main className="main">
        <h1 className="page-title">🛡️ Admin Dashboard</h1>
        <p className="page-desc">Full control over appointments and ambulance fleet.</p>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(130px,1fr))", gap: 14, marginBottom: 28 }}>
          {stats.map(s => (
            <div key={s.label} className="card" style={{ padding: "18px 16px", textAlign: "center" }}>
              <div style={{ fontSize: "1.8rem", fontWeight: 800, color: s.color, fontFamily: "Syne,sans-serif" }}>{s.val}</div>
              <div style={{ color: "var(--muted)", fontSize: "0.75rem", marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              style={{ padding: "10px 20px", borderRadius: 10, border: "1px solid var(--border)", background: tab === t.key ? "var(--primary)" : "var(--surface)", color: tab === t.key ? "#000" : "var(--muted)", fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: "0.85rem", cursor: "pointer", transition: "all 0.2s" }}>
              {t.label}
            </button>
          ))}
        </div>

        {loading ? <div className="loading"><div className="spinner" />Loading...</div>

        /* ── APPOINTMENTS TAB ── */
        : tab === "appointments" ? (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.87rem" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid var(--border)" }}>
                  {["#","Patient","Doctor","Date & Time","Reason","Status","Change Status"].map(h => (
                    <th key={h} style={{ padding: "12px 16px", textAlign: "left", color: "var(--muted)", fontWeight: 600, whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {appointments.length === 0
                  ? <tr><td colSpan={7} style={{ padding: 40, textAlign: "center", color: "var(--muted)" }}>No appointments yet</td></tr>
                  : appointments.map((a, i) => (
                  <tr key={a.id} style={{ borderBottom: "1px solid var(--border)" }}
                    onMouseEnter={e => e.currentTarget.style.background = "var(--surface2)"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    <td style={{ padding: "12px 16px", color: "var(--muted)" }}>{i+1}</td>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ fontWeight: 600 }}>{a.patient_name}</div>
                      <div style={{ color: "var(--muted)", fontSize: "0.73rem" }}>{a.patient_email}</div>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ fontWeight: 600 }}>{a.doctor_name}</div>
                      <span className="doctor-spec" style={{ fontSize: "0.7rem" }}>{a.speciality}</span>
                    </td>
                    <td style={{ padding: "12px 16px", whiteSpace: "nowrap" }}>
                      {new Date(a.appointment_date).toDateString()}
                      <div style={{ color: "var(--muted)", fontSize: "0.73rem" }}>{a.appointment_time}</div>
                    </td>
                    <td style={{ padding: "12px 16px", color: "var(--muted)", maxWidth: 150 }}>{a.reason}</td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: "0.72rem", fontWeight: 600, background: `${statusColor(a.status)}22`, color: statusColor(a.status), textTransform: "uppercase" }}>
                        {a.status}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <select value={a.status} disabled={updating === `appt-${a.id}`}
                        onChange={e => updateApptStatus(a.id, e.target.value)}
                        style={{ padding: "6px 10px", background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text)", fontSize: "0.8rem", cursor: "pointer", outline: "none" }}>
                        <option value="pending">⏳ Pending</option>
                        <option value="confirmed">✅ Confirmed</option>
                        <option value="completed">✓ Completed</option>
                        <option value="cancelled">✗ Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        /* ── AMBULANCES TAB ── */
        ) : tab === "ambulances" ? (
          <>
            {/* Add new ambulance form */}
            <div className="card" style={{ marginBottom: 28 }}>
              <h3 style={{ fontFamily: "Syne,sans-serif", marginBottom: 16 }}>➕ Add New Ambulance</h3>
              {addError && <div className="error-msg">{addError}</div>}
              {addSuccess && <div style={{ background: "rgba(0,196,140,0.1)", border: "1px solid rgba(0,196,140,0.3)", color: "var(--primary)", padding: "10px 14px", borderRadius: 8, marginBottom: 16, fontSize: "0.88rem" }}>✅ Ambulance added successfully!</div>}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 14 }}>
                {[
                  { key: "driver_name", label: "Driver Name *", placeholder: "e.g. Rajan Verma" },
                  { key: "vehicle_number", label: "Vehicle Number *", placeholder: "e.g. MH-01-XY-1234" },
                  { key: "location", label: "Base Location", placeholder: "e.g. Andheri East" },
                  { key: "phone", label: "Phone *", placeholder: "+91-XXXXXXXXXX" },
                ].map(f => (
                  <div key={f.key} className="form-group" style={{ margin: 0 }}>
                    <label>{f.label}</label>
                    <input type="text" placeholder={f.placeholder} value={newAmb[f.key]}
                      onChange={e => setNewAmb({ ...newAmb, [f.key]: e.target.value })} />
                  </div>
                ))}
              </div>
              <button onClick={addAmbulance}
                style={{ marginTop: 18, padding: "12px 28px", background: "var(--primary)", border: "none", borderRadius: 10, color: "#000", fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: "0.9rem", cursor: "pointer" }}>
                Add Ambulance
              </button>
            </div>

            {/* Fleet list */}
            <h3 style={{ fontFamily: "Syne,sans-serif", marginBottom: 16, fontSize: "1rem" }}>
              Fleet ({ambulances.length} total · {ambulances.filter(a => a.available).length} available)
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 16 }}>
              {ambulances.map(a => (
                <div key={a.id} style={{ background: "var(--surface)", border: `1px solid ${a.available ? "rgba(0,196,140,0.3)" : "rgba(255,71,87,0.3)"}`, borderRadius: 14, padding: 20 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div style={{ fontSize: "2rem" }}>🚑</div>
                    <span style={{ padding: "4px 12px", borderRadius: 20, fontSize: "0.75rem", fontWeight: 700, background: a.available ? "rgba(0,196,140,0.15)" : "rgba(255,71,87,0.15)", color: a.available ? "#00c48c" : "#ff4757" }}>
                      {a.available ? "AVAILABLE" : "DISPATCHED"}
                    </span>
                  </div>
                  <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: "1rem", margin: "12px 0 4px" }}>{a.driver_name}</div>
                  <div style={{ color: "var(--muted)", fontSize: "0.83rem", lineHeight: 1.8 }}>
                    <div>🚗 {a.vehicle_number}</div>
                    <div>📍 {a.location}</div>
                    <div>📞 {a.phone}</div>
                  </div>
                  <button onClick={() => toggleAmbulance(a.id, a.available)} disabled={updating === `amb-${a.id}`}
                    style={{ marginTop: 14, width: "100%", padding: "9px", border: "none", borderRadius: 9, background: a.available ? "rgba(255,71,87,0.15)" : "rgba(0,196,140,0.15)", color: a.available ? "#ff4757" : "#00c48c", fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: "0.85rem", cursor: updating === `amb-${a.id}` ? "not-allowed" : "pointer", transition: "all 0.2s" }}>
                    {updating === `amb-${a.id}` ? "Updating..." : a.available ? "🔴 Mark Unavailable" : "🟢 Mark Available"}
                  </button>
                </div>
              ))}
            </div>
          </>

        /* ── DISPATCH LOG TAB ── */
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.87rem" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid var(--border)" }}>
                  {["#","Patient","Pickup Location","Driver","Vehicle","Contact","Status","Time"].map(h => (
                    <th key={h} style={{ padding: "12px 16px", textAlign: "left", color: "var(--muted)", fontWeight: 600, whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ambulanceLogs.length === 0
                  ? <tr><td colSpan={8} style={{ padding: 40, textAlign: "center", color: "var(--muted)" }}>No dispatches yet</td></tr>
                  : ambulanceLogs.map((log, i) => (
                  <tr key={log.id} style={{ borderBottom: "1px solid var(--border)" }}
                    onMouseEnter={e => e.currentTarget.style.background = "var(--surface2)"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    <td style={{ padding: "12px 16px", color: "var(--muted)" }}>{i+1}</td>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ fontWeight: 600 }}>{log.patient_name}</div>
                      <div style={{ color: "var(--muted)", fontSize: "0.73rem" }}>{log.patient_email}</div>
                    </td>
                    <td style={{ padding: "12px 16px" }}>📍 {log.pickup_location}</td>
                    <td style={{ padding: "12px 16px" }}>{log.driver_name}</td>
                    <td style={{ padding: "12px 16px" }}>{log.vehicle_number}</td>
                    <td style={{ padding: "12px 16px" }}>{log.ambulance_phone}</td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: "0.72rem", fontWeight: 600, background: "rgba(0,196,140,0.15)", color: "#00c48c", textTransform: "uppercase" }}>{log.status}</span>
                    </td>
                    <td style={{ padding: "12px 16px", color: "var(--muted)", whiteSpace: "nowrap" }}>{new Date(log.requested_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
