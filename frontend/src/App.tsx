import { useEffect, useState } from "react";
import "./App.css";

import {
  getDashboardStatistics,
  type DashboardResponse,
} from "./services/api";

import { loginUser } from "./services/authApi";

import Sidebar from "./components/Sidebar";
import IncidentList from "./components/IncidentList";
import Dashboard from "./components/Dashboard";
import AIInsights from "./components/AIInsights";
import Reports from "./components/Reports";
import Settings from "./components/Settings";
import Login from "./components/Login";

function App() {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );

  const [activePage, setActivePage] = useState("Dashboard");

  const [, setLoading] = useState(false);
  const [dashboardLoading, setDashboardLoading] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [dashboard, setDashboard] =
    useState<DashboardResponse | null>(null);

  const [userName, setUserName] = useState("Ashlesa");

  const loadDashboard = async (authToken: string) => {
    try {
      setDashboardLoading(true);
      setError("");

      const data = await getDashboardStatistics(authToken);

      setDashboard(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load dashboard."
      );
    } finally {
      setDashboardLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadDashboard(token);
    }
  }, [token]);

  // =========================
  // LOGIN
  // =========================

  const handleLogin = async (
    email: string,
    password: string
  ) => {
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const data = await loginUser({
        email,
        password,
      });

      localStorage.setItem("token", data.token);

      setToken(data.token);

      setUserName(
        email
          .split("@")[0]
          .replace(".", " ")
          .replace(/\b\w/g, (char) =>
            char.toUpperCase()
          )
      );

      setMessage("Login successful.");
      setActivePage("Dashboard");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Login failed. Please check your credentials."
      );

      throw err;
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // LOGOUT
  // =========================

  const handleLogout = () => {
    localStorage.removeItem("token");

    setToken(null);
    setDashboard(null);
    setActivePage("Dashboard");

    setMessage("You have been logged out successfully.");
    setError("");
  };

  // =========================
  // NAVIGATION
  // =========================

  const handleNavigation = (page: string) => {
    setActivePage(page);
    setError("");
    setMessage("");
  };

  // =========================
  // LOGIN SCREEN
  // =========================

  if (!token) {
    return (
      <Login
        onLogin={handleLogin}
        error={error}
        successMessage={message}
      />
    );
  }

  // =========================
  // MAIN APPLICATION
  // =========================

  return (
    <div className="app-shell">
      <Sidebar
        activePage={activePage}
        onNavigate={handleNavigation}
        onLogout={handleLogout}
      />

      <main className="main-content">

        {/* =========================
            INCIDENTS
           ========================= */}

        {activePage === "Incidents" && (
          <IncidentList />
        )}

        {/* =========================
            DASHBOARD
           ========================= */}

        {activePage === "Dashboard" && (
          <Dashboard
            dashboard={dashboard}
            loading={dashboardLoading}
            onRefresh={() =>
              token && loadDashboard(token)
            }
            onOpenAI={() =>
              handleNavigation("AI Insights")
            }
            onOpenIncidents={() =>
              handleNavigation("Incidents")
            }
          />
        )}

        {/* =========================
            OTHER APPLICATION PAGES
           ========================= */}

        {activePage !== "Dashboard" &&
          activePage !== "Incidents" && (
            <>
              <div className="topbar">
                <div className="topbar-left">

                  <div className="breadcrumb">
                    WORKSPACE / {activePage.toUpperCase()}
                  </div>

                  <h1>
                    Good morning, {userName} 👋
                  </h1>

                  <p>
                    Here's an overview of your incident
                    management activity.
                  </p>

                </div>

                <div className="topbar-actions">

                  <button className="notification-button">
                    <span className="notification-dot"></span>
                    ◌
                  </button>

                  <div className="topbar-avatar">
                    A
                  </div>

                </div>
              </div>

              {message && (
                <div className="success-message dashboard-message">
                  ✓ {message}
                </div>
              )}

              {error && (
                <div className="error-message dashboard-message">
                  {error}
                </div>
              )}

              {/* =========================
                  ANALYTICS
                 ========================= */}

              {activePage === "Analytics" && (
                <>
                  {(() => {
                    const total =
                      dashboard?.totalIncidents ?? 0;

                    const active =
                      (dashboard?.openIncidents ?? 0) +
                      (dashboard?.inProgressIncidents ?? 0);

                    const resolved =
                      (dashboard?.resolvedIncidents ?? 0) +
                      (dashboard?.closedIncidents ?? 0);

                    const resolutionRate =
                      total > 0
                        ? Math.round(
                            (resolved / total) * 100
                          )
                        : 0;

                    const openRate =
                      total > 0
                        ? Math.round(
                            ((dashboard?.openIncidents ?? 0) /
                              total) *
                              100
                          )
                        : 0;

                    const inProgressRate =
                      total > 0
                        ? Math.round(
                            ((dashboard?.inProgressIncidents ??
                              0) /
                              total) *
                              100
                          )
                        : 0;

                    const resolvedRate =
                      total > 0
                        ? Math.round(
                            ((dashboard?.resolvedIncidents ??
                              0) /
                              total) *
                              100
                          )
                        : 0;

                    const closedRate =
                      total > 0
                        ? Math.round(
                            ((dashboard?.closedIncidents ?? 0) /
                              total) *
                              100
                          )
                        : 0;

                    const criticalRate =
                      total > 0
                        ? Math.round(
                            ((dashboard?.criticalIncidents ??
                              0) /
                              total) *
                              100
                          )
                        : 0;

                    const highRate =
                      total > 0
                        ? Math.round(
                            ((dashboard?.highIncidents ?? 0) /
                              total) *
                              100
                          )
                        : 0;

                    const mediumRate =
                      total > 0
                        ? Math.round(
                            ((dashboard?.mediumIncidents ??
                              0) /
                              total) *
                              100
                          )
                        : 0;

                    const lowRate =
                      total > 0
                        ? Math.round(
                            ((dashboard?.lowIncidents ?? 0) /
                              total) *
                              100
                          )
                        : 0;

                    return (
                      <>
                        <div className="dashboard-header">
                          <div>

                            <div className="breadcrumb">
                              WORKSPACE / ANALYTICS
                            </div>

                            <h2>
                              Incident Analytics
                            </h2>

                            <p>
                              Explore incident patterns,
                              workload distribution and
                              resolution performance.
                            </p>

                          </div>

                          <button
                            className="load-dashboard-button"
                            onClick={() =>
                              token &&
                              loadDashboard(token)
                            }
                            disabled={dashboardLoading}
                          >
                            {dashboardLoading
                              ? "Refreshing..."
                              : "Refresh analytics ↻"}
                          </button>

                        </div>

                        {dashboardLoading && !dashboard ? (
                          <div className="dashboard-empty-state">

                            <div className="dashboard-empty-icon">
                              ◈
                            </div>

                            <h3>
                              Loading analytics...
                            </h3>

                            <p>
                              Fetching the latest incident
                              statistics.
                            </p>

                          </div>
                        ) : dashboard ? (
                          <>
                            {/* ANALYTICS HEALTH OVERVIEW */}

                            <div
                              style={{
                                display: "grid",
                                gridTemplateColumns:
                                  "repeat(3, minmax(0, 1fr))",
                                gap: "18px",
                                marginBottom: "24px",
                              }}
                            >

                              <div className="dashboard-panel">

                                <div className="panel-header">
                                  <div>
                                    <h3>
                                      Incident Health
                                    </h3>

                                    <p>
                                      Current workload across
                                      the system
                                    </p>
                                  </div>
                                </div>

                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "flex-end",
                                    gap: "12px",
                                    marginTop: "20px",
                                  }}
                                >

                                  <strong
                                    style={{
                                      fontSize: "42px",
                                      lineHeight: 1,
                                    }}
                                  >
                                    {active}
                                  </strong>

                                  <span
                                    style={{
                                      fontSize: "13px",
                                      marginBottom: "5px",
                                      opacity: 0.65,
                                    }}
                                  >
                                    active incidents
                                  </span>

                                </div>

                                <p
                                  style={{
                                    marginTop: "12px",
                                    fontSize: "13px",
                                    opacity: 0.65,
                                  }}
                                >
                                  {resolutionRate}% of
                                  all incidents are
                                  resolved or closed.
                                </p>

                              </div>

                              <div className="dashboard-panel">

                                <div className="panel-header">
                                  <div>
                                    <h3>
                                      Resolution Rate
                                    </h3>

                                    <p>
                                      Resolved and closed
                                      incidents
                                    </p>
                                  </div>
                                </div>

                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "flex-end",
                                    gap: "8px",
                                    marginTop: "20px",
                                  }}
                                >

                                  <strong
                                    style={{
                                      fontSize: "42px",
                                      lineHeight: 1,
                                    }}
                                  >
                                    {resolutionRate}%
                                  </strong>

                                </div>

                                <div
                                  style={{
                                    marginTop: "18px",
                                    height: "8px",
                                    borderRadius: "999px",
                                    background:
                                      "rgba(255,255,255,0.08)",
                                    overflow: "hidden",
                                  }}
                                >

                                  <div
                                    style={{
                                      width: `${resolutionRate}%`,
                                      height: "100%",
                                      borderRadius: "999px",
                                      background:
                                        "linear-gradient(90deg, #7c5cff, #a78bfa)",
                                    }}
                                  />

                                </div>

                              </div>

                              <div className="dashboard-panel">

                                <div className="panel-header">
                                  <div>
                                    <h3>
                                      Active Workload
                                    </h3>

                                    <p>
                                      Incidents requiring
                                      attention
                                    </p>
                                  </div>
                                </div>

                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "flex-end",
                                    gap: "8px",
                                    marginTop: "20px",
                                  }}
                                >

                                  <strong
                                    style={{
                                      fontSize: "42px",
                                      lineHeight: 1,
                                    }}
                                  >
                                    {active}
                                  </strong>

                                  <span
                                    style={{
                                      fontSize: "13px",
                                      marginBottom: "5px",
                                      opacity: 0.65,
                                    }}
                                  >
                                    / {total} total
                                  </span>

                                </div>

                                <p
                                  style={{
                                    marginTop: "12px",
                                    fontSize: "13px",
                                    opacity: 0.65,
                                  }}
                                >
                                  {total > 0
                                    ? Math.round(
                                        (active /
                                          total) *
                                          100
                                      )
                                    : 0}
                                  % of current incidents
                                  remain active.
                                </p>

                              </div>

                            </div>

                            {/* STATUS ANALYSIS */}

                            <div
                              className="dashboard-panel"
                              style={{
                                marginBottom: "24px",
                              }}
                            >

                              <div className="panel-header">
                                <div>
                                  <h3>
                                    Status Analysis
                                  </h3>

                                  <p>
                                    How incidents are
                                    distributed across
                                    their lifecycle
                                  </p>
                                </div>
                              </div>

                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: "20px",
                                  marginTop: "22px",
                                }}
                              >

                                <div>
                                  <div
                                    style={{
                                      display: "flex",
                                      justifyContent:
                                        "space-between",
                                      marginBottom: "8px",
                                      fontSize: "14px",
                                    }}
                                  >
                                    <span>
                                      Open
                                    </span>

                                    <strong>
                                      {
                                        dashboard.openIncidents
                                      }{" "}
                                      ({openRate}%)
                                    </strong>
                                  </div>

                                  <div
                                    style={{
                                      height: "10px",
                                      borderRadius: "999px",
                                      background:
                                        "rgba(255,255,255,0.07)",
                                      overflow: "hidden",
                                    }}
                                  >

                                    <div
                                      style={{
                                        width: `${openRate}%`,
                                        height: "100%",
                                        borderRadius: "999px",
                                        background:
                                          "#60a5fa",
                                      }}
                                    />

                                  </div>
                                </div>

                                <div>
                                  <div
                                    style={{
                                      display: "flex",
                                      justifyContent:
                                        "space-between",
                                      marginBottom: "8px",
                                      fontSize: "14px",
                                    }}
                                  >
                                    <span>
                                      In Progress
                                    </span>

                                    <strong>
                                      {
                                        dashboard.inProgressIncidents
                                      }{" "}
                                      ({inProgressRate}%)
                                    </strong>
                                  </div>

                                  <div
                                    style={{
                                      height: "10px",
                                      borderRadius: "999px",
                                      background:
                                        "rgba(255,255,255,0.07)",
                                      overflow: "hidden",
                                    }}
                                  >

                                    <div
                                      style={{
                                        width: `${inProgressRate}%`,
                                        height: "100%",
                                        borderRadius: "999px",
                                        background:
                                          "#a78bfa",
                                      }}
                                    />

                                  </div>
                                </div>

                                <div>
                                  <div
                                    style={{
                                      display: "flex",
                                      justifyContent:
                                        "space-between",
                                      marginBottom: "8px",
                                      fontSize: "14px",
                                    }}
                                  >
                                    <span>
                                      Resolved
                                    </span>

                                    <strong>
                                      {
                                        dashboard.resolvedIncidents
                                      }{" "}
                                      ({resolvedRate}%)
                                    </strong>
                                  </div>

                                  <div
                                    style={{
                                      height: "10px",
                                      borderRadius: "999px",
                                      background:
                                        "rgba(255,255,255,0.07)",
                                      overflow: "hidden",
                                    }}
                                  >

                                    <div
                                      style={{
                                        width: `${resolvedRate}%`,
                                        height: "100%",
                                        borderRadius: "999px",
                                        background:
                                          "#34d399",
                                      }}
                                    />

                                  </div>
                                </div>

                                <div>
                                  <div
                                    style={{
                                      display: "flex",
                                      justifyContent:
                                        "space-between",
                                      marginBottom: "8px",
                                      fontSize: "14px",
                                    }}
                                  >
                                    <span>
                                      Closed
                                    </span>

                                    <strong>
                                      {
                                        dashboard.closedIncidents
                                      }{" "}
                                      ({closedRate}%)
                                    </strong>
                                  </div>

                                  <div
                                    style={{
                                      height: "10px",
                                      borderRadius: "999px",
                                      background:
                                        "rgba(255,255,255,0.07)",
                                      overflow: "hidden",
                                    }}
                                  >

                                    <div
                                      style={{
                                        width: `${closedRate}%`,
                                        height: "100%",
                                        borderRadius: "999px",
                                        background:
                                          "#94a3b8",
                                      }}
                                    />

                                  </div>
                                </div>

                              </div>

                            </div>

                            {/* SEVERITY ANALYSIS */}

                            <div
                              className="dashboard-panel"
                              style={{
                                marginBottom: "24px",
                              }}
                            >

                              <div className="panel-header">
                                <div>
                                  <h3>
                                    Severity Analysis
                                  </h3>

                                  <p>
                                    Understand the
                                    distribution of
                                    incident priority
                                  </p>
                                </div>
                              </div>

                              <div
                                style={{
                                  display: "grid",
                                  gridTemplateColumns:
                                    "repeat(2, minmax(0, 1fr))",
                                  gap: "22px 40px",
                                  marginTop: "22px",
                                }}
                              >

                                <div>
                                  <div
                                    style={{
                                      display: "flex",
                                      justifyContent:
                                        "space-between",
                                      marginBottom: "8px",
                                      fontSize: "14px",
                                    }}
                                  >
                                    <span>
                                      Critical
                                    </span>

                                    <strong>
                                      {
                                        dashboard.criticalIncidents
                                      }{" "}
                                      ({criticalRate}%)
                                    </strong>
                                  </div>

                                  <div
                                    style={{
                                      height: "10px",
                                      borderRadius: "999px",
                                      background:
                                        "rgba(255,255,255,0.07)",
                                      overflow: "hidden",
                                    }}
                                  >

                                    <div
                                      style={{
                                        width: `${criticalRate}%`,
                                        height: "100%",
                                        borderRadius: "999px",
                                        background:
                                          "#ef4444",
                                      }}
                                    />

                                  </div>
                                </div>

                                <div>
                                  <div
                                    style={{
                                      display: "flex",
                                      justifyContent:
                                        "space-between",
                                      marginBottom: "8px",
                                      fontSize: "14px",
                                    }}
                                  >
                                    <span>
                                      High
                                    </span>

                                    <strong>
                                      {
                                        dashboard.highIncidents
                                      }{" "}
                                      ({highRate}%)
                                    </strong>
                                  </div>

                                  <div
                                    style={{
                                      height: "10px",
                                      borderRadius: "999px",
                                      background:
                                        "rgba(255,255,255,0.07)",
                                      overflow: "hidden",
                                    }}
                                  >

                                    <div
                                      style={{
                                        width: `${highRate}%`,
                                        height: "100%",
                                        borderRadius: "999px",
                                        background:
                                          "#f97316",
                                      }}
                                    />

                                  </div>
                                </div>

                                <div>
                                  <div
                                    style={{
                                      display: "flex",
                                      justifyContent:
                                        "space-between",
                                      marginBottom: "8px",
                                      fontSize: "14px",
                                    }}
                                  >
                                    <span>
                                      Medium
                                    </span>

                                    <strong>
                                      {
                                        dashboard.mediumIncidents
                                      }{" "}
                                      ({mediumRate}%)
                                    </strong>
                                  </div>

                                  <div
                                    style={{
                                      height: "10px",
                                      borderRadius: "999px",
                                      background:
                                        "rgba(255,255,255,0.07)",
                                      overflow: "hidden",
                                    }}
                                  >

                                    <div
                                      style={{
                                        width: `${mediumRate}%`,
                                        height: "100%",
                                        borderRadius: "999px",
                                        background:
                                          "#f59e0b",
                                      }}
                                    />

                                  </div>
                                </div>

                                <div>
                                  <div
                                    style={{
                                      display: "flex",
                                      justifyContent:
                                        "space-between",
                                      marginBottom: "8px",
                                      fontSize: "14px",
                                    }}
                                  >
                                    <span>
                                      Low
                                    </span>

                                    <strong>
                                      {
                                        dashboard.lowIncidents
                                      }{" "}
                                      ({lowRate}%)
                                    </strong>
                                  </div>

                                  <div
                                    style={{
                                      height: "10px",
                                      borderRadius: "999px",
                                      background:
                                        "rgba(255,255,255,0.07)",
                                      overflow: "hidden",
                                    }}
                                  >

                                    <div
                                      style={{
                                        width: `${lowRate}%`,
                                        height: "100%",
                                        borderRadius: "999px",
                                        background:
                                          "#22c55e",
                                      }}
                                    />

                                  </div>
                                </div>

                              </div>

                            </div>

                            {/* OPERATIONAL SIGNALS */}

                            <div className="dashboard-panel">

                              <div className="panel-header">
                                <div>
                                  <h3>
                                    Operational Signals
                                  </h3>

                                  <p>
                                    Automatically
                                    calculated from
                                    current incident
                                    data
                                  </p>
                                </div>
                              </div>

                              <div
                                style={{
                                  display: "grid",
                                  gridTemplateColumns:
                                    "repeat(3, minmax(0, 1fr))",
                                  gap: "16px",
                                  marginTop: "22px",
                                }}
                              >

                                <div
                                  style={{
                                    padding: "18px",
                                    borderRadius: "12px",
                                    background:
                                      "rgba(255,255,255,0.035)",
                                    border:
                                      "1px solid rgba(255,255,255,0.06)",
                                  }}
                                >
                                  <span
                                    style={{
                                      fontSize: "12px",
                                      opacity: 0.6,
                                    }}
                                  >
                                    TOTAL INCIDENTS
                                  </span>

                                  <strong
                                    style={{
                                      display: "block",
                                      fontSize: "28px",
                                      marginTop: "8px",
                                    }}
                                  >
                                    {total}
                                  </strong>
                                </div>

                                <div
                                  style={{
                                    padding: "18px",
                                    borderRadius: "12px",
                                    background:
                                      "rgba(255,255,255,0.035)",
                                    border:
                                      "1px solid rgba(255,255,255,0.06)",
                                  }}
                                >
                                  <span
                                    style={{
                                      fontSize: "12px",
                                      opacity: 0.6,
                                    }}
                                  >
                                    ACTIVE
                                  </span>

                                  <strong
                                    style={{
                                      display: "block",
                                      fontSize: "28px",
                                      marginTop: "8px",
                                    }}
                                  >
                                    {active}
                                  </strong>
                                </div>

                                <div
                                  style={{
                                    padding: "18px",
                                    borderRadius: "12px",
                                    background:
                                      "rgba(255,255,255,0.035)",
                                    border:
                                      "1px solid rgba(255,255,255,0.06)",
                                  }}
                                >
                                  <span
                                    style={{
                                      fontSize: "12px",
                                      opacity: 0.6,
                                    }}
                                  >
                                    RESOLUTION
                                  </span>

                                  <strong
                                    style={{
                                      display: "block",
                                      fontSize: "28px",
                                      marginTop: "8px",
                                    }}
                                  >
                                    {resolutionRate}%
                                  </strong>
                                </div>

                              </div>

                            </div>
                          </>
                        ) : (
                          <div className="dashboard-empty-state">

                            <div className="dashboard-empty-icon">
                              ◈
                            </div>

                            <h3>
                              Analytics data unavailable
                            </h3>

                            <p>
                              We couldn't load your
                              incident analytics.
                            </p>

                            <button
                              className="load-dashboard-button"
                              onClick={() =>
                                token &&
                                loadDashboard(token)
                              }
                            >
                              Load Analytics
                            </button>

                          </div>
                        )}
                      </>
                    );
                  })()}
                </>
              )}

              {/* =========================
                  AI INSIGHTS
                 ========================= */}

              {activePage === "AI Insights" && (
                <AIInsights />
              )}

              {/* =========================
                  REPORTS
                 ========================= */}

              {activePage === "Reports" && (
                <Reports
                  dashboard={dashboard}
                  loading={dashboardLoading}
                  onRefresh={() =>
                    token && loadDashboard(token)
                  }
                />
              )}

              {/* =========================
                  SETTINGS
                 ========================= */}

              {activePage === "Settings" && (
                <Settings />
              )}
            </>
          )}
      </main>
    </div>
  );
}

export default App;