import { useState } from "react";
import type { FormEvent } from "react";
import "./Login.css";

interface LoginProps {
  onLogin: (email: string, password: string) => Promise<void>;
  error?: string;
  successMessage?: string;
}

type Role =
  | "ADMIN"
  | "MANAGER"
  | "SUPPORT_AGENT"
  | "DEVELOPER"
  | "CUSTOMER";

function Login({
  onLogin,
  error,
  successMessage,
}: LoginProps) {
  /* =========================================================
     MODE
     ========================================================= */

  const [isRegistering, setIsRegistering] =
    useState(false);

  /* =========================================================
     LOGIN STATE
     ========================================================= */

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [loginLoading, setLoginLoading] =
    useState(false);

  const [loginError, setLoginError] =
    useState("");

  /* =========================================================
     REGISTER STATE
     ========================================================= */

  const [registerName, setRegisterName] =
    useState("");

  const [registerEmail, setRegisterEmail] =
    useState("");

  const [registerPassword, setRegisterPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [registerRole, setRegisterRole] =
    useState<Role>("SUPPORT_AGENT");

  const [showRegisterPassword, setShowRegisterPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [registerLoading, setRegisterLoading] =
    useState(false);

  const [registerError, setRegisterError] =
    useState("");

  const [registerSuccess, setRegisterSuccess] =
    useState("");

  /* =========================================================
     API BASE URL
     ========================================================= */

  const API_BASE_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:8080";

  /* =========================================================
     LOGIN
     ========================================================= */

  const handleLogin = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setLoginError("");

    if (!email.trim()) {
      setLoginError("Please enter your email.");
      return;
    }

    if (!password) {
      setLoginError("Please enter your password.");
      return;
    }

    setLoginLoading(true);

    try {
      await onLogin(
        email.trim(),
        password
      );
    } catch (err) {
      setLoginError(
        err instanceof Error
          ? err.message
          : "Login failed. Please check your credentials."
      );
    } finally {
      setLoginLoading(false);
    }
  };

  /* =========================================================
     REGISTER
     ========================================================= */

  const handleRegister = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setRegisterError("");
    setRegisterSuccess("");

    const name = registerName.trim();
    const newEmail = registerEmail.trim();

    if (!name) {
      setRegisterError(
        "Please enter your full name."
      );
      return;
    }

    if (!newEmail) {
      setRegisterError(
        "Please enter your email."
      );
      return;
    }

    if (!newEmail.includes("@")) {
      setRegisterError(
        "Please enter a valid email address."
      );
      return;
    }

    if (!registerPassword) {
      setRegisterError(
        "Please enter a password."
      );
      return;
    }

    if (registerPassword.length < 6) {
      setRegisterError(
        "Password must be at least 6 characters."
      );
      return;
    }

    if (
      registerPassword !== confirmPassword
    ) {
      setRegisterError(
        "Passwords do not match."
      );
      return;
    }

    setRegisterLoading(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email: newEmail,
            password: registerPassword,
            role: registerRole,
          }),
        }
      );

      let data: unknown = null;

      try {
        data = await response.json();
      } catch {
        data = null;
      }

      if (!response.ok) {
        let message =
          "Registration failed. Please try again.";

        if (
          typeof data === "object" &&
          data !== null
        ) {
          const body =
            data as {
              message?: string;
              error?: string;
            };

          if (body.message) {
            message = body.message;
          } else if (body.error) {
            message = body.error;
          }
        }

        throw new Error(message);
      }

      setRegisterSuccess(
        "Account created successfully. You can now sign in."
      );

      setEmail(newEmail);

      setRegisterName("");
      setRegisterEmail("");
      setRegisterPassword("");
      setConfirmPassword("");
      setRegisterRole("SUPPORT_AGENT");

      setTimeout(() => {
        setIsRegistering(false);
        setRegisterSuccess("");
      }, 1200);
    } catch (err) {
      setRegisterError(
        err instanceof Error
          ? err.message
          : "Registration failed. Please try again."
      );
    } finally {
      setRegisterLoading(false);
    }
  };

  /* =========================================================
     SWITCH TO REGISTER
     ========================================================= */

  const openRegister = () => {
    setIsRegistering(true);

    setLoginError("");
    setRegisterError("");
    setRegisterSuccess("");
  };

  /* =========================================================
     SWITCH TO LOGIN
     ========================================================= */

  const openLogin = () => {
    setIsRegistering(false);

    setLoginError("");
    setRegisterError("");
    setRegisterSuccess("");
  };

  /* =========================================================
     RENDER
     ========================================================= */

  return (
    <div className="login-page">

      {/* =====================================================
          SPACE BACKGROUND
          ===================================================== */}

      <div className="login-space">

        <div className="login-orb login-orb-one" />
        <div className="login-orb login-orb-two" />
        <div className="login-orb login-orb-three" />

        <span className="login-star star-one">
          ✦
        </span>

        <span className="login-star star-two">
          ✦
        </span>

        <span className="login-star star-three">
          ✦
        </span>

        <span className="login-star star-four">
          ✦
        </span>

        <span className="login-star star-five">
          ✦
        </span>

        <div className="login-ring ring-one" />
        <div className="login-ring ring-two" />

      </div>

      {/* =====================================================
          MAIN CONTAINER
          ===================================================== */}

      <div className="login-container">

        {/* ===================================================
            LEFT — 3D ROBOT
            =================================================== */}

        <section className="login-visual">

          <div className="robot-glow" />

          <div className="robot-orbit robot-orbit-one" />
          <div className="robot-orbit robot-orbit-two" />

          <div className="robot-wrapper">

            {/* Antenna */}

            <div className="robot-antenna">
              <span />
            </div>

            {/* Head */}

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

            {/* Neck */}

            <div className="robot-neck" />

            {/* Body */}

            <div className="robot-body">

              <div className="robot-chest">
                <span>IF</span>
              </div>

              <div className="robot-body-light" />

            </div>

            {/* Arms */}

            <div className="robot-arm robot-arm-left">
              <div className="robot-hand" />
            </div>

            <div className="robot-arm robot-arm-right">
              <div className="robot-hand" />
            </div>

            {/* Legs */}

            <div className="robot-leg robot-leg-left" />
            <div className="robot-leg robot-leg-right" />

          </div>

          {/* Robot status */}

          <div className="robot-message">
            <span className="robot-message-dot" />
            AI SYSTEM ONLINE
          </div>

          <div className="robot-caption">

            <strong>
              IncidentFlow AI
            </strong>

            <span>
              Intelligent incident operations
            </span>

          </div>

        </section>

        {/* ===================================================
            RIGHT — LOGIN / REGISTER
            =================================================== */}

        <section className="login-card">

          <div className="login-card-glow" />

          {/* =================================================
              BRAND
              ================================================= */}

          <div className="login-header">

            <div className="login-brand-row">

              <div className="login-brand-icon">
                ◈
              </div>

              <div>

                <div className="login-brand-name">
                  IncidentFlow{" "}
                  <span>AI</span>
                </div>

                <div className="login-brand-tagline">
                  INTELLIGENT INCIDENT OPERATIONS
                </div>

              </div>

            </div>

          </div>

          {/* =================================================
              LOGIN
              ================================================= */}

          {!isRegistering && (
            <>
              <div className="login-welcome">

                <h1>
                  Welcome back
                </h1>

                <p>
                  Sign in to continue to your
                  incident workspace.
                </p>

              </div>

              {/* External success message */}

              {successMessage && (
                <div className="login-success">
                  <span>✓</span>
                  {successMessage}
                </div>
              )}

              {/* Login error */}

              {(error || loginError) && (
                <div className="login-error">
                  <span>⚠</span>
                  {loginError || error}
                </div>
              )}

              {/* Login form */}

              <form
                className="login-form"
                onSubmit={handleLogin}
              >

                {/* Email */}

                <div className="login-field">

                  <label htmlFor="login-email">
                    Email address
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
                        setEmail(
                          event.target.value
                        )
                      }
                      placeholder="you@example.com"
                      autoComplete="email"
                    />

                    <div className="input-active-line" />

                  </div>

                </div>

                {/* Password */}

                <div className="login-field">

                  <label htmlFor="login-password">
                    Password
                  </label>

                  <div className="login-input-wrapper">

                    <div className="login-input-icon">
                      ◉
                    </div>

                    <input
                      id="login-password"
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      value={password}
                      onChange={(event) =>
                        setPassword(
                          event.target.value
                        )
                      }
                      placeholder="Enter your password"
                      autoComplete="current-password"
                    />

                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() =>
                        setShowPassword(
                          (current) =>
                            !current
                        )
                      }
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                    >
                      {showPassword
                        ? "◉"
                        : "○"}
                    </button>

                    <div className="input-active-line" />

                  </div>

                </div>

                {/* Submit */}

                <button
                  type="submit"
                  className="login-button"
                  disabled={loginLoading}
                >

                  <span className="login-button-text">
                    {loginLoading
                      ? "Authenticating..."
                      : "Sign in to workspace"}
                  </span>

                  <span className="login-button-arrow">
                    →
                  </span>

                </button>

              </form>

              {/* =================================================
                  DIVIDER
                  ================================================= */}

              <div className="login-divider">

                <span />
                <b>SECURE ACCESS</b>
                <span />

              </div>

              {/* =================================================
                  SECURITY
                  ================================================= */}

              <div className="login-security">

                <div className="security-item">

                  <span>🔐</span>

                  <div>
                    <strong>
                      JWT SECURITY
                    </strong>

                    <small>
                      Protected session
                    </small>
                  </div>

                </div>

                <div className="security-item">

                  <span>🛡️</span>

                  <div>
                    <strong>
                      SECURE API
                    </strong>

                    <small>
                      Encrypted communication
                    </small>
                  </div>

                </div>

              </div>

              {/* =================================================
                  SWITCH TO REGISTER
                  ================================================= */}

              <div className="login-mode-switch">

                <span>
                  Don't have an account?
                </span>

                <button
                  type="button"
                  className="login-mode-button"
                  onClick={openRegister}
                >
                  Create account
                </button>

              </div>

            </>
          )}

          {/* ===================================================
              REGISTER
              =================================================== */}

          {isRegistering && (
            <>
              <div className="login-welcome">

                <h1>
                  Create account
                </h1>

                <p>
                  Join IncidentFlow AI and
                  start managing incidents intelligently.
                </p>

              </div>

              {/* Register success */}

              {registerSuccess && (
                <div className="login-success">
                  <span>✓</span>
                  {registerSuccess}
                </div>
              )}

              {/* Register error */}

              {registerError && (
                <div className="login-error">
                  <span>⚠</span>
                  {registerError}
                </div>
              )}

              {/* Register form */}

              <form
                className="login-form"
                onSubmit={handleRegister}
              >

                {/* Name */}

                <div className="login-field">

                  <label htmlFor="register-name">
                    Full name
                  </label>

                  <div className="login-input-wrapper">

                    <div className="login-input-icon">
                      ◇
                    </div>

                    <input
                      id="register-name"
                      type="text"
                      value={registerName}
                      onChange={(event) =>
                        setRegisterName(
                          event.target.value
                        )
                      }
                      placeholder="Enter your full name"
                      autoComplete="name"
                    />

                    <div className="input-active-line" />

                  </div>

                </div>

                {/* Email */}

                <div className="login-field">

                  <label htmlFor="register-email">
                    Email address
                  </label>

                  <div className="login-input-wrapper">

                    <div className="login-input-icon">
                      ✉
                    </div>

                    <input
                      id="register-email"
                      type="email"
                      value={registerEmail}
                      onChange={(event) =>
                        setRegisterEmail(
                          event.target.value
                        )
                      }
                      placeholder="you@example.com"
                      autoComplete="email"
                    />

                    <div className="input-active-line" />

                  </div>

                </div>

                {/* Password */}

                <div className="login-field">

                  <label htmlFor="register-password">
                    Password
                  </label>

                  <div className="login-input-wrapper">

                    <div className="login-input-icon">
                      ◉
                    </div>

                    <input
                      id="register-password"
                      type={
                        showRegisterPassword
                          ? "text"
                          : "password"
                      }
                      value={registerPassword}
                      onChange={(event) =>
                        setRegisterPassword(
                          event.target.value
                        )
                      }
                      placeholder="Create a password"
                      autoComplete="new-password"
                    />

                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() =>
                        setShowRegisterPassword(
                          (current) =>
                            !current
                        )
                      }
                      aria-label={
                        showRegisterPassword
                          ? "Hide password"
                          : "Show password"
                      }
                    >
                      {showRegisterPassword
                        ? "◉"
                        : "○"}
                    </button>

                    <div className="input-active-line" />

                  </div>

                </div>

                {/* Confirm password */}

                <div className="login-field">

                  <label htmlFor="confirm-password">
                    Confirm password
                  </label>

                  <div className="login-input-wrapper">

                    <div className="login-input-icon">
                      ◉
                    </div>

                    <input
                      id="confirm-password"
                      type={
                        showConfirmPassword
                          ? "text"
                          : "password"
                      }
                      value={confirmPassword}
                      onChange={(event) =>
                        setConfirmPassword(
                          event.target.value
                        )
                      }
                      placeholder="Confirm your password"
                      autoComplete="new-password"
                    />

                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() =>
                        setShowConfirmPassword(
                          (current) =>
                            !current
                        )
                      }
                      aria-label={
                        showConfirmPassword
                          ? "Hide password"
                          : "Show password"
                      }
                    >
                      {showConfirmPassword
                        ? "◉"
                        : "○"}
                    </button>

                    <div className="input-active-line" />

                  </div>

                </div>

                {/* Role */}

                <div className="login-field">

                  <label htmlFor="register-role">
                    Role
                  </label>

                  <div className="login-input-wrapper">

                    <div className="login-input-icon">
                      ◈
                    </div>

                    <select
                      id="register-role"
                      value={registerRole}
                      onChange={(event) =>
                        setRegisterRole(
                          event.target.value as Role
                        )
                      }
                      style={{
                        width: "100%",
                        height: "100%",
                        border: "none",
                        outline: "none",
                        background: "transparent",
                        color: "#f8fafc",
                        padding: "0 14px 0 0",
                        fontSize: "13px",
                        cursor: "pointer",
                        appearance: "none",
                      }}
                    >

                      <option
                        value="SUPPORT_AGENT"
                        style={{
                          background: "#0b1428",
                          color: "#f8fafc",
                        }}
                      >
                        Support Agent
                      </option>

                      <option
                        value="DEVELOPER"
                        style={{
                          background: "#0b1428",
                          color: "#f8fafc",
                        }}
                      >
                        Developer
                      </option>

                      <option
                        value="MANAGER"
                        style={{
                          background: "#0b1428",
                          color: "#f8fafc",
                        }}
                      >
                        Manager
                      </option>

                      <option
                        value="ADMIN"
                        style={{
                          background: "#0b1428",
                          color: "#f8fafc",
                        }}
                      >
                        Admin
                      </option>

                      <option
                        value="CUSTOMER"
                        style={{
                          background: "#0b1428",
                          color: "#f8fafc",
                        }}
                      >
                        Customer
                      </option>

                    </select>

                    <div className="input-active-line" />

                  </div>

                </div>

                {/* Register button */}

                <button
                  type="submit"
                  className="login-button"
                  disabled={registerLoading}
                >

                  <span className="login-button-text">
                    {registerLoading
                      ? "Creating account..."
                      : "Create IncidentFlow account"}
                  </span>

                  <span className="login-button-arrow">
                    →
                  </span>

                </button>

              </form>

              {/* =================================================
                  DIVIDER
                  ================================================= */}

              <div className="login-divider">

                <span />
                <b>SECURE REGISTRATION</b>
                <span />

              </div>

              {/* =================================================
                  SECURITY
                  ================================================= */}

              <div className="login-security">

                <div className="security-item">

                  <span>🔐</span>

                  <div>
                    <strong>
                      SECURE ACCOUNT
                    </strong>

                    <small>
                      Protected credentials
                    </small>
                  </div>

                </div>

                <div className="security-item">

                  <span>🤖</span>

                  <div>
                    <strong>
                      AI WORKSPACE
                    </strong>

                    <small>
                      Intelligent operations
                    </small>
                  </div>

                </div>

              </div>

              {/* =================================================
                  SWITCH TO LOGIN
                  ================================================= */}

              <div className="login-mode-switch">

                <span>
                  Already have an account?
                </span>

                <button
                  type="button"
                  className="login-mode-button"
                  onClick={openLogin}
                >
                  Sign in
                </button>

              </div>

            </>
          )}

          {/* ===================================================
              FOOTER
              =================================================== */}

          <div className="login-footer">

            <span className="footer-dot" />

            <span>
              IncidentFlow AI • Secure Operations Platform
            </span>

          </div>

        </section>

      </div>

    </div>
  );
}

export default Login;