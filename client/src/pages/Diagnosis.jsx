// import { useState } from "react";
// import Navbar from "../components/Navbar";
// import api from "../api";

// export default function Diagnosis() {
//   const [symptoms, setSymptoms] = useState("");
//   const [result, setResult] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [scanResult, setScanResult] = useState(null);
//   const [scanning, setScanning] = useState(false);
//   const [scanError, setScanError] = useState("");

//   const handleSubmit = async () => {
//     if (!symptoms.trim() || symptoms.trim().length < 5)
//       return setError("Please describe your symptoms in more detail");
//     setLoading(true); setError(""); setResult(null);
//     try {
//       const res = await api.post("/diagnosis", { symptoms });
//       setResult(res.data);
//     } catch (err) {
//       setError(err.response?.data?.error || "Diagnosis failed. Try again.");
//     } finally { setLoading(false); }
//   };

//   // const handleHealthScan = async () => {
//   //   setScanning(true); setScanError(""); setScanResult(null);
//   //   try {
//   //     const res = await api.get("/diagnosis/health-scan");
//   //     setScanResult(res.data);
//   //   } catch (err) {
//   //     setScanError(err.response?.data?.error || "Health scan unavailable. Make sure the Python model is running on port 5001.");
//   //   } finally { setScanning(false); }
//   // };
//   const handleHealthScan = async () => {

//     setScanning(true);
//     setScanError("");
//     setScanResult(null);

//     try {

//       const res = await fetch(
//         "http://localhost:5001/health-scan"
//       );

//       const data = await res.json();

//       setScanResult(data);

//     } catch (err) {

//       setScanError(
//         "Health scan unavailable. Make sure Flask API is running on port 5001."
//       );

//     } finally {

//       setScanning(false);
//     }
//   };
//   const scoreColor = (s) => s >= 80 ? "#00c48c" : s >= 60 ? "#ffc107" : "#ff4757";
//   const stressColor = (s) => s === "LOW" ? "#00c48c" : s === "MEDIUM" ? "#ffc107" : "#ff4757";
//   const severityClass = (s) => {
//     if (!s) return "";
//     if (s.includes("mild")) return "severity-mild";
//     if (s.includes("moderate")) return "severity-moderate";
//     return "severity-severe";
//   };

//   return (
//     <div className="page">
//       <Navbar />
//       <main className="main">
//         <h1 className="page-title">AI Health Center</h1>
//         <p className="page-desc">Camera-based vitals scan + AI symptom analysis.</p>

//         {/* ── HEALTH SCAN ──  */}
//         <div className="card" style={{ marginBottom: 28, borderColor: scanning ? "var(--primary)" : "var(--border)" }}>
//           <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
//             <div>
//               <h3 style={{ fontFamily: "Syne,sans-serif", marginBottom: 6 }}>💓 Camera Vitals Scan</h3>
//               <p style={{ color: "var(--muted)", fontSize: "0.85rem" }}>
//                 Uses your camera to measure BPM, HRV, stress, breathing rate and compute a wellness score.
//                 <br/>Keep your face visible and well-lit. Scan takes ~15 seconds.
//               </p>
//             </div>
//             <button onClick={handleHealthScan} disabled={scanning}
//               style={{ padding: "12px 28px", background: scanning ? "var(--surface2)" : "rgba(0,196,140,0.15)", border: "1px solid rgba(0,196,140,0.4)", color: "var(--primary)", borderRadius: 10, fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: "0.9rem", cursor: scanning ? "not-allowed" : "pointer", whiteSpace: "nowrap", transition: "all 0.2s" }}>
//               {scanning ? "📷 Scanning..." : "📷 Start Scan"}
//             </button>
//           </div>

//           {scanning && (
//             <div style={{ marginTop: 20, padding: 24, background: "var(--surface2)", borderRadius: 12, textAlign: "center" }}>
//               <div className="spinner" style={{ margin: "0 auto 12px", width: 32, height: 32, borderWidth: 3 }} />
//               <p style={{ color: "var(--primary)", fontWeight: 600, marginBottom: 6 }}>Camera scanning in progress...</p>
//               <p style={{ color: "var(--muted)", fontSize: "0.85rem" }}>Keep your face centered and still for 15 seconds</p>
//             </div>
//           )}

//           {scanError && <div className="error-msg" style={{ marginTop: 16 }}>{scanError}</div>}

