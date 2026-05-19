import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="page">
      <Navbar />
      <main className="main">
        <div className="welcome-banner">
          <h2>Welcome back, {user?.name?.split(" ")[0]} 👋</h2>
          <p>Your personal health companion — what would you like to do today?</p>
        </div>
        <div className="dashboard-grid">
          <Link to="/diagnosis" className="dash-card">
            <div className="dash-icon">🧠</div>
            <h3>AI Symptom Check</h3>
            <p>Describe your symptoms and get an instant AI-powered health assessment.</p>
          </Link>
          <Link to="/doctors" className="dash-card">
            <div className="dash-icon">👨‍⚕️</div>
            <h3>Find a Doctor</h3>
            <p>Browse specialists by category and find the right doctor for your needs.</p>
          </Link>
          <Link to="/appointments" className="dash-card">
            <div className="dash-icon">📅</div>
            <h3>Book Appointment</h3>
            <p>Schedule a consultation with a specialist doctor at your preferred time.</p>
          </Link>
          <Link to="/ambulance" className="dash-card">
            <div className="dash-icon">🚑</div>
            <h3>Ambulance</h3>
            <p>Request emergency ambulance assistance to your location instantly.</p>
          </Link>
          <Link to="/admin" className="dash-card">
            <div className="dash-icon">🛡️</div>
            <h3>Admin Panel</h3>
            <p>Monitor all ambulance dispatches and appointment bookings system-wide.</p>
          </Link>
        </div>
      </main>
    </div>
  );
}
