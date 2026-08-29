import { FormEvent, useState } from "react";
import { LockIcon, EyeIcon, EyeOffIcon } from "./Navbar";

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChangePasswordModal({ isOpen, onClose }: ChangePasswordModalProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    const storedProfileStr = localStorage.getItem("user_profile");
    let storedUser = null;
    if (storedProfileStr) {
      try {
        storedUser = JSON.parse(storedProfileStr);
      } catch (err) {
        console.error(err);
      }
    }

    const activePassword = localStorage.getItem("user_password") || (storedUser ? storedUser.password : "admin123");

    if (currentPassword !== activePassword) {
      setError("Incorrect current password. Please enter your valid current password.");
      return;
    }

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setError("New passwords do not match. Please re-enter.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      localStorage.setItem("user_password", newPassword);

      if (storedUser) {
        storedUser.password = newPassword;
        localStorage.setItem("user_profile", JSON.stringify(storedUser));
      }

      setSuccess("Password updated successfully!");
      setTimeout(() => {
        setSuccess("");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
        onClose();
      }, 1200);
    }, 600);
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(28, 50, 24, 0.45)",
        backdropFilter: "blur(4px)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <div
        className="pulm-card"
        style={{
          width: "100%",
          maxWidth: "420px",
          backgroundColor: "#f7f6f0",
          borderRadius: "16px",
          border: "1px solid var(--border-color)",
          boxShadow: "0 16px 48px rgba(0, 0, 0, 0.2)",
          padding: "28px 24px",
          position: "relative",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            right: "16px",
            top: "16px",
            background: "none",
            border: "none",
            fontSize: "18px",
            cursor: "pointer",
            color: "var(--dark-forest)",
          }}
        >
          ✕
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
          <LockIcon size={20} color="var(--dark-forest)" />
          <h2 style={{ fontSize: "16px", fontWeight: "800", color: "var(--dark-forest)", margin: 0 }}>
            CHANGE PASSWORD
          </h2>
        </div>
        <p style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "20px" }}>
          Update your operator credentials for the platform.
        </p>

        {error && (
          <div
            style={{
              padding: "8px 12px",
              backgroundColor: "#fce8e6",
              border: "1px solid #a82a24",
              borderRadius: "6px",
              color: "#a82a24",
              fontSize: "12px",
              marginBottom: "14px",
              fontWeight: "bold",
            }}
          >
            {error}
          </div>
        )}

        {success && (
          <div
            style={{
              padding: "8px 12px",
              backgroundColor: "#d8e5b6",
              border: "1px solid #1c3218",
              borderRadius: "6px",
              color: "#1c3218",
              fontSize: "12px",
              marginBottom: "14px",
              fontWeight: "bold",
            }}
          >
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <label
              style={{
                fontSize: "10px",
                fontWeight: 800,
                letterSpacing: "1px",
                textTransform: "uppercase",
                color: "var(--dark-forest)",
              }}
            >
              CURRENT PASSWORD
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showPass ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Current Password"
                required
                style={{
                  width: "100%",
                  padding: "10px 36px 10px 12px",
                  borderRadius: "6px",
                  border: "1px solid var(--border-color)",
                  fontSize: "13px",
                  backgroundColor: "var(--bg-cream)",
                  boxSizing: "border-box",
                  outline: "none",
                }}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                {showPass ? (
                  <EyeOffIcon size={14} color="var(--text-muted)" />
                ) : (
                  <EyeIcon size={14} color="var(--text-muted)" />
                )}
              </button>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <label
              style={{
                fontSize: "10px",
                fontWeight: 800,
                letterSpacing: "1px",
                textTransform: "uppercase",
                color: "var(--dark-forest)",
              }}
            >
              NEW PASSWORD
            </label>
            <input
              type={showPass ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New Password (min 6 chars)"
              required
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: "6px",
                border: "1px solid var(--border-color)",
                fontSize: "13px",
                backgroundColor: "var(--bg-cream)",
                boxSizing: "border-box",
                outline: "none",
              }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <label
              style={{
                fontSize: "10px",
                fontWeight: 800,
                letterSpacing: "1px",
                textTransform: "uppercase",
                color: "var(--dark-forest)",
              }}
            >
              CONFIRM NEW PASSWORD
            </label>
            <input
              type={showPass ? "text" : "password"}
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              placeholder="Confirm New Password"
              required
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: "6px",
                border: "1px solid var(--border-color)",
                fontSize: "13px",
                backgroundColor: "var(--bg-cream)",
                boxSizing: "border-box",
                outline: "none",
              }}
            />
          </div>

          <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
            <button
              type="button"
              onClick={onClose}
              className="pulm-btn"
              style={{ flex: 1, backgroundColor: "#e2e5d5", color: "var(--dark-forest)" }}
            >
              CANCEL
            </button>
            <button type="submit" className="pulm-btn" disabled={loading} style={{ flex: 1 }}>
              {loading ? "SAVING..." : "UPDATE PASSWORD"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
