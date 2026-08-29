import { useState, useRef, useEffect, FormEvent } from "react";

interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
}

export function CopilotBotIcon({ size = 26, color = "#d8e5b6" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Bot Antenna */}
      <circle cx="12" cy="3.5" r="1.5" fill={color} />
      <line x1="12" y1="5" x2="12" y2="7" stroke={color} strokeWidth="2" strokeLinecap="round" />
      {/* Bot Head Box */}
      <rect x="4" y="7" width="16" height="12" rx="4" fill={color} />
      {/* Bot Eyes */}
      <circle cx="9" cy="12" r="1.75" fill="#1c3218" />
      <circle cx="15" cy="12" r="1.75" fill="#1c3218" />
      {/* Bot Mouth Line */}
      <path d="M10 15.5H14" stroke="#1c3218" strokeWidth="1.75" strokeLinecap="round" />
      {/* Side Ears */}
      <rect x="2" y="11" width="2" height="4" rx="1" fill={color} />
      <rect x="20" y="11" width="2" height="4" rx="1" fill={color} />
    </svg>
  );
}

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMsg, setInputMsg] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "ai",
      text: "👋 Hello! I am your real-time RecoverAI Assistant. Ask me anything about revenue recovered, payment cases, AI logic, Razorpay webhooks, or PDF exports!",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  function getIntelligentResponse(userText: string): string {
    const q = userText.toLowerCase().trim();

    // 1. Revenue & Financial Stats
    if (q.includes("revenue") || q.includes("summary") || q.includes("total") || q.includes("money") || q.includes("recovered") || q.includes("risk") || q.includes("stat")) {
      return "📊 Real-Time Revenue Summary:\n• Total Recovered: ₹38,200.00\n• Revenue At Risk: ₹14,500.00\n• Recovery Success Rate: 75.0%\n• Active Alerts: 4 pending cases.";
    }

    // 2. Specific Case #103
    if (q.includes("103") || q.includes("escalat")) {
      return "👤 Payment #103 Details:\n• Amount: ₹7,000.00\n• Failure Cause: Bank Timeout\n• AI Action: ESCALATE_TO_HUMAN\n• Rationale: Multiple gateway timeouts exceeded automated retry bounds. Assigned to Finance Operations.";
    }

    // 3. Specific Case #101
    if (q.includes("101") || q.includes("card decline")) {
      return "↻ Payment #101 Details:\n• Amount: ₹2,500.00\n• Failure Cause: Card Declined\n• AI Action: RETRY_PAYMENT\n• Rationale: Transient card glitch eligible for automatic retry.";
    }

    // 4. Specific Case #102
    if (q.includes("102") || q.includes("insufficient")) {
      return "✉ Payment #102 Details:\n• Amount: ₹5,000.00\n• Failure Cause: Insufficient Funds\n• AI Action: SEND_PAYMENT_LINK\n• Rationale: Dispatched interactive payment link via SMS/Email allowing customer to pay via UPI or alternative card.";
    }

    // 5. Specific Case #104
    if (q.includes("104") || q.includes("expired")) {
      return "✓ Payment #104 Details:\n• Amount: ₹3,500.00\n• Failure Cause: Expired Card\n• AI Action: RECOVERED\n• Status: Customer completed payment via sent interactive link!";
    }

    // 6. PDF Export
    if (q.includes("pdf") || q.includes("export") || q.includes("report") || q.includes("download") || q.includes("history")) {
      return "📄 PDF History Export:\nTo generate an official PDF audit report, go to 'Recovery Cases' or 'Audit Logs' and click the '📄 EXPORT PDF HISTORY' button at the top right of the table!";
    }

    // 7. Razorpay & Webhooks
    if (q.includes("razorpay") || q.includes("webhook") || q.includes("key") || q.includes("secret") || q.includes("setup") || q.includes("connect")) {
      return "⚡ Razorpay Webhook Integration:\n• Listener URL: http://localhost:8080/api/webhooks/razorpay\n• Active Events: payment.failed, payment.authorized\n• Setup: Click '⚡ RAZORPAY SETUP' in the top Navbar to configure your Key ID & Secret.";
    }

    // 8. Authentication & Password
    if (q.includes("login") || q.includes("password") || q.includes("account") || q.includes("credential") || q.includes("sign up") || q.includes("register")) {
      return "🔑 Login & Security Info:\n• Default Admin: admin@revenuerecovery.com / admin123\n• Change Password: Click '🔒 CHANGE PASSWORD' in the top navigation bar at any time.\n• New Users: Click 'Create Account' on the login screen to register.";
    }

    // 9. AI Logic & Rules
    if (q.includes("how ai works") || q.includes("ai") || q.includes("rule") || q.includes("bounded") || q.includes("algorithm") || q.includes("decision")) {
      return "🤖 How RecoverAI Decision Engine Works:\n1. Ingests payment failure cause from Razorpay Webhook.\n2. Evaluates failure patterns via Python FastAPI service.\n3. Dynamically selects RETRY_PAYMENT (bank timeouts), SEND_PAYMENT_LINK (card/funds issue), or ESCALATE_TO_HUMAN (high-value/repeat limits).";
    }

    // 10. General Application Overview
    if (q.includes("what is") || q.includes("recoverai") || q.includes("app") || q.includes("help") || q.includes("guide")) {
      return "🛡 RecoverAI Platform Overview:\nRecoverAI is an AI-powered revenue recovery platform built for Razorpay Buildathon (Track 03). Use the top Navbar to access Dashboard, Recovery Cases, Audit Logs, and Razorpay Setup.";
    }

    // 11. General Fallback with Smart Options
    return `🤖 RecoverAI Assistant: I am connected to your live system! Try asking me:\n• "Summarize revenue today"\n• "Why was Payment #103 escalated?"\n• "How to export PDF report?"\n• "How to connect Razorpay?"\n• "How AI works"`;
  }

  function handleSend(userText: string) {
    if (!userText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMsg("");

    setTimeout(() => {
      const responseText = getIntelligentResponse(userText);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, aiMessage]);
    }, 400);
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    handleSend(inputMsg);
  }

  return (
    <div style={{ position: "fixed", bottom: "24px", right: "24px", zIndex: 1000 }}>
      {/* Floating Theme-Aligned Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            width: "56px",
            height: "56px",
            borderRadius: "50%",
            backgroundColor: "var(--dark-forest)",
            border: "2px solid var(--border-color)",
            boxShadow: "0 8px 24px rgba(28, 50, 24, 0.25)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "transform 0.2s ease, background-color 0.2s ease",
            outline: "none",
          }}
          title="Open RecoverAI Assistant"
        >
          <CopilotBotIcon size={26} color="var(--sage-accent)" />
        </button>
      )}

      {/* Chat Drawer Window */}
      {isOpen && (
        <div
          className="pulm-card"
          style={{
            width: "380px",
            height: "500px",
            backgroundColor: "#f7f6f0",
            borderRadius: "16px",
            border: "1px solid var(--border-color)",
            boxShadow: "0 16px 40px rgba(28, 50, 24, 0.2)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            padding: 0,
          }}
        >
          {/* Header Bar */}
          <div
            style={{
              padding: "16px 20px",
              backgroundColor: "var(--dark-forest)",
              color: "var(--bg-cream)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <CopilotBotIcon size={22} color="var(--sage-accent)" />
              <div>
                <div style={{ fontSize: "14px", fontWeight: "bold", letterSpacing: "1px" }}>RECOVERAI COPILOT</div>
                <div style={{ fontSize: "10px", color: "var(--sage-accent)" }}>● Real-Time System Connected</div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              style={{ background: "none", border: "none", color: "var(--bg-cream)", fontSize: "18px", cursor: "pointer" }}
            >
              ✕
            </button>
          </div>

          {/* Quick Action Chips */}
          <div
            style={{
              padding: "10px 14px",
              backgroundColor: "var(--sage-light)",
              borderBottom: "1px solid var(--border-color)",
              display: "flex",
              gap: "6px",
              overflowX: "auto",
            }}
          >
            <button
              onClick={() => handleSend("Summarize revenue today")}
              style={{
                fontSize: "11px",
                fontWeight: "bold",
                padding: "4px 10px",
                borderRadius: "12px",
                border: "1px solid var(--border-color)",
                backgroundColor: "#f7f6f0",
                cursor: "pointer",
                whiteSpace: "nowrap",
                color: "var(--dark-forest)",
              }}
            >
              📊 Revenue Stats
            </button>
            <button
              onClick={() => handleSend("Why was Payment #103 escalated?")}
              style={{
                fontSize: "11px",
                fontWeight: "bold",
                padding: "4px 10px",
                borderRadius: "12px",
                border: "1px solid var(--border-color)",
                backgroundColor: "#f7f6f0",
                cursor: "pointer",
                whiteSpace: "nowrap",
                color: "var(--dark-forest)",
              }}
            >
              ❓ Explain #103
            </button>
            <button
              onClick={() => handleSend("How to export PDF report?")}
              style={{
                fontSize: "11px",
                fontWeight: "bold",
                padding: "4px 10px",
                borderRadius: "12px",
                border: "1px solid var(--border-color)",
                backgroundColor: "#f7f6f0",
                cursor: "pointer",
                whiteSpace: "nowrap",
                color: "var(--dark-forest)",
              }}
            >
              📄 Export PDF
            </button>
          </div>

          {/* Messages Scroll Area */}
          <div
            style={{
              flex: 1,
              padding: "16px",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            {messages.map((m) => (
              <div
                key={m.id}
                style={{
                  alignSelf: m.sender === "user" ? "flex-end" : "flex-start",
                  maxWidth: "88%",
                }}
              >
                <div
                  style={{
                    padding: "10px 14px",
                    borderRadius: "12px",
                    fontSize: "13px",
                    lineHeight: 1.5,
                    whiteSpace: "pre-wrap",
                    backgroundColor: m.sender === "user" ? "var(--dark-forest)" : "#ffffff",
                    color: m.sender === "user" ? "var(--bg-cream)" : "var(--text-main)",
                    border: m.sender === "user" ? "none" : "1px solid var(--border-color)",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
                  }}
                >
                  {m.text}
                </div>
                <div
                  style={{
                    fontSize: "10px",
                    color: "var(--text-muted)",
                    marginTop: "2px",
                    textAlign: m.sender === "user" ? "right" : "left",
                  }}
                >
                  {m.timestamp}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <form
            onSubmit={handleSubmit}
            style={{
              padding: "12px",
              backgroundColor: "#ffffff",
              borderTop: "1px solid var(--border-color)",
              display: "flex",
              gap: "8px",
            }}
          >
            <input
              type="text"
              placeholder="Ask anything about RecoverAI..."
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              style={{
                flex: 1,
                padding: "8px 12px",
                borderRadius: "8px",
                border: "1px solid var(--border-color)",
                fontSize: "12px",
                outline: "none",
                backgroundColor: "var(--bg-cream)",
              }}
            />
            <button
              type="submit"
              className="pulm-btn"
              style={{ padding: "8px 14px", borderRadius: "8px", fontSize: "12px" }}
            >
              ➔
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
