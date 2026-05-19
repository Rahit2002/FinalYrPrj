import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import api from "../api";

export default function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [specialities, setSpecialities] = useState([]);
  const [selected, setSelected] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/doctors/specialities").then(r => setSpecialities(r.data)).catch(() => {});
    fetchDoctors();
  }, []);

  const fetchDoctors = async (spec = "") => {
    setLoading(true);
    try {
      const res = await api.get("/doctors" + (spec ? `?speciality=${spec}` : ""));
      setDoctors(res.data);
    } catch { }
    finally { setLoading(false); }
  };

  const handleFilter = (e) => {
    setSelected(e.target.value);
    fetchDoctors(e.target.value);
  };

  const initials = (name) => name.split(" ").map(n => n[0]).join("").slice(0, 2);

  return (
    <div className="page">
      <Navbar />
      <main className="main">
        <h1 className="page-title">Find a Doctor</h1>
        <p className="page-desc">Browse specialists and connect with the right doctor for your needs.</p>
        <div className="search-bar">
          <select value={selected} onChange={handleFilter}>
            <option value="">All Specialities</option>
            {specialities.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        {loading ? (
          <div className="loading"><div className="spinner" />Loading doctors...</div>
        ) : (
          <div className="card-grid">
            {doctors.map(doc => (
              <div className="doctor-card" key={doc.id}>
                <div className="doctor-avatar">{initials(doc.name)}</div>
                <div className="doctor-name">{doc.name}</div>
                <div className="doctor-spec">{doc.speciality}</div>
                <div className="doctor-info">
                  <div>🏥 {doc.hospital}</div>
                  <div>📍 {doc.location}</div>
                  <div>⏱ {doc.experience_years} yrs experience</div>
                  <div>⭐ <span className="rating">{doc.rating}</span> / 5.0</div>
                  <div>📞 {doc.phone}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
