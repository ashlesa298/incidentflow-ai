import { useState } from "react";

function Settings() {
  const [notifications, setNotifications] = useState(true);
  const [aiSuggestions, setAiSuggestions] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  };

  return (
    <div className="settings-page">
      <style>{`
        .settings-page {
          position: relative;
          animation: settingsFadeIn 0.5s ease;
          padding-bottom: 40px;
        }

        @keyframes settingsFadeIn {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .settings-hero {
          position: relative;
          overflow: hidden;
          margin-bottom: 24px;
          padding: 28px;
          border-radius: 20px;
          border: 1px solid rgba(167, 139, 250, 0.18);
          background:
            radial-gradient(
              circle at 85% 20%,
              rgba(124, 92, 255, 0.18),
              transparent 32%
            ),
            linear-gradient(
              135deg,
              rgba(255, 255, 255, 0.055),
              rgba(255, 255, 255, 0.018)
            );
          box-shadow:
            0 20px 60px rgba(0, 0, 0, 0.22),
            inset 0 1px 0 rgba(255, 255, 255, 0.04);
        }

        .settings-hero::before {
          content: "";
          position: absolute;
          width: 180px;
          height: 180px;
          right: -70px;
          top: -80px;
          border: 1px solid rgba(167, 139, 250, 0.2);
          border-radius: 50%;
          animation: settingsOrbit 9s linear infinite;
        }

        .settings-hero::after {
          content: "";
          position: absolute;
          width: 100px;
          height: 100px;
          right: 35px;
          top: 35px;
          border: 1px solid rgba(124, 92, 255, 0.16);
          border-radius: 50%;
          animation: settingsOrbitReverse 6s linear infinite;
        }

        @keyframes settingsOrbit {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes settingsOrbitReverse {
          from {
            transform: rotate(360deg);
          }
          to {
            transform: rotate(0deg);
          }
        }

        .settings-hero-content {
          position: relative;
          z-index: 2;
        }

        .settings-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 7px 11px;
          margin-bottom: 14px;
          border-radius: 999px;
          background: rgba(124, 92, 255, 0.1);
          border: 1px solid rgba(124, 92, 255, 0.18);
          color: #b9a7ff;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1.4px;
        }

        .settings-hero h2 {
          margin: 0;
          font-size: 28px;
          font-weight: 700;
        }

        .settings-hero p {
          margin: 9px 0 0;
          color: rgba(255, 255, 255, 0.58);
          font-size: 14px;
          max-width: 650px;
        }

        .settings-grid {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
          gap: 20px;
        }

        .settings-card {
          position: relative;
          padding: 22px;
          border-radius: 18px;
          border: 1px solid rgba(255, 255, 255, 0.07);
          background: rgba(255, 255, 255, 0.025);
          box-shadow:
            0 15px 40px rgba(0, 0, 0, 0.14),
            inset 0 1px 0 rgba(255, 255, 255, 0.025);
          transition:
            transform 0.25s ease,
            border-color 0.25s ease,
            box-shadow 0.25s ease;
        }

        .settings-card:hover {
          transform: translateY(-2px);
          border-color: rgba(167, 139, 250, 0.18);
          box-shadow:
            0 20px 50px rgba(0, 0, 0, 0.2),
            0 0 35px rgba(124, 92, 255, 0.06);
        }

        .settings-card.full-width {
          grid-column: 1 / -1;
        }

        .settings-card-header {
          display: flex;
          align-items: center;
          gap: 13px;
          margin-bottom: 20px;
        }

        .settings-card-icon {
          width: 42px;
          height: 42px;
          display: grid;
          place-items: center;
          border-radius: 13px;
          background: linear-gradient(
            135deg,
            rgba(124, 92, 255, 0.2),
            rgba(167, 139, 250, 0.06)
          );
          border: 1px solid rgba(167, 139, 250, 0.16);
          font-size: 20px;
          box-shadow: 0 0 22px rgba(124, 92, 255, 0.1);
        }

        .settings-card-header h3 {
          margin: 0;
          font-size: 16px;
        }

        .settings-card-header p {
          margin: 4px 0 0;
          color: rgba(255, 255, 255, 0.45);
          font-size: 12px;
        }

        .setting-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          padding: 16px 0;
          border-top: 1px solid rgba(255, 255, 255, 0.055);
        }

        .setting-row:first-of-type {
          border-top: 0;
          padding-top: 0;
        }

        .setting-info strong {
          display: block;
          font-size: 14px;
          font-weight: 600;
        }

        .setting-info span {
          display: block;
          margin-top: 5px;
          color: rgba(255, 255, 255, 0.42);
          font-size: 12px;
          line-height: 1.5;
        }

        .toggle {
          position: relative;
          width: 48px;
          height: 26px;
          flex: 0 0 auto;
          border: 0;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.12);
          cursor: pointer;
          transition: background 0.25s ease;
        }

        .toggle.active {
          background: linear-gradient(
            90deg,
            #6d4cff,
            #a78bfa
          );
          box-shadow: 0 0 18px rgba(124, 92, 255, 0.28);
        }

        .toggle-knob {
          position: absolute;
          width: 20px;
          height: 20px;
          left: 3px;
          top: 3px;
          border-radius: 50%;
          background: #fff;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
          transition: transform 0.25s ease;
        }

        .toggle.active .toggle-knob {
          transform: translateX(22px);
        }

        .profile-panel {
          display: flex;
          align-items: center;
          gap: 18px;
          padding: 18px;
          border-radius: 15px;
          background: rgba(255, 255, 255, 0.025);
          border: 1px solid rgba(255, 255, 255, 0.055);
        }

        .profile-avatar {
          position: relative;
          width: 58px;
          height: 58px;
          display: grid;
          place-items: center;
          flex: 0 0 auto;
          border-radius: 17px;
          background: linear-gradient(
            135deg,
            #7c5cff,
            #a78bfa
          );
          font-size: 22px;
          font-weight: 800;
          color: white;
          box-shadow: 0 0 28px rgba(124, 92, 255, 0.22);
        }

        .profile-status {
          position: absolute;
          width: 11px;
          height: 11px;
          right: -2px;
          bottom: -2px;
          border-radius: 50%;
          background: #34d399;
          border: 2px solid #12121a;
        }

        .profile-details strong {
          display: block;
          font-size: 15px;
        }

        .profile-details span {
          display: block;
          margin-top: 5px;
          color: rgba(255, 255, 255, 0.45);
          font-size: 12px;
        }

        .system-info {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 12px;
        }

        .system-item {
          padding: 15px;
          border-radius: 13px;
          background: rgba(255, 255, 255, 0.025);
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .system-item span {
          display: block;
          color: rgba(255, 255, 255, 0.4);
          font-size: 10px;
          letter-spacing: 0.8px;
          font-weight: 700;
        }

        .system-item strong {
          display: block;
          margin-top: 8px;
          font-size: 14px;
        }

        .status-online {
          display: inline-flex;
          align-items: center;
          gap: 7px;
        }

        .status-online::before {
          content: "";
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #34d399;
          box-shadow: 0 0 10px rgba(52, 211, 153, 0.7);
        }

        .save-area {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          gap: 14px;
          margin-top: 22px;
        }

        .saved-message {
          color: #6ee7b7;
          font-size: 13px;
          animation: savedPop 0.3s ease;
        }

        @keyframes savedPop {
          from {
            opacity: 0;
            transform: translateX(8px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .save-button {
          border: 0;
          padding: 12px 20px;
          border-radius: 11px;
          color: white;
          font-weight: 700;
          font-size: 13px;
          cursor: pointer;
          background: linear-gradient(
            135deg,
            #6d4cff,
            #9f7aea
          );
          box-shadow:
            0 8px 25px rgba(124, 92, 255, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.15);
          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease;
        }

        .save-button:hover {
          transform: translateY(-2px);
          box-shadow:
            0 12px 30px rgba(124, 92, 255, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.15);
        }

        .ai-settings-badge {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          margin-top: 18px;
          padding: 8px 11px;
          border-radius: 9px;
          background: rgba(52, 211, 153, 0.07);
          border: 1px solid rgba(52, 211, 153, 0.12);
          color: #6ee7b7;
          font-size: 11px;
          font-weight: 600;
        }

        @media (max-width: 900px) {
          .settings-grid {
            grid-template-columns: 1fr;
          }

          .settings-card.full-width {
            grid-column: auto;
          }
        }

        @media (max-width: 600px) {
          .settings-hero {
            padding: 22px;
          }

          .settings-hero h2 {
            font-size: 23px;
          }

          .system-info {
            grid-template-columns: 1fr;
          }

          .setting-row {
            align-items: flex-start;
          }

          .profile-panel {
            align-items: flex-start;
          }
        }
      `}</style>

      <div className="settings-hero">
        <div className="settings-hero-content">
          <div className="settings-eyebrow">
            ⚙ WORKSPACE CONFIGURATION
          </div>

          <h2>Settings & Preferences</h2>

          <p>
            Manage your IncidentFlow workspace, AI assistance,
            notifications and application preferences.
          </p>
        </div>
      </div>

      <div className="settings-grid">
        <div className="settings-card">
          <div className="settings-card-header">
            <div className="settings-card-icon">◉</div>

            <div>
              <h3>Profile</h3>
              <p>Your current workspace identity</p>
            </div>
          </div>

          <div className="profile-panel">
            <div className="profile-avatar">
              A
              <span className="profile-status"></span>
            </div>

            <div className="profile-details">
              <strong>Ashlesa</strong>
              <span>IncidentFlow Support Workspace</span>
            </div>
          </div>
        </div>

        <div className="settings-card">
          <div className="settings-card-header">
            <div className="settings-card-icon">🤖</div>

            <div>
              <h3>AI Copilot</h3>
              <p>Configure AI-assisted workflows</p>
            </div>
          </div>

          <div className="setting-row">
            <div className="setting-info">
              <strong>AI Suggestions</strong>
              <span>
                Enable AI-generated troubleshooting and
                incident guidance.
              </span>
            </div>

            <button
              type="button"
              className={`toggle ${aiSuggestions ? "active" : ""}`}
              onClick={() =>
                setAiSuggestions((current) => !current)
              }
              aria-label="Toggle AI suggestions"
            >
              <span className="toggle-knob"></span>
            </button>
          </div>

          <div className="ai-settings-badge">
            ● Gemini AI integration available
          </div>
        </div>

        <div className="settings-card">
          <div className="settings-card-header">
            <div className="settings-card-icon">◌</div>

            <div>
              <h3>Notifications</h3>
              <p>Control workspace notifications</p>
            </div>
          </div>

          <div className="setting-row">
            <div className="setting-info">
              <strong>Incident Notifications</strong>
              <span>
                Receive updates when incidents change status
                or require attention.
              </span>
            </div>

            <button
              type="button"
              className={`toggle ${notifications ? "active" : ""}`}
              onClick={() =>
                setNotifications((current) => !current)
              }
              aria-label="Toggle notifications"
            >
              <span className="toggle-knob"></span>
            </button>
          </div>

          <div className="setting-row">
            <div className="setting-info">
              <strong>Automatic Refresh</strong>
              <span>
                Keep dashboard information synchronized with
                the backend.
              </span>
            </div>

            <button
              type="button"
              className={`toggle ${autoRefresh ? "active" : ""}`}
              onClick={() =>
                setAutoRefresh((current) => !current)
              }
              aria-label="Toggle automatic refresh"
            >
              <span className="toggle-knob"></span>
            </button>
          </div>
        </div>

        <div className="settings-card">
          <div className="settings-card-header">
            <div className="settings-card-icon">◇</div>

            <div>
              <h3>System Status</h3>
              <p>Current application environment</p>
            </div>
          </div>

          <div className="system-info">
            <div className="system-item">
              <span>BACKEND</span>
              <strong className="status-online">ONLINE</strong>
            </div>

            <div className="system-item">
              <span>AUTH</span>
              <strong>JWT</strong>
            </div>

            <div className="system-item">
              <span>AI ENGINE</span>
              <strong>GEMINI</strong>
            </div>
          </div>
        </div>

        <div className="settings-card full-width">
          <div className="settings-card-header">
            <div className="settings-card-icon">◈</div>

            <div>
              <h3>Platform Information</h3>
              <p>IncidentFlow technical configuration</p>
            </div>
          </div>

          <div className="system-info">
            <div className="system-item">
              <span>FRONTEND</span>
              <strong>React + TypeScript</strong>
            </div>

            <div className="system-item">
              <span>BACKEND</span>
              <strong>Java + Spring Boot</strong>
            </div>

            <div className="system-item">
              <span>DATABASE</span>
              <strong>PostgreSQL</strong>
            </div>
          </div>

          <div className="save-area">
            {saved && (
              <span className="saved-message">
                ✓ Settings saved successfully
              </span>
            )}

            <button
              type="button"
              className="save-button"
              onClick={handleSave}
            >
              Save Preferences
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;