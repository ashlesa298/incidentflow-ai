import type { DashboardResponse } from "../services/api";

interface ReportsProps {
  dashboard: DashboardResponse | null;
  loading?: boolean;
  onRefresh?: () => void;
}

function Reports({
  dashboard,
  loading = false,
  onRefresh,
}: ReportsProps) {
  const total = dashboard?.totalIncidents ?? 0;
  const open = dashboard?.openIncidents ?? 0;
  const inProgress = dashboard?.inProgressIncidents ?? 0;
  const resolved = dashboard?.resolvedIncidents ?? 0;
  const closed = dashboard?.closedIncidents ?? 0;

  const active = open + inProgress;
  const completed = resolved + closed;

  const resolutionRate =
    total > 0 ? Math.round((completed / total) * 100) : 0;

  const critical = dashboard?.criticalIncidents ?? 0;
  const high = dashboard?.highIncidents ?? 0;
  const medium = dashboard?.mediumIncidents ?? 0;
  const low = dashboard?.lowIncidents ?? 0;

  const exportReport = () => {
    const rows = [
      ["IncidentFlow AI - Incident Operations Report"],
      ["Generated", new Date().toLocaleString()],
      [],
      ["Metric", "Value"],
      ["Total Incidents", String(total)],
      ["Open Incidents", String(open)],
      ["In Progress", String(inProgress)],
      ["Resolved", String(resolved)],
      ["Closed", String(closed)],
      ["Critical", String(critical)],
      ["High", String(high)],
      ["Medium", String(medium)],
      ["Low", String(low)],
      ["Resolution Rate", `${resolutionRate}%`],
    ];

    const csv = rows
      .map((row) =>
        row
          .map((value) => {
            const safeValue = value ?? "";
            return `"${safeValue.replace(/"/g, '""')}"`;
          })
          .join(","),
      )
      .join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");

    anchor.href = url;
    anchor.download = `incidentflow-report-${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;

    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();

    URL.revokeObjectURL(url);
  };

  const printReport = () => {
    window.print();
  };

  return (
    <div className="reports-page">
      <style>{`
        .reports-page {
          position: relative;
          min-height: calc(100vh - 150px);
          color: #f5f7ff;
          overflow: hidden;
          isolation: isolate;
        }

        .reports-page::before,
        .reports-page::after {
          content: "";
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          z-index: -1;
          filter: blur(70px);
        }

        .reports-page::before {
          width: 360px;
          height: 360px;
          top: -130px;
          right: 12%;
          background: rgba(112, 76, 255, 0.11);
          animation: reportsFloatOne 8s ease-in-out infinite;
        }

        .reports-page::after {
          width: 300px;
          height: 300px;
          bottom: -100px;
          left: 10%;
          background: rgba(53, 139, 255, 0.08);
          animation: reportsFloatTwo 10s ease-in-out infinite;
        }

        .reports-hero {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          padding: 25px 28px;
          margin-bottom: 18px;
          overflow: hidden;
          border: 1px solid rgba(143, 112, 255, 0.24);
          border-radius: 22px;
          background:
            linear-gradient(
              135deg,
              rgba(27, 21, 53, 0.91),
              rgba(9, 13, 28, 0.94)
            );
          box-shadow:
            0 25px 70px rgba(0, 0, 0, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.06);
          backdrop-filter: blur(20px);
        }

        .reports-hero::after {
          content: "";
          position: absolute;
          width: 420px;
          height: 1px;
          top: 50%;
          left: 34%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(154, 123, 255, 0.35),
            transparent
          );
          transform: rotate(-8deg);
          animation: reportsScan 5s linear infinite;
        }

        .reports-hero-left {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          gap: 17px;
        }

        .reports-robot {
          position: relative;
          width: 64px;
          height: 64px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(157, 125, 255, 0.45);
          border-radius: 18px;
          background:
            radial-gradient(
              circle at 35% 25%,
              rgba(255, 255, 255, 0.16),
              rgba(115, 76, 255, 0.18) 38%,
              rgba(30, 18, 70, 0.55)
            );
          box-shadow:
            0 0 25px rgba(118, 79, 255, 0.25),
            inset 0 1px 0 rgba(255, 255, 255, 0.12);
          transform-style: preserve-3d;
          animation: reportsRobotFloat 3.8s ease-in-out infinite;
        }

        .reports-robot::before {
          content: "";
          position: absolute;
          inset: -8px;
          border: 1px solid rgba(119, 156, 255, 0.22);
          border-radius: 22px;
          transform: rotate(12deg);
          animation: reportsRobotOrbit 5s linear infinite;
        }

        .reports-robot-emoji {
          position: relative;
          z-index: 2;
          font-size: 32px;
          filter:
            drop-shadow(0 0 8px rgba(140, 105, 255, 0.75))
            drop-shadow(0 0 18px rgba(88, 145, 255, 0.3));
          animation: reportsRobotPulse 2.5s ease-in-out infinite;
        }

        .reports-eyebrow {
          margin: 0 0 5px;
          color: #8e72ff;
          font-size: 9px;
          font-weight: 850;
          letter-spacing: 1.8px;
          text-transform: uppercase;
        }

        .reports-title {
          margin: 0;
          font-size: clamp(24px, 3vw, 34px);
          font-weight: 850;
          letter-spacing: -1px;
          background:
            linear-gradient(
              100deg,
              #ffffff,
              #c9b9ff 48%,
              #8ecbff
            );
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .reports-subtitle {
          margin: 7px 0 0;
          color: #7d879e;
          font-size: 12px;
          line-height: 1.6;
        }

        .reports-actions {
          position: relative;
          z-index: 3;
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .reports-action {
          padding: 10px 13px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 10px;
          color: #aeb6ca;
          background: rgba(255, 255, 255, 0.035);
          cursor: pointer;
          font-size: 10px;
          font-weight: 750;
          transition: 0.25s ease;
        }

        .reports-action.primary {
          border-color: rgba(137, 101, 255, 0.45);
          color: #f3efff;
          background:
            linear-gradient(
              135deg,
              rgba(121, 82, 255, 0.25),
              rgba(65, 120, 255, 0.11)
            );
          box-shadow: 0 8px 25px rgba(79, 52, 178, 0.16);
        }

        .reports-action:hover {
          color: #ffffff;
          border-color: rgba(157, 126, 255, 0.55);
          transform: translateY(-2px);
          box-shadow: 0 12px 25px rgba(55, 39, 128, 0.18);
        }

        .reports-kpi-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 14px;
          margin-bottom: 18px;
        }

        .reports-kpi {
          position: relative;
          min-height: 142px;
          padding: 18px;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 17px;
          background:
            linear-gradient(
              145deg,
              rgba(22, 22, 43, 0.88),
              rgba(9, 12, 23, 0.92)
            );
          box-shadow:
            0 18px 45px rgba(0, 0, 0, 0.22),
            inset 0 1px 0 rgba(255, 255, 255, 0.045);
          transform-style: preserve-3d;
          transition: 0.3s ease;
        }

        .reports-kpi:hover {
          transform: translateY(-4px) rotateX(1.5deg);
          border-color: rgba(131, 101, 255, 0.27);
          box-shadow:
            0 25px 55px rgba(0, 0, 0, 0.28),
            0 0 30px rgba(91, 63, 190, 0.08);
        }

        .reports-kpi::before {
          content: "";
          position: absolute;
          width: 100px;
          height: 100px;
          top: -50px;
          right: -30px;
          border-radius: 50%;
          background: rgba(121, 86, 255, 0.11);
          filter: blur(10px);
        }

        .reports-kpi-icon {
          width: 32px;
          height: 32px;
          display: grid;
          place-items: center;
          margin-bottom: 15px;
          border: 1px solid rgba(137, 105, 255, 0.22);
          border-radius: 9px;
          color: #ad9bff;
          background: rgba(119, 81, 255, 0.08);
          font-size: 15px;
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.06);
        }

        .reports-kpi-label {
          color: #717b92;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        .reports-kpi-value {
          display: block;
          margin-top: 4px;
          font-size: 27px;
          line-height: 1.1;
          font-weight: 850;
          color: #f4f5ff;
        }

        .reports-kpi-note {
          display: block;
          margin-top: 7px;
          color: #687188;
          font-size: 9px;
        }

        .reports-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.4fr) minmax(280px, 0.8fr);
          gap: 18px;
        }

        .reports-panel {
          position: relative;
          overflow: hidden;
          padding: 20px;
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 18px;
          background:
            linear-gradient(
              145deg,
              rgba(19, 20, 39, 0.91),
              rgba(8, 11, 21, 0.94)
            );
          box-shadow:
            0 20px 55px rgba(0, 0, 0, 0.23),
            inset 0 1px 0 rgba(255, 255, 255, 0.04);
        }

        .reports-panel::after {
          content: "";
          position: absolute;
          width: 180px;
          height: 180px;
          right: -90px;
          bottom: -100px;
          border-radius: 50%;
          background: rgba(91, 63, 190, 0.09);
          filter: blur(28px);
          pointer-events: none;
        }

        .reports-panel-header {
          display: flex;
          justify-content: space-between;
          gap: 15px;
          margin-bottom: 18px;
        }

        .reports-panel-title {
          margin: 0;
          color: #e9ebf7;
          font-size: 13px;
          font-weight: 800;
        }

        .reports-panel-description {
          margin: 5px 0 0;
          color: #687289;
          font-size: 9px;
        }

        .reports-progress {
          height: 12px;
          overflow: hidden;
          border-radius: 999px;
          background: rgba(255,255,255,0.055);
          box-shadow: inset 0 1px 3px rgba(0,0,0,0.4);
        }

        .reports-progress-fill {
          height: 100%;
          border-radius: inherit;
          background:
            linear-gradient(
              90deg,
              #7650ff,
              #9e80ff,
              #66b8ff
            );
          box-shadow: 0 0 18px rgba(122, 83, 255, 0.35);
          transition: width 0.8s ease;
        }

        .reports-status-list {
          display: flex;
          flex-direction: column;
          gap: 15px;
          margin-top: 22px;
        }

        .reports-status-row {
          display: grid;
          grid-template-columns: 115px 1fr 35px;
          align-items: center;
          gap: 10px;
          color: #9ca5b9;
          font-size: 10px;
        }

        .reports-status-name {
          display: flex;
          align-items: center;
          gap: 7px;
        }

        .reports-status-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #8061ff;
          box-shadow: 0 0 8px rgba(128, 97, 255, 0.65);
        }

        .reports-status-number {
          color: #eef0fa;
          font-weight: 800;
          text-align: right;
        }

        .reports-summary-orb {
          position: relative;
          width: 150px;
          height: 150px;
          margin: 5px auto 20px;
          display: grid;
          place-items: center;
        }

        .reports-summary-orb::before {
          content: "";
          position: absolute;
          inset: 15px;
          border-radius: 50%;
          background:
            conic-gradient(
              #825cff ${Math.max(resolutionRate, 1)}%,
              rgba(255,255,255,0.055) 0
            );
          -webkit-mask:
            radial-gradient(
              farthest-side,
              transparent calc(100% - 11px),
              #000 calc(100% - 10px)
            );
          mask:
            radial-gradient(
              farthest-side,
              transparent calc(100% - 11px),
              #000 calc(100% - 10px)
            );
          filter: drop-shadow(0 0 9px rgba(126, 87, 255, 0.4));
          animation: reportsRingSpin 8s linear infinite;
        }

        .reports-summary-orb::after {
          content: "";
          position: absolute;
          width: 92px;
          height: 92px;
          border-radius: 50%;
          background:
            radial-gradient(
              circle at 32% 25%,
              #d8ccff,
              #6840d7 34%,
              #160c3b 72%,
              #070611
            );
          box-shadow:
            0 0 30px rgba(113, 75, 255, 0.32),
            inset -10px -12px 20px rgba(0,0,0,0.45);
          animation: reportsOrbFloat 3.5s ease-in-out infinite;
        }

        .reports-summary-value {
          position: relative;
          z-index: 2;
          font-size: 25px;
          font-weight: 900;
          color: #ffffff;
          text-shadow: 0 0 18px rgba(160, 129, 255, 0.6);
        }

        .reports-breakdown {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 9px;
          margin-top: 14px;
        }

        .reports-breakdown-item {
          padding: 11px;
          border: 1px solid rgba(255,255,255,0.055);
          border-radius: 10px;
          background: rgba(255,255,255,0.025);
        }

        .reports-breakdown-item span {
          display: block;
          color: #697287;
          font-size: 8px;
          text-transform: uppercase;
          letter-spacing: 0.7px;
        }

        .reports-breakdown-item strong {
          display: block;
          margin-top: 5px;
          color: #eef0fb;
          font-size: 17px;
        }

        .reports-loading {
          display: grid;
          place-items: center;
          min-height: 300px;
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 18px;
          background: rgba(10, 12, 24, 0.65);
        }

        .reports-loading-inner {
          text-align: center;
          color: #737d94;
          font-size: 11px;
        }

        .reports-loading-orb {
          width: 54px;
          height: 54px;
          margin: 0 auto 15px;
          border: 2px solid rgba(127, 89, 255, 0.2);
          border-top-color: #8660ff;
          border-radius: 50%;
          animation: reportsLoadingSpin 1s linear infinite;
          box-shadow: 0 0 25px rgba(115, 78, 255, 0.22);
        }

        @keyframes reportsFloatOne {
          0%, 100% { transform: translate3d(0,0,0); }
          50% { transform: translate3d(-35px,28px,0); }
        }

        @keyframes reportsFloatTwo {
          0%, 100% { transform: translate3d(0,0,0); }
          50% { transform: translate3d(28px,-25px,0); }
        }

        @keyframes reportsScan {
          0% { transform: translateX(-120%) rotate(-8deg); }
          100% { transform: translateX(420%) rotate(-8deg); }
        }

        @keyframes reportsRobotFloat {
          0%, 100% { transform: translateY(0) rotateX(0deg); }
          50% { transform: translateY(-7px) rotateX(4deg); }
        }

        @keyframes reportsRobotOrbit {
          from { transform: rotate(12deg) rotateZ(0deg); }
          to { transform: rotate(12deg) rotateZ(360deg); }
        }

        @keyframes reportsRobotPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.07); }
        }

        @keyframes reportsRingSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes reportsOrbFloat {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-5px) scale(1.035); }
        }

        @keyframes reportsLoadingSpin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 1050px) {
          .reports-kpi-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .reports-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 760px) {
          .reports-hero {
            align-items: flex-start;
            flex-direction: column;
          }

          .reports-kpi-grid {
            grid-template-columns: 1fr;
          }

          .reports-hero-left {
            align-items: flex-start;
          }

          .reports-actions {
            width: 100%;
          }

          .reports-action {
            flex: 1;
          }

          .reports-status-row {
            grid-template-columns: 90px 1fr 30px;
          }
        }

        @media print {
          .reports-actions {
            display: none;
          }

          .reports-page::before,
          .reports-page::after {
            display: none;
          }

          .reports-hero,
          .reports-kpi,
          .reports-panel {
            box-shadow: none;
            break-inside: avoid;
          }
        }
      `}</style>

      <div className="reports-hero">
        <div className="reports-hero-left">
          <div className="reports-robot">
            <span className="reports-robot-emoji">🤖</span>
          </div>

          <div>
            <p className="reports-eyebrow">
              IncidentFlow Intelligence
            </p>

            <h2 className="reports-title">
              Operations Reports
            </h2>

            <p className="reports-subtitle">
              A live operational snapshot of your incident
              management workspace.
            </p>
          </div>
        </div>

        <div className="reports-actions">
          <button
            type="button"
            className="reports-action"
            onClick={onRefresh}
            disabled={loading}
          >
            {loading ? "Refreshing..." : "↻ Refresh"}
          </button>

          <button
            type="button"
            className="reports-action"
            onClick={printReport}
          >
            ⎙ Print
          </button>

          <button
            type="button"
            className="reports-action primary"
            onClick={exportReport}
          >
            ↓ Export CSV
          </button>
        </div>
      </div>

      {loading && !dashboard ? (
        <div className="reports-loading">
          <div className="reports-loading-inner">
            <div className="reports-loading-orb" />
            Loading incident intelligence...
          </div>
        </div>
      ) : (
        <>
          <div className="reports-kpi-grid">
            <div className="reports-kpi">
              <div className="reports-kpi-icon">◈</div>
              <span className="reports-kpi-label">
                Total Incidents
              </span>
              <strong className="reports-kpi-value">
                {total}
              </strong>
              <span className="reports-kpi-note">
                All reported incidents
              </span>
            </div>

            <div className="reports-kpi">
              <div className="reports-kpi-icon">◌</div>
              <span className="reports-kpi-label">
                Active
              </span>
              <strong className="reports-kpi-value">
                {active}
              </strong>
              <span className="reports-kpi-note">
                Open + in progress
              </span>
            </div>

            <div className="reports-kpi">
              <div className="reports-kpi-icon">✓</div>
              <span className="reports-kpi-label">
                Completed
              </span>
              <strong className="reports-kpi-value">
                {completed}
              </strong>
              <span className="reports-kpi-note">
                Resolved + closed
              </span>
            </div>

            <div className="reports-kpi">
              <div className="reports-kpi-icon">ϟ</div>
              <span className="reports-kpi-label">
                Resolution Rate
              </span>
              <strong className="reports-kpi-value">
                {resolutionRate}%
              </strong>
              <span className="reports-kpi-note">
                Current completion rate
              </span>
            </div>
          </div>

          <div className="reports-grid">
            <section className="reports-panel">
              <div className="reports-panel-header">
                <div>
                  <h3 className="reports-panel-title">
                    Incident Status Distribution
                  </h3>

                  <p className="reports-panel-description">
                    Current workload across the incident
                    lifecycle.
                  </p>
                </div>
              </div>

              <div className="reports-status-list">
                {[
                  {
                    name: "Open",
                    value: open,
                    percentage:
                      total > 0
                        ? Math.round((open / total) * 100)
                        : 0,
                  },
                  {
                    name: "In Progress",
                    value: inProgress,
                    percentage:
                      total > 0
                        ? Math.round(
                            (inProgress / total) * 100,
                          )
                        : 0,
                  },
                  {
                    name: "Resolved",
                    value: resolved,
                    percentage:
                      total > 0
                        ? Math.round(
                            (resolved / total) * 100,
                          )
                        : 0,
                  },
                  {
                    name: "Closed",
                    value: closed,
                    percentage:
                      total > 0
                        ? Math.round(
                            (closed / total) * 100,
                          )
                        : 0,
                  },
                ].map((item) => (
                  <div
                    className="reports-status-row"
                    key={item.name}
                  >
                    <span className="reports-status-name">
                      <i className="reports-status-dot" />
                      {item.name}
                    </span>

                    <div className="reports-progress">
                      <div
                        className="reports-progress-fill"
                        style={{
                          width: `${item.percentage}%`,
                        }}
                      />
                    </div>

                    <span className="reports-status-number">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            <section className="reports-panel">
              <div className="reports-panel-header">
                <div>
                  <h3 className="reports-panel-title">
                    Resolution Health
                  </h3>

                  <p className="reports-panel-description">
                    Completed incidents compared with total
                    workload.
                  </p>
                </div>
              </div>

              <div className="reports-summary-orb">
                <span className="reports-summary-value">
                  {resolutionRate}%
                </span>
              </div>

              <div className="reports-breakdown">
                <div className="reports-breakdown-item">
                  <span>Resolved</span>
                  <strong>{resolved}</strong>
                </div>

                <div className="reports-breakdown-item">
                  <span>Closed</span>
                  <strong>{closed}</strong>
                </div>

                <div className="reports-breakdown-item">
                  <span>Active</span>
                  <strong>{active}</strong>
                </div>

                <div className="reports-breakdown-item">
                  <span>Total</span>
                  <strong>{total}</strong>
                </div>
              </div>
            </section>

            <section className="reports-panel">
              <div className="reports-panel-header">
                <div>
                  <h3 className="reports-panel-title">
                    Severity Breakdown
                  </h3>

                  <p className="reports-panel-description">
                    Incident priority distribution.
                  </p>
                </div>
              </div>

              <div className="reports-status-list">
                {[
                  { name: "Critical", value: critical },
                  { name: "High", value: high },
                  { name: "Medium", value: medium },
                  { name: "Low", value: low },
                ].map((item) => {
                  const percentage =
                    total > 0
                      ? Math.round((item.value / total) * 100)
                      : 0;

                  return (
                    <div
                      className="reports-status-row"
                      key={item.name}
                    >
                      <span className="reports-status-name">
                        <i className="reports-status-dot" />
                        {item.name}
                      </span>

                      <div className="reports-progress">
                        <div
                          className="reports-progress-fill"
                          style={{
                            width: `${percentage}%`,
                          }}
                        />
                      </div>

                      <span className="reports-status-number">
                        {item.value}
                      </span>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="reports-panel">
              <div className="reports-panel-header">
                <div>
                  <h3 className="reports-panel-title">
                    AI Operations Summary 🤖
                  </h3>

                  <p className="reports-panel-description">
                    IncidentFlow Copilot overview based on
                    current metrics.
                  </p>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  alignItems: "flex-start",
                  marginTop: "10px",
                }}
              >
                <div
                  style={{
                    width: "42px",
                    height: "42px",
                    display: "grid",
                    placeItems: "center",
                    flexShrink: 0,
                    borderRadius: "13px",
                    border:
                      "1px solid rgba(135,100,255,0.3)",
                    background:
                      "radial-gradient(circle at 30% 20%, rgba(255,255,255,.15), rgba(103,67,220,.2))",
                    fontSize: "21px",
                    boxShadow:
                      "0 0 25px rgba(112,76,255,.18)",
                  }}
                >
                  🤖
                </div>

                <p
                  style={{
                    margin: 0,
                    color: "#8791a8",
                    fontSize: "10px",
                    lineHeight: 1.8,
                  }}
                >
                  {total === 0
                    ? "No incident data is currently available. Create an incident to begin building your operational report."
                    : `IncidentFlow is currently tracking ${total} incident${
                        total === 1 ? "" : "s"
                      }. ${active} ${
                        active === 1
                          ? "incident remains"
                          : "incidents remain"
                      } active, while ${completed} ${
                        completed === 1
                          ? "incident has"
                          : "incidents have"
                      } been completed.`}
                </p>
              </div>
            </section>
          </div>
        </>
      )}
    </div>
  );
}

export default Reports;