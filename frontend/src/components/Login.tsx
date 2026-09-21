import { useState } from "react";
import type { FormEvent } from "react";
import "./Login.css";

interface LoginProps {
  onLogin: (email: string, password: string) => Promise<void>;
  error?: string;
  successMessage?: string;
}

function Login({
  onLogin,
  error,
  successMessage,
}: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email.trim() || !password.trim()) {
      return;
    }

    try {
      setLoading(true);
      await onLogin(email.trim(), password);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Animated background */}
      <div className="login-space">
        <div className="login-orb login-orb-one" />
        <div className="login-orb login-orb-two" />
        <div className="login-orb login-orb-three" />

        <span className="login-star star-one">✦</span>
        <span className="login-star star-two">✧</span>
        <span className="login-star star-three">✦</span>
        <span className="login-star star-four">·</span>
        <span className="login-star star-five">✧</span>

        <div className="login-ring ring-one" />
        <div className="login-ring ring-two" />
      </div>

      <div className="login-container">
        {/* LEFT ROBOT AREA */}
        <div className="login-visual">
          <div className="robot-glow" />

          <div className="robot-orbit robot-orbit-one" />
          <div className="robot-orbit robot-orbit-two" />

          <div className="robot-wrapper">
            <div className="robot-antenna">
              <span />
            </div>

            <div className="robot-head">
              <div className="robot-ear robot-ear-left" />
              <div className="robot-ear robot-ear-right" />

              <div className="robot-face">
                <div className="robot-eye robot-eye-left">
                  <span />
                </div>

                <div className="robot-eye robot-eye-right">
                  <span />
                </div>

                <div className="robot-smile">
                  ◡
                </div>
              </div>
            </div>

            <div className="robot-neck" />

            <div className="robot-body">
              <div className="robot-chest">
                <span>AI</span>
              </div>

              <div className="robot-body-light" />
            </div>

            <div className="robot-arm robot-arm-left">
              <div className="robot-hand">
                <span />
              </div>
            </div>

            <div className="robot-arm robot-arm-right">
              <div className="robot-hand">
                <span />
              </div>
            </div>

            <div className="robot-leg robot-leg-left" />
            <div className="robot-leg robot-leg-right" />
          </div>

          <div className="robot-message">
            <span className="robot-message-dot" />
            AI SYSTEM ONLINE
          </div>

          <div className="robot-caption">
            <strong>Your AI incident copilot</strong>
            <span>
              Analyze incidents. Find root causes. Resolve faster.
            </span>
          </div>
        </div>

        {/* RIGHT LOGIN CARD */}
        <div className="login-card">
          <div className="login-card-glow" />

          <div className="login-header">
            <div className="login-brand-row">
              <div className="login-brand-icon">
                <span>✦</span>
              </div>

              <div>
                <div className="login-brand-name">
                  IncidentFlow <span>AI</span>
                </div>

                <div className="login-brand-tagline">
                  SMARTER INCIDENT MANAGEMENT
                </div>
              </div>
            </div>

            <div className="login-welcome">
              <h1>Welcome back</h1>

              <p>
                Sign in to access your incident workspace.
              </p>
            </div>
          </div>

          {successMessage && (
            <div className="login-success">
              <span>✓</span>
              {successMessage}
            </div>
          )}

          {error && (
            <div className="login-error">
              <span>⚠</span>
              {error}
            </div>
          )}

          <form
            className="login-form"
            onSubmit={handleSubmit}
          >
            {/* EMAIL */}
            <div className="login-field">
              <label htmlFor="login-email">
                Email
              </label>

              <div className="login-input-wrapper">
                <div className="login-input-icon">
                  ✉
                </div>

                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  placeholder="Enter your email"
                  autoComplete="email"
                  required
                />

                <div className="input-active-line" />
              </div>
            </div>

            {/* PASSWORD */}
            <div className="login-field">
              <label htmlFor="login-password">
                Password
              </label>

              <div className="login-input-wrapper">
                <div className="login-input-icon">
                  🔒
                </div>

                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword((value) => !value)
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? "◉" : "◌"}
                </button>

                <div className="input-active-line" />
              </div>
            </div>

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              <span className="login-button-text">
                {loading ? "Signing in..." : "Sign in"}
              </span>

              <span className="login-button-arrow">
                {loading ? "◌" : "→"}
              </span>
            </button>
          </form>

          <div className="login-divider">
            <span />
            <b>SECURE ACCESS</b>
            <span />
          </div>

          <div className="login-security">
            <div className="security-item">
              <span>🛡️</span>
              <div>
                <strong>JWT Protected</strong>
                <small>Secure authentication</small>
              </div>
            </div>

            <div className="security-item">
              <span>🤖</span>
              <div>
                <strong>AI Powered</strong>
                <small>Intelligent incident analysis</small>
              </div>
            </div>
          </div>

          <div className="login-footer">
            <span className="footer-dot" />
            IncidentFlow AI
            <span>•</span>
            Secure
            <span>•</span>
            Fast
            <span>•</span>
            Intelligent
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;