//           {scanResult && scanResult.success && (
//             <div style={{ marginTop: 20, animation: "fadeUp 0.4s ease" }}>
//               {/* Main metrics grid */}
//               <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: 12, marginBottom: 20 }}>
//                 {[
//                   { label: "Heart Rate", value: `${scanResult.heartbeat_bpm} BPM`, sub: scanResult.bpm_status, color: scanResult.bpm_status === "Normal" ? "#00c48c" : "#ffc107" },
//                   { label: "Wellness Score", value: `${scanResult.health_score}/100`, sub: scanResult.health_status, color: scoreColor(scanResult.health_score) },
//                   { label: "HRV", value: `${scanResult.hrv_ms} ms`, sub: "Heart Rate Variability", color: "var(--primary)" },
//                   { label: "Est. Blood Pressure", value: scanResult.estimated_bp, sub: "mmHg (estimated)", color: "#7c83fd" },
//                   { label: "Stress Level", value: scanResult.stress_level, sub: "Based on BPM & HRV", color: stressColor(scanResult.stress_level) },
//                   { label: "Breathing", value: `${scanResult.breathing_rate}/min`, sub: scanResult.fatigue_status, color: "#00c48c" },
//                 ].map(m => (
//                   <div key={m.label} style={{ background: "var(--surface2)", borderRadius: 12, padding: 16, textAlign: "center" }}>
//                     <div style={{ fontSize: "1.4rem", fontWeight: 800, fontFamily: "Syne,sans-serif", color: m.color }}>{m.value}</div>
//                     <div style={{ color: "var(--text)", fontSize: "0.75rem", fontWeight: 600, marginTop: 4 }}>{m.label}</div>
//                     <div style={{ color: "var(--muted)", fontSize: "0.72rem", marginTop: 2 }}>{m.sub}</div>
//                   </div>
//                 ))}
//               </div>

//               {/* Wellness bar */}
//               <div style={{ marginBottom: 16 }}>
//                 <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: "0.8rem" }}>
//                   <span style={{ color: "var(--muted)" }}>Wellness Score</span>
//                   <span style={{ color: scoreColor(scanResult.health_score), fontWeight: 700 }}>{scanResult.health_score}/100</span>
//                 </div>
//                 <div style={{ background: "var(--surface2)", borderRadius: 99, height: 10, overflow: "hidden" }}>
//                   <div style={{ width: `${scanResult.health_score}%`, height: "100%", background: scoreColor(scanResult.health_score), borderRadius: 99, transition: "width 1s ease" }} />
//                 </div>
//               </div>

//               {/* Signal quality */}
//               <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", color: "var(--muted)", marginBottom: 12 }}>
//                 <span>Signal Quality: <strong style={{ color: "var(--text)" }}>{scanResult.signal_quality}%</strong></span>
//                 <span>Fatigue: <strong style={{ color: scanResult.fatigue_status === "ACTIVE" ? "#00c48c" : "#ffc107" }}>{scanResult.fatigue_status}</strong></span>
//               </div>

//               <p style={{ fontSize: "0.78rem", color: "var(--muted)", fontStyle: "italic" }}>
//                 ⚠️ Camera-based measurements are estimates for informational purposes only. Always consult a qualified doctor.
//               </p>
//             </div>
//           )}
//         </div>

//         {/* ── SYMPTOM CHECKER ── */}
//         <div className="card diagnosis-form">
//           <h3 style={{ fontFamily: "Syne,sans-serif", marginBottom: 16 }}>🧠 AI Symptom Checker</h3>
//           <textarea
//             placeholder="e.g. I have a severe headache, fever of 102°F, and body aches since yesterday..."
//             value={symptoms}
//             onChange={e => setSymptoms(e.target.value)}
//           />
//           {error && <div className="error-msg">{error}</div>}
//           <button className="diagnosis-btn" onClick={handleSubmit} disabled={loading}>
//             {loading ? "Analyzing..." : "Analyze Symptoms →"}
//           </button>
//         </div>

//         {loading && <div className="loading"><div className="spinner" />AI is analyzing your symptoms...</div>}

