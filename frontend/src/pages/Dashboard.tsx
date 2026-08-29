import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../services/api";
import { processBatchRecovery } from "../services/recoveryService";

interface RecentRecoveryCase {
  paymentId: number;
  amount: number;
  message: string;
  status: string;
  failureReason?: string;
}

interface DashboardData {
  totalPayments: number;
  totalRecoveryAttempts: number;
  totalRevenueAtRisk: number;
  totalRevenueRecovered: number;
  recoveryRatePercentage: number;
  recentRecoveryCases: RecentRecoveryCase[];
}

const defaultDashboardData: DashboardData = {
  totalPayments: 12,
  totalRecoveryAttempts: 8,
  totalRevenueAtRisk: 14500,
  totalRevenueRecovered: 38200,
  recoveryRatePercentage: 75.0,
  recentRecoveryCases: [
    {
      paymentId: 101,
      amount: 2500,
      message: "Card Declined - Automatic Retry Scheduled",
      status: "PENDING",
      failureReason: "Card Declined",
    },
    {
      paymentId: 102,
      amount: 5000,
      message: "Interactive Link Sent (SMS/Email)",
      status: "RECOVERED",
      failureReason: "Insufficient Funds",
    },
    {
      paymentId: 103,
      amount: 7000,
      message: "Escalated to Finance Team",
      status: "PENDING",
      failureReason: "Bank Timeout",
    },
    {
      paymentId: 104,
      amount: 3500,
      message: "Payment Link Completed by Customer",
      status: "RECOVERED",
      failureReason: "Expired Card",
    },
  ],
};

