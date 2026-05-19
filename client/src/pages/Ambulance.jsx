import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import api from "../api";

export default function Ambulance() {
  const [ambulances, setAmbulances] = useState([]);
  const [pickup, setPickup] = useState("");
  const [loading, setLoading] = useState(false);
  const [dispatched, setDispatched] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/ambulance").then(r => setAmbulances(r.data)).catch(() => {});
  }, []);

  const handleRequest = async () => {
    if (!pickup.trim()) return setError("Please enter your pickup location");
    setLoading(true); setError("");
    try {
      const res = await api.post("/ambulance/request", { pickup_location: pickup });
      setDispatched(res.data);
      setAmbulances(prev => prev.filter(a => a.id !== res.data.ambulance?.id));
    } catch (err) {
      setError(err.response?.data?.error || "Request failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <Navbar />
      <main className="main">
        <h1 className="page-title">🚑 Ambulance Assistance</h1>
        <p className="page-desc">Request emergency ambulance service to your location.</p>

        <div className="card request-form" style={{ marginBottom: 32 }}>
          <h3 style={{ marginBottom: 16, fontFamily: "Syne, sans-serif" }}>Request an Ambulance</h3>
          {error && <div className="error-msg">{error}</div>}
          <input
            type="text"
            placeholder="Enter your pickup address or location..."
            value={pickup}
            onChange={e => setPickup(e.target.value)}
          />
          <button className="dispatch-btn" onClick={handleRequest} disabled={loading}>
            {loading ? "Dispatching..." : "🚨 Request Now"}
          </button>

          {dispatched && (
            <div className="success-box">
              <h3>✅ Ambulance Dispatched!</h3>
              <p><strong>Driver:</strong> {dispatched.ambulance?.driver}</p>
              <p><strong>Vehicle:</strong> {dispatched.ambulance?.vehicle}</p>
              <p><strong>Contact:</strong> {dispatched.ambulance?.phone}</p>
              <p><strong>From:</strong> {dispatched.ambulance?.currentLocation}</p>
            </div>
          )}
        </div>

        <h2 style={{ fontFamily: "Syne, sans-serif", marginBottom: 16, fontSize: "1.1rem" }}>
          Available Ambulances ({ambulances.length})
        </h2>
        {ambulances.length === 0 ? (
          <div className="loading">No ambulances currently available</div>
        ) : (
          ambulances.map(amb => (
            <div className="ambulance-card" key={amb.id}>
              <div className="ambulance-icon">🚑</div>
              <div className="ambulance-info">
                <h3>{amb.driver_name}</h3>
                <p>{amb.vehicle_number} · {amb.location}</p>
                <p>📞 {amb.phone}</p>
              </div>
              <span style={{ color: "var(--primary)", fontSize: "0.8rem", fontWeight: 600 }}>AVAILABLE</span>
            </div>
          ))
        )}
      </main>
    </div>
  );
}
