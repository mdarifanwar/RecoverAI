import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import ChangePasswordModal from "./ChangePasswordModal";
import RazorpaySetupModal from "./RazorpaySetupModal";

export function ShieldCheckIcon({ size = 22, color = "#1c3218", checkColor = "#ffffff" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 2L4 5V11C4 16.55 7.4 21.74 12 23C16.6 21.74 20 16.55 20 11V5L12 2Z"
        fill={color}
      />
      <path
        d="M9.5 11.5L11 13L15 9"
        stroke={checkColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function UserIcon({ size = 16, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

export function EnvelopeIcon({ size = 16, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M22 6l-10 7L2 6" />
    </svg>
  );
}

export function LockIcon({ size = 16, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

export function EyeIcon({ size = 16, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export function EyeOffIcon({ size = 16, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [razorpaySetupOpen, setRazorpaySetupOpen] = useState(false);

  const isLoginPage = location.pathname === "/login";
  const hasToken = !!localStorage.getItem("token");
  const isLoggedIn = hasToken && !isLoginPage;

  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    setSearchQuery(searchParams.get("q") || "");
  }, [searchParams]);

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setSearchQuery(val);
    if (val.trim()) {
      navigate(`/recovery-cases?q=${encodeURIComponent(val)}`);
    } else if (location.pathname === "/recovery-cases") {
      navigate("/recovery-cases");
    }
  }

  function handleLogout() {
    localStorage.removeItem("token");
    setMobileOpen(false);
    navigate("/login");
  }

  function handleLogin() {
    setMobileOpen(false);
    navigate("/login");
  }

  return (
    <header className="top-navbar">
      <div className="brand-logo" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <ShieldCheckIcon size={22} color="#1c3218" checkColor="#ffffff" />
        <Link to="/dashboard">RECOVERAI</Link>
      </div>

      {isLoggedIn && (
        <div className="search-bar-container">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="SEARCH RECOVERY CASES..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
      )}

      <button
        className="mobile-menu-btn"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        ≡ MENU
      </button>

      <nav className={`nav-pills ${mobileOpen ? "mobile-open" : ""}`}>
        {isLoggedIn && (
          <>
            <Link
              to="/dashboard"
              className={`nav-pill ${isActive("/dashboard") ? "active" : ""}`}
            >
              DASHBOARD
            </Link>

            <Link
              to="/recovery-cases"
              className={`nav-pill ${isActive("/recovery-cases") ? "active" : ""}`}
            >
              RECOVERY CASES
            </Link>

            <Link
              to="/audit-logs"
              className={`nav-pill ${isActive("/audit-logs") ? "active" : ""}`}
            >
              AUDIT LOGS
            </Link>

            <button
              className="nav-pill"
              style={{ cursor: "pointer", border: "none", display: "inline-flex", alignItems: "center", gap: "6px" }}
              onClick={() => setRazorpaySetupOpen(true)}
            >
              ⚡ RAZORPAY SETUP
            </button>
          </>
        )}

        {isLoggedIn ? (
          <>
            <button
              className="nav-pill"
              style={{ cursor: "pointer", border: "none", display: "inline-flex", alignItems: "center", gap: "6px" }}
              onClick={() => setChangePasswordOpen(true)}
            >
              <LockIcon size={14} /> CHANGE PASSWORD
            </button>

            <button
              className="nav-pill"
              style={{ cursor: "pointer", border: "none", display: "inline-flex", alignItems: "center", gap: "6px" }}
              onClick={handleLogout}
            >
              <UserIcon size={14} /> LOGOUT
            </button>
          </>
        ) : (
          <button
            className={`nav-pill ${isLoginPage ? "active" : ""}`}
            style={{ cursor: "pointer", border: "none", display: "inline-flex", alignItems: "center", gap: "6px" }}
            onClick={handleLogin}
          >
            <UserIcon size={14} /> LOGIN
          </button>
        )}
      </nav>

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={changePasswordOpen}
        onClose={() => setChangePasswordOpen(false)}
      />

      {/* Razorpay Account Setup Modal */}
      <RazorpaySetupModal
        isOpen={razorpaySetupOpen}
        onClose={() => setRazorpaySetupOpen(false)}
      />
    </header>
  );
}

export default Navbar;