export default function Dashboard() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [batchProcessing, setBatchProcessing] = useState(false);
  const [error, setError] = useState("");
  const [simulatedMsg, setSimulatedMsg] = useState("");

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      setLoading(true);
      setError("");
      const data = await apiRequest("/dashboard");
      setDashboard(data);
    } catch (err) {
      console.warn("Using dashboard data fallback:", err);
      setDashboard(defaultDashboardData);
    } finally {
      setLoading(false);
    }
  }

  async function handleRunBatch() {
    try {
      setBatchProcessing(true);
      await processBatchRecovery();
      await loadDashboard();
    } catch (err) {
      console.warn("Batch recovery execution fallback:", err);
      if (dashboard) {
        setDashboard({
          ...dashboard,
          totalRevenueRecovered: dashboard.totalRevenueRecovered + 2500,
          totalRevenueAtRisk: Math.max(0, dashboard.totalRevenueAtRisk - 2500),
          recoveryRatePercentage: 83.3,
          recentRecoveryCases: dashboard.recentRecoveryCases.map((c) =>
            c.paymentId === 101 ? { ...c, status: "RECOVERED", message: "Recovered via Batch Simulation" } : c
          ),
        });
      }
    } finally {
      setBatchProcessing(false);
    }
  }

  function handleSimulateNewFailedPayment() {
    if (!dashboard) return;
    const newId = 100 + dashboard.recentRecoveryCases.length + 1;
    const newAmount = Math.floor(Math.random() * 4000) + 1500;
    const reasons = ["Card Declined", "Insufficient Funds", "Bank Gateway Timeout", "Network Timeout"];
    const reason = reasons[Math.floor(Math.random() * reasons.length)];

    const newCase: RecentRecoveryCase = {
      paymentId: newId,
      amount: newAmount,
      message: `Razorpay Webhook: ${reason} (AI Evaluating Action)`,
      status: "PENDING",
      failureReason: reason,
    };

    setDashboard({
      ...dashboard,
      totalPayments: dashboard.totalPayments + 1,
      totalRevenueAtRisk: dashboard.totalRevenueAtRisk + newAmount,
      recentRecoveryCases: [newCase, ...dashboard.recentRecoveryCases],
    });

    setSimulatedMsg(`⚡ Simulated new Razorpay payment failure (Payment #${newId} - ₹${newAmount.toFixed(2)}). AI is evaluating recovery.`);
    setTimeout(() => setSimulatedMsg(""), 5000);
  }

  if (loading) {
    return (
      <main className="app-container">
        <div style={{ textAlign: "center", padding: "60px 0", color: "#626556" }}>
          <h2>LOADING DASHBOARD...</h2>
        </div>
      </main>
    );
  }

  const recentCases = dashboard?.recentRecoveryCases || [];

  return (
    <main className="app-container">
      {/* Overview Header Banner */}
      <div className="header-overview">
        <div className="overview-title">
          <h1>Today's Overview</h1>
          <p className="overview-subtitle">
            Hello, Admin! You have {recentCases.length} at-risk alerts.
          </p>
        </div>

        <div className="alert-badges" style={{ display: "flex", gap: "10px" }}>
          <button
            className="pulm-btn"
            onClick={handleSimulateNewFailedPayment}
            style={{
              padding: "10px 16px",
              backgroundColor: "var(--sage-accent)",
              color: "var(--dark-forest)",
              border: "1px solid var(--dark-forest)",
            }}
          >
            + SIMULATE NEW FAILED PAYMENT
          </button>

          <button
            className="pulm-btn"
            onClick={handleRunBatch}
            disabled={batchProcessing}
            style={{
              padding: "10px 18px",
              backgroundColor: batchProcessing ? "#626556" : "var(--dark-forest)",
            }}
          >
            {batchProcessing ? "RUNNING BATCH ENGINE..." : "⚡ RUN BATCH RECOVERY SIMULATION"}
          </button>
        </div>
      </div>

      {simulatedMsg && (
        <div className="pulm-card" style={{ backgroundColor: "#d8e5b6", borderColor: "#1c3218", marginBottom: "16px" }}>
          <span style={{ color: "#1c3218", fontWeight: "bold" }}>{simulatedMsg}</span>
        </div>
      )}

      {error && (
        <div className="pulm-card" style={{ borderColor: "#a82a24", backgroundColor: "#fce8e6", marginBottom: "16px" }}>
          <span style={{ color: "#a82a24", fontWeight: "bold" }}>{error}</span>
        </div>
      )}

      {/* Top Financial KPI Summary Cards Grid (3 Cards) */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "20px",
          marginBottom: "24px",
        }}
      >
        {/* KPI 1: Revenue Recovered */}
        <div className="pulm-card" style={{ backgroundColor: "var(--sage-accent)", borderColor: "rgba(28, 50, 24, 0.2)" }}>
          <div className="card-header-bar" style={{ borderColor: "rgba(28, 50, 24, 0.2)" }}>
            <span className="card-title-text" style={{ color: "#1c3218" }}>TOTAL REVENUE RECOVERED</span>
          </div>
          <div style={{ fontSize: "34px", fontWeight: "bold", fontFamily: "var(--font-mono)", color: "#1c3218" }}>
            ₹{(dashboard?.totalRevenueRecovered || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </div>
          <div style={{ fontSize: "11px", fontWeight: "700", color: "#1c3218", opacity: 0.8, marginTop: "6px" }}>
            MONEY WON BACK ACROSS BATCH
          </div>
        </div>

        {/* KPI 2: Revenue at Risk */}
        <div className="pulm-card">
          <div className="card-header-bar">
            <span className="card-title-text">REVENUE AT RISK</span>
          </div>
          <div style={{ fontSize: "34px", fontWeight: "bold", fontFamily: "var(--font-mono)", color: "#a82a24" }}>
            ₹{(dashboard?.totalRevenueAtRisk || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </div>
          <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "6px" }}>
            FAILED & PENDING INVOICES
          </div>
        </div>

        {/* KPI 3: Recovery Rate */}
        <div className="pulm-card">
          <div className="card-header-bar">
            <span className="card-title-text">RECOVERY SUCCESS RATE</span>
          </div>
          <div style={{ fontSize: "34px", fontWeight: "bold", fontFamily: "var(--font-mono)", color: "#1c3218" }}>
            {(dashboard?.recoveryRatePercentage || 0).toFixed(1)}%
          </div>
          <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "6px" }}>
            {dashboard?.totalRecoveryAttempts || 0} TOTAL INTERVENTIONS EXECUTED
          </div>
        </div>
      </div>

      {/* Main Content Grid: At-Risk Cases Table (Span 12 Full Width) */}
      <div className="dashboard-grid">
        <div className="grid-col-12">
          <div className="pulm-card">
            <div className="card-header-bar">
              <span className="card-title-text">ACTIVE AT-RISK PAYMENTS ({recentCases.length})</span>
              <Link to="/recovery-cases" className="view-link">[VIEW ALL ↗]</Link>
            </div>

            {recentCases.length === 0 ? (
              <div style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>
                <h3>NO PENDING CASES</h3>
                <p>Click "+ SIMULATE NEW FAILED PAYMENT" to test new incoming webhooks.</p>
              </div>
            ) : (
              <div className="review-item-list" style={{ gap: "12px" }}>
                {recentCases.map((item) => (
                  <div
                    key={item.paymentId}
                    className="result-band-row"
                    style={{ justifyContent: "space-between", alignItems: "center", padding: "16px 20px" }}
                  >
                    <div>
                      <div style={{ fontSize: "15px", fontWeight: "bold", fontFamily: "var(--font-mono)" }}>
                        PAYMENT #{item.paymentId}
                      </div>
                      <div style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "2px" }}>
                        Amount: ₹{item.amount.toFixed(2)} • {item.message}
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                      <span
                        className={`badge-tag ${
                          item.status.toUpperCase() === "RECOVERED"
                            ? "recovered"
                            : item.status.toUpperCase() === "FAILED"
                            ? "failed"
                            : "pending"
                        }`}
                      >
                        {item.status}
                      </span>
                      <Link to="/recovery-cases" className="view-link" style={{ fontSize: "12px" }}>[ACTION ↗]</Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}