//         {result && (
//           <div className="result-box">
//             {result.seekEmergencyCare && <div className="emergency-alert">⚠️ Seek emergency care immediately!</div>}
//             <h3>Possible Conditions</h3>
//             <div className="conditions-list">
//               {result.possibleConditions?.map((c, i) => <span key={i} className="condition-tag">{c}</span>)}
//             </div>
//             <div className={`severity-badge ${severityClass(result.severity)}`}>Severity: {result.severity}</div>
//             <p style={{ marginBottom: 12, fontSize: "0.9rem" }}><strong>Recommended Specialist:</strong> {result.recommendedSpeciality}</p>
//             <h3>Immediate Steps</h3>
//             <ul className="steps-list">
//               {result.immediateSteps?.map((step, i) => <li key={i}>{step}</li>)}
//             </ul>
//             <p className="disclaimer">⚠️ {result.disclaimer}</p>
//           </div>
//         )}
//       </main>
//     </div>
//   );
// }


import { useState } from "react";
import Navbar from "../components/Navbar";
import api from "../api";

export default function Diagnosis() {

  const [symptoms, setSymptoms] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [scanResult, setScanResult] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [scanError, setScanError] = useState("");

  // -----------------------------------
  // SYMPTOM CHECKER
  // -----------------------------------

  const handleSubmit = async () => {

    if (!symptoms.trim() || symptoms.trim().length < 5) {

      return setError(
        "Please describe your symptoms in more detail"
      );
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {

      const res = await api.post(
        "/diagnosis",
        { symptoms }
      );

      setResult(res.data);

    } catch (err) {

      setError(
        err.response?.data?.error ||
        "Diagnosis failed. Try again."
      );

    } finally {

      setLoading(false);
    }
  };

  // -----------------------------------
  // HEALTH SCAN
  // -----------------------------------

  const handleHealthScan = async () => {

    setScanning(true);
    setScanError("");
    setScanResult(null);

    try {

      console.log("Calling Flask API...");

      const res = await fetch(
        "http://127.0.0.1:5001/health-scan"
      );

      console.log("Response status:", res.status);

      const data = await res.json();

      console.log("FULL SCAN RESULT:");
      console.log(data);

      setScanResult(data);

    } catch (err) {

      console.error(err);

      setScanError(
        "Health scan unavailable. Flask API may not be running."
      );

    } finally {

      setScanning(false);
    }
  };

  // -----------------------------------
  // HELPERS
  // -----------------------------------

  const scoreColor = (s) => {

    if (!s) return "#999";

    return s >= 80
      ? "#00c48c"
      : s >= 60
      ? "#ffc107"
      : "#ff4757";
  };

  const stressColor = (s) => {

    if (!s) return "#999";

    return s === "LOW"
      ? "#00c48c"
      : s === "MEDIUM"
      ? "#ffc107"
      : "#ff4757";
  };

  const severityClass = (s) => {

    if (!s) return "";

    if (s.includes("mild"))
      return "severity-mild";

    if (s.includes("moderate"))
      return "severity-moderate";

    return "severity-severe";
  };

  return (

    <div className="page">

      <Navbar />

      <main className="main">

        <h1 className="page-title">
          AI Health Center
        </h1>

        <p className="page-desc">
          Camera-based vitals scan + AI symptom analysis.
        </p>

        {/* ===================================== */}
        {/* HEALTH SCAN */}
        {/* ===================================== */}

        <div
          className="card"
          style={{
            marginBottom: 28
          }}
        >

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 16
            }}
          >

            <div>

              <h3
                style={{
                  fontFamily: "Syne,sans-serif"
                }}
              >
                💓 Camera Vitals Scan
              </h3>

              <p
                style={{
                  color: "gray",
                  fontSize: "0.85rem"
                }}
              >
                Uses camera to estimate BPM,
                HRV, stress, breathing and wellness.
              </p>

            </div>

            <button
              onClick={handleHealthScan}
              disabled={scanning}
              style={{
                padding: "12px 24px",
                borderRadius: 10,
                border: "none",
                background: "#00c48c",
                color: "white",
                fontWeight: 700,
                cursor: "pointer"
              }}
            >
              {
                scanning
                  ? "📷 Scanning..."
                  : "📷 Start Scan"
              }
            </button>

          </div>

          {/* LOADING */}

          {scanning && (

            <div
              style={{
                marginTop: 20,
                padding: 20,
                background: "#111",
                borderRadius: 12
              }}
            >

              <p
                style={{
                  color: "#00c48c"
                }}
              >
                Camera scanning in progress...
              </p>

              <p
                style={{
                  color: "#aaa",
                  fontSize: "0.85rem"
                }}
              >
                Keep face steady for 15 seconds.
              </p>

            </div>
          )}

          {/* ERROR */}

          {scanError && (

            <div
              style={{
                marginTop: 16,
                color: "red"
              }}
            >
              {scanError}
            </div>
          )}

          {/* DEBUG OUTPUT */}

          {scanResult && (

            <div
              style={{
                marginTop: 20
              }}
            >

              {/* RAW JSON DEBUG */}

              <pre
                style={{
                  background: "#111",
                  color: "#0f0",
                  padding: 16,
                  borderRadius: 10,
                  overflow: "auto",
                  fontSize: "0.8rem"
                }}
              >
                {JSON.stringify(scanResult, null, 2)}
              </pre>

              {/* HEALTH CARDS */}

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit,minmax(140px,1fr))",
                  gap: 12,
                  marginTop: 20
                }}
              >

                <div
                  style={{
                    background: "#161616",
                    padding: 16,
                    borderRadius: 12,
                    textAlign: "center"
                  }}
                >
                  <div
                    style={{
                      color: "#00c48c",
                      fontSize: "1.4rem",
                      fontWeight: 800
                    }}
                  >
                    {
                      scanResult.heartbeat_bpm ||
                      scanResult.bpm ||
                      "--"
                    }
                  </div>

                  <div>
                    Heart Rate
                  </div>
                </div>

                <div
                  style={{
                    background: "#161616",
                    padding: 16,
                    borderRadius: 12,
                    textAlign: "center"
                  }}
                >
                  <div
                    style={{
                      color: "#7c83fd",
                      fontSize: "1.4rem",
                      fontWeight: 800
                    }}
                  >
                    {
                      scanResult.estimated_bp ||
                      scanResult.bp ||
                      "--"
                    }
                  </div>

                  <div>
                    Estimated BP
                  </div>
                </div>

                <div
                  style={{
                    background: "#161616",
                    padding: 16,
                    borderRadius: 12,
                    textAlign: "center"
                  }}
                >
                  <div
                    style={{
                      color: scoreColor(
                        scanResult.health_score
                      ),
                      fontSize: "1.4rem",
                      fontWeight: 800
                    }}
                  >
                    {
                      scanResult.health_score ||
                      "--"
                    }
                  </div>

                  <div>
                    Wellness Score
                  </div>
                </div>

                <div
                  style={{
                    background: "#161616",
                    padding: 16,
                    borderRadius: 12,
                    textAlign: "center"
                  }}
                >
                  <div
                    style={{
                      color: stressColor(
                        scanResult.stress_level
                      ),
                      fontSize: "1.4rem",
                      fontWeight: 800
                    }}
                  >
                    {
                      scanResult.stress_level ||
                      "--"
                    }
                  </div>

                  <div>
                    Stress
                  </div>
                </div>

              </div>

            </div>
          )}

        </div>

        {/* ===================================== */}
        {/* SYMPTOM CHECKER */}
        {/* ===================================== */}

        <div className="card diagnosis-form">

          <h3
            style={{
              fontFamily: "Syne,sans-serif",
              marginBottom: 16
            }}
          >
            🧠 AI Symptom Checker
          </h3>

          <textarea
            placeholder="Describe your symptoms..."
            value={symptoms}
            onChange={(e) =>
              setSymptoms(e.target.value)
            }
          />

          {error && (
            <div className="error-msg">
              {error}
            </div>
          )}

          <button
            className="diagnosis-btn"
            onClick={handleSubmit}
            disabled={loading}
          >
            {
              loading
                ? "Analyzing..."
                : "Analyze Symptoms →"
            }
          </button>

        </div>

        {/* RESULTS */}

        {result && (

          <div className="result-box">

            {result.seekEmergencyCare && (

              <div className="emergency-alert">
                ⚠️ Seek emergency care immediately!
              </div>
            )}

            <h3>
              Possible Conditions
            </h3>

            <div className="conditions-list">

              {result.possibleConditions?.map(
                (c, i) => (

                  <span
                    key={i}
                    className="condition-tag"
                  >
                    {c}
                  </span>
                )
              )}

            </div>

            <div
              className={`severity-badge ${severityClass(result.severity)}`}
            >
              Severity: {result.severity}
            </div>

          </div>
        )}

      </main>

    </div>
  );
}