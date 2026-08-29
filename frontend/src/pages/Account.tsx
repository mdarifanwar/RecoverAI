import { useNavigate } from "react-router-dom";

export default function Account() {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  return (
    <main className="app-container">
      {/* Header Banner */}
      <div className="header-overview">
        <div className="overview-title">
          <h1>Account & System Profile</h1>
          <p className="overview-subtitle">
            Operator details, platform configuration, and active system integrations.
          </p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "20px" }}>
        {/* Operator Info Card */}
        <div className="pulm-card">
          <div className="card-header-bar">
            <span className="card-title-text">OPERATOR PROFILE</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginTop: "10px" }}>
            <div>
              <span className="detail-label">OPERATOR NAME</span>
              <div style={{ fontSize: "16px", fontWeight: "bold", fontFamily: "var(--font-mono)", marginTop: "2px" }}>
                Admin Operator
              </div>
            </div>

            <div>
              <span className="detail-label">EMAIL ADDRESS</span>
              <div style={{ fontSize: "14px", fontFamily: "var(--font-mono)", marginTop: "2px" }}>
                admin@revenuerecovery.com
              </div>
            </div>

            <div>
              <span className="detail-label">ROLE</span>
              <div style={{ marginTop: "4px" }}>
                <span className="badge-tag recovered">FINANCE ADMINISTRATOR</span>
              </div>
            </div>
          </div>
        </div>

        {/* System Integrations Card */}
        <div className="pulm-card">
          <div className="card-header-bar">
            <span className="card-title-text">ACTIVE INTEGRATIONS</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginTop: "10px" }}>
            <div>
              <span className="detail-label">PAYMENT GATEWAY</span>
              <div style={{ fontSize: "14px", fontWeight: "bold", fontFamily: "var(--font-mono)", marginTop: "2px" }}>
                Razorpay Test API (Webhooks Active)
              </div>
            </div>

            <div>
              <span className="detail-label">AI MICROSERVICE</span>
              <div style={{ fontSize: "14px", fontWeight: "bold", fontFamily: "var(--font-mono)", marginTop: "2px" }}>
                Python FastAPI (OpenAI LLM Engine)
              </div>
            </div>

            <div>
              <span className="detail-label">DATABASE & AUDIT TRAIL</span>
              <div style={{ fontSize: "14px", fontWeight: "bold", fontFamily: "var(--font-mono)", marginTop: "2px" }}>
                PostgreSQL (Immutable Log Enabled)
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Logout Action Card */}
      <div className="pulm-card" style={{ marginTop: "20px" }}>
        <div className="card-header-bar">
          <span className="card-title-text">SESSION MANAGEMENT</span>
        </div>
        <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "16px" }}>
          Log out of your operator session on this device.
        </p>
        <div>
          <button className="pulm-btn" onClick={handleLogout} style={{ backgroundColor: "#a82a24" }}>
            LOGOUT OF SESSION
          </button>
        </div>
      </div>
    </main>
  );
}
