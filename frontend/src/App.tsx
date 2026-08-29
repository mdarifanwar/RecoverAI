import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import RecoveryCases from "./pages/RecoveryCases";
import AuditLogs from "./pages/AuditLogs";
import Login from "./pages/Login";
import ChatbotWidget from "./components/ChatbotWidget";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const hasToken = !!localStorage.getItem("token");
  if (!hasToken) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

function App() {
  const hasToken = !!localStorage.getItem("token");

  return (
    <BrowserRouter>
      <Navbar />

      <main>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/recovery-cases"
            element={
              <ProtectedRoute>
                <RecoveryCases />
              </ProtectedRoute>
            }
          />

          <Route
            path="/audit-logs"
            element={
              <ProtectedRoute>
                <AuditLogs />
              </ProtectedRoute>
            }
          />

          <Route path="/login" element={<Login />} />

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>

      {hasToken && <ChatbotWidget />}
    </BrowserRouter>
  );
}

export default App;