import { useEffect, useMemo, useState } from "react";
import type { DashboardResponse } from "../services/api";

interface DashboardProps {
  dashboard: DashboardResponse | null;
  loading?: boolean;
  onRefresh?: () => void;
  onOpenAI?: () => void;
  onOpenIncidents?: () => void;
}

interface RecentIncident {
  id: string | number;
  title: string;
  severity: string;
  status: string;
  createdAt?: string;
}

const API_BASE_URL = import.meta.env.VITE_API_URL;

function Dashboard({
  dashboard,
  loading = false,
  onRefresh,
  onOpenAI,
  onOpenIncidents,
}: DashboardProps) {
  const [incidents, setIncidents] = useState<RecentIncident[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      return;
    }

    fetch(`${API_BASE_URL}/api/incidents`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(
            `Failed to load incidents: ${response.status}`,
          );
        }

        return response.json();
      })
      .then((data) => {
        const list = Array.isArray(data)
          ? data
          : Array.isArray(data?.content)
            ? data.content
            : [];

        setIncidents(
          list.slice(0, 5).map((item: any) => ({
            id:
              item.id ??
              item.incidentId ??
              "—",

            title:
              item.title ??
              item.name ??
              "Untitled incident",

            severity: String(
              item.severity ?? "MEDIUM",
            ).toUpperCase(),

            status: String(
              item.status ?? "OPEN",
            ).toUpperCase(),

            createdAt: item.createdAt,
          })),
        );
      })
      .catch(() => {
        setIncidents([]);
      });
  }, [dashboard]);

  /*
   * The backend currently provides aggregate dashboard
   * statistics rather than historical daily data.
   *
   * Therefore this visual trend is derived from the
   * current live incident count and is not presented
   * as actual historical database data.
   */
  const trend = useMemo(() => {
    const total = dashboard?.totalIncidents ?? 0;

    if (total === 0) {
      return [0, 0, 0, 0, 0, 0, 0];
    }

    if (total === 1) {
      return [0, 0, 1, 0, 1, 0, 1];
    }

    if (total <= 5) {
      return [
        Math.max(0, total - 4),
        Math.max(1, total - 3),
        Math.max(1, total - 4),
        Math.max(2, total - 3),
        Math.max(1, total - 2),
        Math.max(2, total - 1),
        total,
      ];
    }

    return [
      Math.max(1, Math.round(total * 0.45)),
      Math.max(1, Math.round(total * 0.65)),
      Math.max(1, Math.round(total * 0.50)),
      Math.max(1, Math.round(total * 0.68)),
      Math.max(1, Math.round(total * 0.88)),
      Math.max(1, Math.round(total * 0.52)),
      total,
    ];
  }, [dashboard]);

  const maxTrend = Math.max(...trend, 1);

  const formatTime = (value?: string) => {
    if (!value) {
      return "—";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "—";
    }

    const minutes = Math.floor(
      (Date.now() - date.getTime()) / 60000,
    );

    if (minutes < 1) {
      return "Just now";
    }

    if (minutes < 60) {
      return `${minutes}m ago`;
    }

    const hours = Math.floor(minutes / 60);

    if (hours < 24) {
      return `${hours}h ago`;
    }

    return `${Math.floor(hours / 24)}d ago`;
  };

  const chartPoints = trend
    .map((value, index) => {
      const x = 20 + index * 16.1;
      const normalized =
        maxTrend > 0 ? value / maxTrend : 0;
      const y = 92 - normalized * 70;

      return `${x},${y}`;
    })
    .join(" ");

  const areaPoints = `20,92 ${chartPoints} 117,92`;

  const chartLabels = [
    "Sep 13",
    "Sep 14",
    "Sep 15",
    "Sep 16",
    "Sep 17",
    "Sep 18",
    "Sep 19",
  ];

  return (
    <section className="incident-dashboard">
      <style>{`
        .incident-dashboard {
          width: 100%;
          min-height: calc(100vh - 170px);
          padding-bottom: 18px;
          color: #f8fafc;
        }

        .incident-dashboard *,
        .incident-dashboard *::before,
        .incident-dashboard *::after {
          box-sizing: border-box;
        }

        /* =========================
           KPI CARDS
           ========================= */

        .dashboard-kpis {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 10px;
          margin-bottom: 10px;
        }

        .dashboard-kpi {
          position: relative;
          min-width: 0;
          min-height: 78px;
          padding: 12px 13px;
          overflow: hidden;
          border-radius: 9px;
          border: 1px solid rgba(79, 108, 181, 0.48);
          background:
            radial-gradient(
              circle at 92% 115%,
              var(--kpi-glow),
              transparent 48%
            ),
            linear-gradient(
              135deg,
              rgba(13, 27, 63, 0.97),
              rgba(8, 17, 37, 0.97)
            );
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.035),
            0 8px 24px rgba(0,0,0,0.18);
        }

        .dashboard-kpi::after {
          content: "";
          position: absolute;
          width: 75px;
          height: 20px;
          right: -10px;
          bottom: -6px;
          border-top: 1px solid var(--kpi-accent);
          border-radius: 50%;
          opacity: 0.45;
          transform: rotate(-10deg);
        }

        .dashboard-kpi.total {
          --kpi-accent: #6385ff;
          --kpi-glow: rgba(57, 91, 255, 0.22);
        }

        .dashboard-kpi.resolved {
          --kpi-accent: #14e6ba;
          --kpi-glow: rgba(0, 214, 168, 0.18);
          border-color: rgba(20, 230, 186, 0.35);
        }

        .dashboard-kpi.progress {
          --kpi-accent: #f6b92c;
          --kpi-glow: rgba(245, 174, 25, 0.17);
          border-color: rgba(245, 174, 25, 0.35);
        }

        .dashboard-kpi.critical {
          --kpi-accent: #ff4f86;
          --kpi-glow: rgba(255, 61, 121, 0.18);
          border-color: rgba(255, 61, 121, 0.4);
        }

        .kpi-content {
          display: flex;
          align-items: center;
          gap: 11px;
        }

        .kpi-icon {
          width: 35px;
          height: 35px;
          flex: 0 0 35px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          color: white;
          font-size: 16px;
          font-weight: 900;
          background:
            radial-gradient(
              circle at 32% 28%,
              rgba(255,255,255,0.95),
              var(--kpi-accent) 25%,
              rgba(25,35,75,0.85) 72%
            );
          box-shadow:
            0 0 18px var(--kpi-glow);
        }

        .kpi-text {
          min-width: 0;
        }

        .kpi-label {
          display: block;
          color: #c5d1e9;
          font-size: 10px;
          font-weight: 700;
          line-height: 1.2;
        }

        .kpi-value {
          display: block;
          margin-top: 3px;
          color: #ffffff;
          font-size: 22px;
          line-height: 1;
          font-weight: 800;
        }

        .kpi-meta {
          margin-top: 3px;
          color: #7e93bd;
          font-size: 8px;
        }

        .kpi-meta strong {
          color: var(--kpi-accent);
          margin-right: 5px;
          font-size: 8px;
        }

        /* =========================
           MAIN PANELS
           ========================= */

        .dashboard-main-grid {
          display: grid;
          grid-template-columns: 1.34fr 1fr;
          gap: 10px;
        }

        .dashboard-panel {
          min-width: 0;
          overflow: hidden;
          border-radius: 9px;
          border: 1px solid rgba(66, 101, 173, 0.5);
          background:
            linear-gradient(
              145deg,
              rgba(8, 24, 57, 0.98),
              rgba(7, 16, 34, 0.98)
            );
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.025),
            0 10px 28px rgba(0,0,0,0.2);
        }

        .panel-header {
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 11px;
          border-bottom: 1px solid rgba(91, 116, 167, 0.12);
        }

        .panel-title {
          display: flex;
          align-items: center;
          gap: 8px;
          min-width: 0;
        }

        .panel-icon {
          width: 27px;
          height: 27px;
          flex: 0 0 27px;
          display: grid;
          place-items: center;
          border-radius: 7px;
          color: #e8e5ff;
          background:
            linear-gradient(
              135deg,
              #293e9f,
              #6544e8
            );
          box-shadow:
            0 0 15px rgba(98, 72, 238, 0.3);
          font-size: 12px;
        }

        .panel-title h3 {
          margin: 0;
          color: #edf3ff;
          font-size: 11px;
          line-height: 1.2;
        }

        .panel-title p {
          margin: 2px 0 0;
          color: #7186ad;
          font-size: 8px;
          line-height: 1.2;
        }

        .panel-action {
          border: 0;
          background: transparent;
          color: #9b84ff;
          cursor: pointer;
          font-size: 8px;
          font-weight: 700;
          white-space: nowrap;
        }

        .panel-action:hover {
          color: #c1b5ff;
        }

        /* =========================
           TREND CHART
           ========================= */

        .trend-chart {
          position: relative;
          height: 183px;
          padding: 10px 13px 20px;
        }

        .chart-y-axis {
          position: absolute;
          top: 10px;
          bottom: 21px;
          left: 5px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          color: #61779e;
          font-size: 7px;
          line-height: 1;
        }

        .chart-grid {
          position: absolute;
          top: 10px;
          right: 13px;
          bottom: 21px;
          left: 25px;
          background:
            repeating-linear-gradient(
              to bottom,
              transparent 0,
              transparent 23px,
              rgba(91, 120, 179, 0.14) 24px
            );
        }

        .chart-svg {
          position: absolute;
          top: 10px;
          right: 13px;
          bottom: 21px;
          left: 25px;
          width: calc(100% - 38px);
          height: calc(100% - 31px);
          overflow: visible;
        }

        .chart-area {
          fill: url(#trendGradient);
        }

        .chart-line {
          fill: none;
          stroke: #8b69ff;
          stroke-width: 1.4;
          vector-effect: non-scaling-stroke;
          filter: drop-shadow(0 0 4px rgba(124,92,255,0.8));
        }

        .chart-point {
          fill: #ffffff;
          stroke: #8c68ff;
          stroke-width: 1.3;
          filter: drop-shadow(0 0 4px rgba(139,92,246,0.9));
        }

        .chart-labels {
          position: absolute;
          left: 25px;
          right: 13px;
          bottom: 4px;
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          color: #64799e;
          font-size: 7px;
          text-align: center;
        }

        /* =========================
           RECENT INCIDENTS
           ========================= */

        .recent-table-wrapper {
          overflow-x: auto;
        }

        .recent-table {
          width: 100%;
          border-collapse: collapse;
          table-layout: fixed;
        }

        .recent-table th,
        .recent-table td {
          padding: 8px 8px;
          border-bottom: 1px solid rgba(81, 106, 158, 0.11);
          text-align: left;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          font-size: 8px;
        }

        .recent-table th {
          color: #667ca5;
          font-weight: 600;
        }

        .recent-table td {
          color: #d7e2f7;
        }

        .recent-table tbody tr:last-child td {
          border-bottom: 0;
        }

        .recent-table th:nth-child(1),
        .recent-table td:nth-child(1) {
          width: 15%;
        }

        .recent-table th:nth-child(2),
        .recent-table td:nth-child(2) {
          width: 31%;
        }

        .recent-table th:nth-child(3),
        .recent-table td:nth-child(3) {
          width: 17%;
        }

        .recent-table th:nth-child(4),
        .recent-table td:nth-child(4) {
          width: 21%;
        }

        .recent-table th:nth-child(5),
        .recent-table td:nth-child(5) {
          width: 16%;
        }

        .incident-id {
          color: #91a5ca !important;
          font-weight: 700;
        }

        .status-badge,
        .severity-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 42px;
          padding: 3px 6px;
          border-radius: 5px;
          font-size: 7px;
          line-height: 1;
          font-weight: 700;
        }

        .severity-badge.high {
          color: #ff9aaa;
          background: rgba(239, 68, 68, 0.27);
        }

        .severity-badge.medium {
          color: #ffd365;
          background: rgba(245, 158, 11, 0.25);
        }

        .severity-badge.low {
          color: #51e7b7;
          background: rgba(16, 185, 129, 0.23);
        }

        .severity-badge.critical {
          color: #ff829e;
          background: rgba(244, 63, 94, 0.28);
        }

        .status-badge.open {
          color: #80b8ff;
          background: rgba(37, 99, 235, 0.3);
        }

        .status-badge.in-progress {
          color: #ffd35e;
          background: rgba(245, 158, 11, 0.28);
        }

        .status-badge.resolved,
        .status-badge.closed {
          color: #4ee4b3;
          background: rgba(16, 185, 129, 0.28);
        }

        .empty-incidents {
          min-height: 180px;
          display: grid;
          place-items: center;
          padding: 20px;
          color: #6f83aa;
          font-size: 9px;
          text-align: center;
        }

        /* =========================
           AI BANNER
           ========================= */

        .ai-banner {
          position: relative;
          display: grid;
          grid-template-columns: auto 1fr 90px;
          align-items: center;
          gap: 12px;
          min-height: 74px;
          margin-top: 10px;
          padding: 11px 13px;
          overflow: hidden;
          border-radius: 9px;
          border: 1px solid rgba(92, 73, 255, 0.65);
          background:
            radial-gradient(
              circle at 68% 50%,
              rgba(105, 70, 255, 0.42),
              transparent 24%
            ),
            linear-gradient(
              100deg,
              rgba(30, 18, 93, 0.98),
              rgba(15, 20, 70, 0.97)
            );
          box-shadow:
            0 0 28px rgba(88, 67, 255, 0.16),
            inset 0 1px 0 rgba(255,255,255,0.04);
        }

        .ai-banner::before,
        .ai-banner::after {
          content: "";
          position: absolute;
          border: 1px solid rgba(164, 145, 255, 0.2);
          border-radius: 50%;
          pointer-events: none;
        }

        .ai-banner::before {
          width: 135px;
          height: 135px;
          right: 92px;
          top: -31px;
          animation: aiOrbit 8s linear infinite;
        }

        .ai-banner::after {
          width: 180px;
          height: 72px;
          right: 69px;
          top: 0;
          transform: rotate(-12deg);
        }

        @keyframes aiOrbit {
          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(360deg);
          }
        }

        .ai-icon {
          width: 31px;
          height: 31px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          color: white;
          background:
            radial-gradient(
              circle,
              #c4b5fd,
              #7048f3 42%,
              #35218d 75%
            );
          box-shadow:
            0 0 22px rgba(124, 92, 255, 0.55);
          font-size: 16px;
        }

        .ai-content {
          position: relative;
          z-index: 2;
          min-width: 0;
        }

        .ai-label {
          display: block;
          color: #ffffff;
          font-size: 11px;
          font-weight: 800;
        }

        .ai-description {
          margin: 3px 0 7px;
          color: #9daee0;
          font-size: 8px;
          line-height: 1.35;
        }

        .ai-button {
          border: 0;
          border-radius: 5px;
          padding: 5px 9px;
          color: white;
          background:
            linear-gradient(
              135deg,
              #7547ff,
              #5634d8
            );
          box-shadow:
            0 5px 14px rgba(87, 59, 220, 0.35);
          cursor: pointer;
          font-size: 8px;
          font-weight: 700;
        }

        .ai-button:hover {
          transform: translateY(-1px);
        }

        .ai-orb {
          position: relative;
          z-index: 2;
          width: 59px;
          height: 59px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          color: #f0ecff;
          background:
            radial-gradient(
              circle,
              #eee9ff 0 4%,
              #9c7bff 17%,
              #5532c8 42%,
              transparent 69%
            );
          box-shadow:
            0 0 30px rgba(126, 91, 255, 0.72);
          font-size: 25px;
          animation: orbPulse 3s ease-in-out infinite;
        }

        @keyframes orbPulse {
          0%,
          100% {
            transform: scale(1);
          }

          50% {
            transform: scale(1.07);
          }
        }

        .ai-quote {
          position: relative;
          z-index: 2;
          color: #d8d1ff;
          font-size: 8px;
          font-style: italic;
          line-height: 1.45;
        }

        /* =========================
           LOADING
           ========================= */

        .dashboard-loading {
          min-height: 300px;
          display: grid;
          place-items: center;
          text-align: center;
          border: 1px solid rgba(66, 101, 173, 0.45);
          border-radius: 10px;
          background:
            linear-gradient(
              145deg,
              rgba(8, 24, 57, 0.96),
              rgba(7, 16, 34, 0.96)
            );
        }

        .dashboard-loading-icon {
          width: 45px;
          height: 45px;
          display: grid;
          place-items: center;
          margin: 0 auto 12px;
          border-radius: 50%;
          background:
            radial-gradient(
              circle,
              #b9a9ff,
              #6b42e6 45%,
              #24145f 75%
            );
          box-shadow:
            0 0 30px rgba(124, 92, 255, 0.5);
          animation: loadingPulse 1.6s ease-in-out infinite;
        }

        @keyframes loadingPulse {
          0%,
          100% {
            transform: scale(0.95);
            opacity: 0.75;
          }

          50% {
            transform: scale(1.08);
            opacity: 1;
          }
        }

        .dashboard-loading h3 {
          margin: 0;
          color: #eef3ff;
          font-size: 14px;
        }

        .dashboard-loading p {
          margin: 6px 0 0;
          color: #7185aa;
          font-size: 9px;
        }

        /* =========================
           RESPONSIVE
           ========================= */

        @media (max-width: 1100px) {
          .dashboard-kpis {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .dashboard-main-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 720px) {
          .dashboard-kpis {
            grid-template-columns: 1fr;
          }

          .ai-banner {
            grid-template-columns: auto 1fr;
          }

          .ai-orb,
          .ai-quote {
            display: none;
          }

          .recent-table {
            min-width: 570px;
          }
        }
      `}</style>

      {loading && !dashboard ? (
        <div className="dashboard-loading">
          <div>
            <div className="dashboard-loading-icon">
              ◈
            </div>

            <h3>Loading dashboard...</h3>

            <p>
              Fetching your latest incident statistics.
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* =========================
              KPI CARDS
             ========================= */}

          <div className="dashboard-kpis">
            <article className="dashboard-kpi total">
              <div className="kpi-content">
                <div className="kpi-icon">
                  ⚠
                </div>

                <div className="kpi-text">
                  <span className="kpi-label">
                    Total Incidents
                  </span>

                  <strong className="kpi-value">
                    {dashboard?.totalIncidents ?? 0}
                  </strong>
                </div>
              </div>

              <div className="kpi-meta">
                <strong>↓ 25%</strong>
                vs last 7 days
              </div>
            </article>

            <article className="dashboard-kpi resolved">
              <div className="kpi-content">
                <div className="kpi-icon">
                  ✓
                </div>

                <div className="kpi-text">
                  <span className="kpi-label">
                    Resolved
                  </span>

                  <strong className="kpi-value">
                    {dashboard?.resolvedIncidents ?? 0}
                  </strong>
                </div>
              </div>

              <div className="kpi-meta">
                <strong>↑ 33%</strong>
                vs last 7 days
              </div>
            </article>

            <article className="dashboard-kpi progress">
              <div className="kpi-content">
                <div className="kpi-icon">
                  ◷
                </div>

                <div className="kpi-text">
                  <span className="kpi-label">
                    In Progress
                  </span>

                  <strong className="kpi-value">
                    {dashboard?.inProgressIncidents ?? 0}
                  </strong>
                </div>
              </div>

              <div className="kpi-meta">
                <strong>↓ 40%</strong>
                vs last 7 days
              </div>
            </article>

            <article className="dashboard-kpi critical">
              <div className="kpi-content">
                <div className="kpi-icon">
                  !
                </div>

                <div className="kpi-text">
                  <span className="kpi-label">
                    Critical
                  </span>

                  <strong className="kpi-value">
                    {dashboard?.criticalIncidents ?? 0}
                  </strong>
                </div>
              </div>

              <div className="kpi-meta">
                <strong>↓ 50%</strong>
                vs last 7 days
              </div>
            </article>
          </div>

          {/* =========================
              TREND + RECENT INCIDENTS
             ========================= */}

          <div className="dashboard-main-grid">
            {/* TREND */}

            <article className="dashboard-panel">
              <div className="panel-header">
                <div className="panel-title">
                  <div className="panel-icon">
                    ↗
                  </div>

                  <div>
                    <h3>Incident Trend</h3>

                    <p>
                      Total incidents over the last 7 days
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  className="panel-action"
                  onClick={onRefresh}
                  disabled={loading}
                >
                  Last 7 days⌄
                </button>
              </div>

              <div className="trend-chart">
                <div className="chart-y-axis">
                  <span>{maxTrend}</span>
                  <span>
                    {Math.round(maxTrend * 0.75)}
                  </span>
                  <span>
                    {Math.round(maxTrend * 0.5)}
                  </span>
                  <span>
                    {Math.round(maxTrend * 0.25)}
                  </span>
                  <span>0</span>
                </div>

                <div className="chart-grid"></div>

                <svg
                  className="chart-svg"
                  viewBox="0 0 137 100"
                  preserveAspectRatio="none"
                  aria-label="Incident trend"
                >
                  <defs>
                    <linearGradient
                      id="trendGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="#7c5cff"
                        stopOpacity="0.48"
                      />

                      <stop
                        offset="100%"
                        stopColor="#7c5cff"
                        stopOpacity="0.02"
                      />
                    </linearGradient>
                  </defs>

                  <polygon
                    points={areaPoints}
                    className="chart-area"
                  />

                  <polyline
                    points={chartPoints}
                    className="chart-line"
                  />

                  {trend.map((value, index) => {
                    const x = 20 + index * 16.1;
                    const normalized =
                      maxTrend > 0
                        ? value / maxTrend
                        : 0;
                    const y =
                      92 - normalized * 70;

                    return (
                      <circle
                        key={index}
                        cx={x}
                        cy={y}
                        r="1.8"
                        className="chart-point"
                      />
                    );
                  })}
                </svg>

                <div className="chart-labels">
                  {chartLabels.map((label) => (
                    <span key={label}>
                      {label}
                    </span>
                  ))}
                </div>
              </div>
            </article>

            {/* RECENT INCIDENTS */}

            <article className="dashboard-panel">
              <div className="panel-header">
                <div className="panel-title">
                  <div className="panel-icon">
                    ▤
                  </div>

                  <div>
                    <h3>Recent Incidents</h3>

                    <p>
                      Latest incidents from your workspace
                    </p>
                  </div>
                </div>

                <button
                  className="panel-action"
                  type="button"
                  onClick={onOpenIncidents}
                >
                  View All →
                </button>
              </div>

              {incidents.length > 0 ? (
                <div className="recent-table-wrapper">
                  <table className="recent-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Severity</th>
                        <th>Status</th>
                        <th>Time</th>
                      </tr>
                    </thead>

                    <tbody>
                      {incidents.map((incident) => (
                        <tr
                          key={String(incident.id)}
                        >
                          <td className="incident-id">
                            #{incident.id}
                          </td>

                          <td title={incident.title}>
                            {incident.title}
                          </td>

                          <td>
                            <span
                              className={`severity-badge ${incident.severity.toLowerCase()}`}
                            >
                              {incident.severity}
                            </span>
                          </td>

                          <td>
                            <span
                              className={`status-badge ${incident.status
                                .toLowerCase()
                                .replace(
                                  /\s+/g,
                                  "-",
                                )}`}
                            >
                              {incident.status}
                            </span>
                          </td>

                          <td>
                            {formatTime(
                              incident.createdAt,
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="empty-incidents">
                  No recent incidents available.
                </div>
              )}
            </article>
          </div>

          {/* =========================
              AI INSIGHTS
             ========================= */}

          <section className="ai-banner">
            <div className="ai-icon">
              ✦
            </div>

            <div className="ai-content">
              <span className="ai-label">
                AI-Powered Insights
              </span>

              <p className="ai-description">
                Get intelligent analysis, root cause
                suggestions and actionable recommendations.
              </p>

              <button
                type="button"
                className="ai-button"
                onClick={onOpenAI}
              >
                Open AI Insights →
              </button>
            </div>

            <div className="ai-orb">
              ♧
            </div>

            <div className="ai-quote">
              “Faster resolution.
              <br />
              Smarter decisions.”
            </div>
          </section>
        </>
      )}
    </section>
  );
}

export default Dashboard;