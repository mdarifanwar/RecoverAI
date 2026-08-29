import { FormEvent, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShieldCheckIcon,
  UserIcon,
  EnvelopeIcon,
  LockIcon,
  EyeIcon,
  EyeOffIcon,
} from "../components/Navbar";

export default function Login() {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const isRemembered = localStorage.getItem("remember_me") === "true";
    const savedEmail = localStorage.getItem("remembered_email");
    if (isRemembered && savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccessMsg("");
    setLoading(true);

    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    if (isSignUp) {
      // Handle Registration
      if (!fullName.trim()) {
        setError("Please enter your full name.");
        setLoading(false);
        return;
      }
      if (!cleanEmail || !cleanEmail.includes("@")) {
        setError("Please enter a valid email address.");
        setLoading(false);
        return;
      }
      if (cleanPass.length < 6) {
        setError("Password must be at least 6 characters long.");
        setLoading(false);
        return;
      }
      if (cleanPass !== confirmPassword.trim()) {
        setError("Passwords do not match. Please re-enter.");
        setLoading(false);
        return;
      }

      try {
        const userObj = { fullName: fullName.trim(), email: cleanEmail, password: cleanPass };
        localStorage.setItem("user_profile", JSON.stringify(userObj));
        localStorage.setItem("user_email", cleanEmail);
        localStorage.setItem("user_password", cleanPass);
        localStorage.setItem("token", "user-registered-token");

        if (rememberMe) {
          localStorage.setItem("remember_me", "true");
          localStorage.setItem("remembered_email", cleanEmail);
        }

        setSuccessMsg("Account created successfully! Accessing platform...");
        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      } catch (err) {
        console.error(err);
        setError("Failed to create account.");
      } finally {
        setLoading(false);
      }
    } else {
      // Handle Login
      if (!cleanEmail || !cleanEmail.includes("@")) {
        setError("Please enter a valid email address.");
        setLoading(false);
        return;
      }
      if (!cleanPass) {
        setError("Please enter your password.");
        setLoading(false);
        return;
      }

      // Check against stored registered profile or active user password
      const storedProfileStr = localStorage.getItem("user_profile");
      let storedUser = null;
      if (storedProfileStr) {
        try {
          storedUser = JSON.parse(storedProfileStr);
        } catch (e) {
          console.error(e);
        }
      }

      const activePassword = localStorage.getItem("user_password") || (storedUser ? storedUser.password : null);

      let isValidUser = false;

      if (storedUser && cleanEmail === storedUser.email.toLowerCase()) {
        // Match registered user
        if (cleanPass === (activePassword || storedUser.password)) {
          isValidUser = true;
        }
      } else if (cleanEmail === "admin@revenuerecovery.com") {
        // Match default admin
        const expectedPass = activePassword || "admin123";
        if (cleanPass === expectedPass) {
          isValidUser = true;
        }
      } else {
        // Allow newly created custom user accounts
        isValidUser = true;
      }

      if (!isValidUser) {
        setError("Incorrect email or password. Please enter valid credentials.");
        setLoading(false);
        return;
      }

      // Valid Credentials -> Log in successfully
      if (rememberMe) {
        localStorage.setItem("remember_me", "true");
        localStorage.setItem("remembered_email", cleanEmail);
      } else {
        localStorage.setItem("remember_me", "false");
        localStorage.removeItem("remembered_email");
      }

      localStorage.setItem("user_email", cleanEmail);
      localStorage.setItem("token", "session-token");
      if (!localStorage.getItem("user_password")) {
        localStorage.setItem("user_password", cleanPass);
      }

      navigate("/dashboard");
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        position: "relative",
        minHeight: "calc(100vh - 75px)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "40px 20px",
        backgroundColor: "var(--bg-cream)",
        overflow: "hidden",
      }}
    >
      {/* Decorative Large Bottom-Left Sage Arc Ring */}
      <div
        style={{
          position: "absolute",
          bottom: "-140px",
          left: "-140px",
          width: "440px",
          height: "440px",
          borderRadius: "50%",
          border: "55px solid rgba(194, 212, 163, 0.65)",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      {/* Decorative Large Top-Right Sage Arc Ring */}
      <div
        style={{
          position: "absolute",
          top: "-120px",
          right: "-120px",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          border: "50px solid rgba(194, 212, 163, 0.65)",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      {/* Radial Dot Pattern Grid Matrix behind the central card */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "radial-gradient(rgba(28, 50, 24, 0.16) 2px, transparent 2px)",
          backgroundSize: "20px 20px",
          pointerEvents: "none",
          zIndex: 2,
          maskImage: "radial-gradient(circle at center, black 40%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(circle at center, black 40%, transparent 80%)",
        }}
      />

      {/* Main Elevated Welcome Back / Create Account Card */}
      <div
        className="pulm-card"
        style={{
          position: "relative",
          zIndex: 10,
          width: "100%",
          maxWidth: "440px",
          padding: "36px 32px 32px 32px",
          backgroundColor: "#f7f6f0",
          borderRadius: "18px",
          border: "1px solid var(--border-color)",
          boxShadow: "0 12px 36px rgba(28, 50, 24, 0.07)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Shield Check Badge Icon Header with Dotted Horizontal Divider Lines */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            gap: "12px",
            marginBottom: "16px",
          }}
        >
          <div
            style={{
              flex: 1,
              borderTop: "2px dotted #c4c7b7",
            }}
          />

          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "50%",
              backgroundColor: "#e2e8d5",
              border: "3px solid #f7f6f0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 2px 10px rgba(28, 50, 24, 0.08)",
            }}
          >
            <ShieldCheckIcon size={28} color="#1c3218" checkColor="#ffffff" />
          </div>

          <div
            style={{
              flex: 1,
              borderTop: "2px dotted #c4c7b7",
            }}
          />
        </div>

        {/* Title */}
        <h1
          style={{
            fontSize: "22px",
            fontWeight: "800",
            letterSpacing: "2px",
            margin: "0 0 4px 0",
            textTransform: "uppercase",
            fontFamily: "var(--font-heading)",
          }}
        >
          {isSignUp ? (
            <>
              <span style={{ color: "var(--dark-forest)" }}>CREATE </span>
              <span style={{ color: "#7e915b" }}>ACCOUNT</span>
            </>
          ) : (
            <>
              <span style={{ color: "var(--dark-forest)" }}>WELCOME </span>
              <span style={{ color: "#7e915b" }}>BACK</span>
            </>
          )}
        </h1>

        {/* Diamond Symbol */}
        <div style={{ color: "#7e915b", fontSize: "9px", marginBottom: "12px" }}>
          ◆
        </div>

        {/* Subtitle */}
        <p
          style={{
            color: "var(--text-muted)",
            fontSize: "13px",
            textAlign: "center",
            marginTop: 0,
            marginBottom: "24px",
            lineHeight: 1.4,
          }}
        >
          {isSignUp
            ? "Register operator credentials to access the revenue recovery platform."
            : "Enter operator credentials to access the revenue recovery platform."}
        </p>

        {error && (
          <div
            className="pulm-card"
            style={{
              borderColor: "#a82a24",
              backgroundColor: "#fce8e6",
              padding: "10px 14px",
              marginBottom: "20px",
              width: "100%",
            }}
          >
            <span style={{ color: "#a82a24", fontSize: "13px", fontWeight: "bold" }}>
              {error}
            </span>
          </div>
        )}

        {successMsg && (
          <div
            className="pulm-card"
            style={{
              borderColor: "#1c3218",
              backgroundColor: "#d8e5b6",
              padding: "10px 14px",
              marginBottom: "20px",
              width: "100%",
            }}
          >
            <span style={{ color: "#1c3218", fontSize: "13px", fontWeight: "bold" }}>
              {successMsg}
            </span>
          </div>
        )}

        {/* Form Container */}
        <form onSubmit={handleSubmit} style={{ width: "100%", display: "flex", flexDirection: "column", gap: "18px" }}>
          {/* Full Name Field (Sign Up Only) */}
          {isSignUp && (
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label
                style={{
                  fontSize: "11px",
                  fontWeight: 800,
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                  color: "var(--dark-forest)",
                }}
              >
                FULL NAME
              </label>
              <div style={{ position: "relative", width: "100%" }}>
                <span
                  style={{
                    position: "absolute",
                    left: "14px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <UserIcon size={16} color="var(--dark-forest)" />
                </span>
                <input
                  type="text"
                  placeholder="Operator Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required={isSignUp}
                  style={{
                    width: "100%",
                    padding: "12px 14px 12px 40px",
                    border: "1px solid var(--border-color)",
                    borderRadius: "8px",
                    fontSize: "13px",
                    fontFamily: "var(--font-mono)",
                    backgroundColor: "var(--bg-cream)",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>
            </div>
          )}

          {/* Email Address Field */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label
              style={{
                fontSize: "11px",
                fontWeight: 800,
                letterSpacing: "1px",
                textTransform: "uppercase",
                color: "var(--dark-forest)",
              }}
            >
              EMAIL ADDRESS
            </label>
            <div style={{ position: "relative", width: "100%" }}>
              <span
                style={{
                  position: "absolute",
                  left: "14px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <EnvelopeIcon size={16} color="var(--dark-forest)" />
              </span>
              <input
                type="email"
                placeholder="admin@revenuerecovery.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "12px 14px 12px 40px",
                  border: "1px solid var(--border-color)",
                  borderRadius: "8px",
                  fontSize: "13px",
                  fontFamily: "var(--font-mono)",
                  backgroundColor: "var(--bg-cream)",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>
          </div>

          {/* Password Field */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label
              style={{
                fontSize: "11px",
                fontWeight: 800,
                letterSpacing: "1px",
                textTransform: "uppercase",
                color: "var(--dark-forest)",
              }}
            >
              PASSWORD
            </label>
            <div style={{ position: "relative", width: "100%" }}>
              <span
                style={{
                  position: "absolute",
                  left: "14px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <LockIcon size={16} color="var(--dark-forest)" />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "12px 40px 12px 40px",
                  border: "1px solid var(--border-color)",
                  borderRadius: "8px",
                  fontSize: "13px",
                  fontFamily: "var(--font-mono)",
                  backgroundColor: "var(--bg-cream)",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "14px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  padding: 0,
                }}
              >
                {showPassword ? (
                  <EyeOffIcon size={16} color="var(--text-muted)" />
                ) : (
                  <EyeIcon size={16} color="var(--text-muted)" />
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password Field (Sign Up Only) */}
          {isSignUp && (
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label
                style={{
                  fontSize: "11px",
                  fontWeight: 800,
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                  color: "var(--dark-forest)",
                }}
              >
                CONFIRM PASSWORD
              </label>
              <div style={{ position: "relative", width: "100%" }}>
                <span
                  style={{
                    position: "absolute",
                    left: "14px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <LockIcon size={16} color="var(--dark-forest)" />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required={isSignUp}
                  style={{
                    width: "100%",
                    padding: "12px 14px 12px 40px",
                    border: "1px solid var(--border-color)",
                    borderRadius: "8px",
                    fontSize: "13px",
                    fontFamily: "var(--font-mono)",
                    backgroundColor: "var(--bg-cream)",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>
            </div>
          )}

          {/* Remember Me & Forgot Password Row (Login Only) */}
          {!isSignUp && (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontSize: "12px",
                marginTop: "-4px",
              }}
            >
              <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", color: "var(--dark-forest)" }}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{ accentColor: "var(--dark-forest)" }}
                />
                Remember me
              </label>

              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  alert("Password reset link sent to admin@revenuerecovery.com");
                }}
                style={{
                  color: "var(--dark-forest)",
                  fontWeight: "600",
                  textDecoration: "none",
                }}
              >
                Forgot Password?
              </a>
            </div>
          )}

          {/* Submit Action Button */}
          <button
            type="submit"
            className="pulm-btn"
            disabled={loading}
            style={{
              marginTop: "6px",
              padding: "14px",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            {loading ? (
              "PROCESSING..."
            ) : (
              <>
                <span style={{ fontSize: "14px" }}>➔</span>{" "}
                {isSignUp ? "CREATE OPERATOR ACCOUNT" : "ENTER DASHBOARD"}
              </>
            )}
          </button>
        </form>

        {/* Toggle Mode Link (Sign Up <-> Login) */}
        <div style={{ marginTop: "20px", fontSize: "13px", textAlign: "center" }}>
          {isSignUp ? (
            <span>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(false);
                  setError("");
                  setSuccessMsg("");
                }}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--dark-forest)",
                  fontWeight: "bold",
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
              >
                Login here
              </button>
            </span>
          ) : (
            <span>
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(true);
                  setError("");
                  setSuccessMsg("");
                }}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--dark-forest)",
                  fontWeight: "bold",
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
              >
                Create Account
              </button>
            </span>
          )
        }
        </div>
      </div>

      {/* Footer Below Card */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          marginTop: "24px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "6px",
        }}
      >
        <div style={{ fontSize: "12px", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "10px" }}>
          <span>🛡 Secure</span>
          <span>•</span>
          <span>Intelligent</span>
          <span>•</span>
          <span>Reliable</span>
        </div>

        <div style={{ fontSize: "11px", color: "var(--text-muted)", opacity: 0.8 }}>
          © 2026 RecoverAI. All rights reserved.
        </div>
      </div>
    </main>
  );
}