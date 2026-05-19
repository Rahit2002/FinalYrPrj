import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate("/login"); };

  const patientLinks = [
    { to: "/", label: "Home", end: true },
    { to: "/diagnosis", label: "Diagnosis" },
    { to: "/doctors", label: "Doctors" },
    { to: "/appointments", label: "Appointments" },
    { to: "/ambulance", label: "Ambulance" },
  ];

  const adminLinks = [
    { to: "/admin", label: "Dashboard", end: true },
  ];

  const links = user?.role === "admin" ? adminLinks : patientLinks;

  return (
    <nav className="navbar">
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div className="nav-logo">seva</div>
        {user?.role === "admin" && (
          <span style={{ background: "rgba(255,71,87,0.15)", color: "#ff4757", padding: "2px 10px", borderRadius: 20, fontSize: "0.72rem", fontWeight: 700 }}>
            ADMIN
          </span>
        )}
        {user?.role === "doctor" && (
          <span style={{ background: "rgba(0,196,140,0.15)", color: "var(--primary)", padding: "2px 10px", borderRadius: 20, fontSize: "0.72rem", fontWeight: 700 }}>
            DOCTOR
          </span>
        )}
      </div>
      <div className="nav-links">
        {links.map(l => (
          <NavLink key={l.to} to={l.to} end={l.end}
            className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}>
            {l.label}
          </NavLink>
        ))}
        <span style={{ color: "var(--muted)", fontSize: "0.82rem", padding: "0 8px" }}>{user?.name}</span>
        <button className="nav-logout" onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}
