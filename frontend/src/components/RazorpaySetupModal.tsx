import { useState, FormEvent } from "react";
import { LockIcon } from "./Navbar";

interface RazorpaySetupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RazorpaySetupModal({ isOpen, onClose }: RazorpaySetupModalProps) {
  const [keyId, setKeyId] = useState(localStorage.getItem("razorpay_key_id") || "rzp_test_8Xk9Lq201A");
  const [keySecret, setKeySecret] = useState(localStorage.getItem("razorpay_key_secret") || "••••••••••••••••");
  const [webhookSecret, setWebhookSecret] = useState(localStorage.getItem("razorpay_webhook_secret") || "recover_ai_sec_123");
  const [successMsg, setSuccessMsg] = useState("");

  if (!isOpen) return null;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    localStorage.setItem("razorpay_key_id", keyId.trim());
    localStorage.setItem("razorpay_key_secret", keySecret.trim());
    localStorage.setItem("razorpay_webhook_secret", webhookSecret.trim());

    setSuccessMsg("✓ Razorpay Integration credentials saved & Webhook listener Active!");
    setTimeout(() => {
      setSuccessMsg("");
      onClose();
    }, 1500);
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(28, 50, 24, 0.4)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "20px",
      }}
    >
      <div
        className="pulm-card"
        style={{
          width: "100%",
          maxWidth: "520px",
          backgroundColor: "#f7f6f0",
          borderRadius: "16px",
          border: "1px solid var(--border-color)",
          boxShadow: "0 16px 40px rgba(28, 50, 24, 0.15)",
          padding: "28px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "16px",
            borderBottom: "1px solid var(--border-color)",
            paddingBottom: "12px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "20px" }}>⚡</span>
            <h2 style={{ fontSize: "16px", fontWeight: 800, textTransform: "uppercase", color: "var(--dark-forest)" }}>
              RAZORPAY ACCOUNT SETUP
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ background: "none", border: "none", fontSize: "20px", cursor: "pointer", color: "var(--text-muted)" }}
          >
            ✕
          </button>
        </div>

        <p style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "20px", lineHeight: 1.4 }}>
          Connect your Razorpay Merchant account to automatically ingest payment failures in real time and execute AI revenue recovery.
        </p>

        {successMsg && (
          <div className="pulm-card" style={{ backgroundColor: "#d8e5b6", borderColor: "#1c3218", marginBottom: "16px", padding: "10px 14px" }}>
            <span style={{ color: "#1c3218", fontSize: "13px", fontWeight: "bold" }}>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {/* Key ID */}
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <label style={{ fontSize: "11px", fontWeight: 800, letterSpacing: "1px", textTransform: "uppercase", color: "var(--dark-forest)" }}>
              RAZORPAY KEY ID
            </label>
            <input
              type="text"
              value={keyId}
              onChange={(e) => setKeyId(e.target.value)}
              placeholder="rzp_test_xxxxxxxxxxxx"
              required
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: "6px",
                border: "1px solid var(--border-color)",
                fontSize: "13px",
                fontFamily: "var(--font-mono)",
                backgroundColor: "var(--bg-cream)",
              }}
            />
          </div>

          {/* Key Secret */}
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <label style={{ fontSize: "11px", fontWeight: 800, letterSpacing: "1px", textTransform: "uppercase", color: "var(--dark-forest)" }}>
              RAZORPAY KEY SECRET
            </label>
            <input
              type="password"
              value={keySecret}
              onChange={(e) => setKeySecret(e.target.value)}
              placeholder="••••••••••••••••"
              required
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: "6px",
                border: "1px solid var(--border-color)",
                fontSize: "13px",
                fontFamily: "var(--font-mono)",
                backgroundColor: "var(--bg-cream)",
              }}
            />
          </div>

          {/* Webhook Listener URL */}
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <label style={{ fontSize: "11px", fontWeight: 800, letterSpacing: "1px", textTransform: "uppercase", color: "var(--dark-forest)" }}>
              WEBHOOK LISTENER ENDPOINT
            </label>
            <div
              style={{
                padding: "10px 14px",
                borderRadius: "6px",
                border: "1px dashed var(--border-color)",
                fontSize: "12px",
                fontFamily: "var(--font-mono)",
                backgroundColor: "var(--sage-light)",
                color: "var(--dark-forest)",
                fontWeight: "bold",
              }}
            >
              http://localhost:8080/api/webhooks/razorpay
            </div>
            <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
              Enter this URL under Razorpay Dashboard → Settings → Webhooks (`payment.failed` event).
            </span>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "10px" }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "10px 16px",
                borderRadius: "6px",
                border: "1px solid var(--border-color)",
                backgroundColor: "transparent",
                fontSize: "12px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              CANCEL
            </button>

            <button
              type="submit"
              className="pulm-btn"
              style={{ padding: "10px 20px", borderRadius: "6px" }}
            >
              SAVE INTEGRATION
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
