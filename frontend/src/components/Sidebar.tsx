interface SidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

function Sidebar({
  activePage,
  onNavigate,
  onLogout,
}: SidebarProps) {
  const menuItems = [
    { name: "Dashboard", icon: "⌂" },
    { name: "Incidents", icon: "⚠" },
    { name: "Analytics", icon: "◈" },
    { name: "AI Insights", icon: "✦" },
    { name: "Reports", icon: "▤" },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-logo">
          <span>◈</span>
        </div>

        <div className="brand-text">
          <div className="brand-name">IncidentFlow</div>
          <div className="brand-ai">AI PLATFORM</div>
        </div>
      </div>

      <div className="ai-core-container">
        <div className="ai-orbit orbit-one"></div>
        <div className="ai-orbit orbit-two"></div>
        <div className="ai-orbit orbit-three"></div>

        <div className="ai-core-glow"></div>

        <div className="ai-core">
          <div className="ai-core-inner">
            ◈
          </div>
        </div>

        <div className="ai-core-label">
          <span className="pulse-dot"></span>
          AI ENGINE ONLINE
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-label">WORKSPACE</div>

        {menuItems.map((item) => (
          <button
            key={item.name}
            className={`nav-item ${
              activePage === item.name ? "active" : ""
            }`}
            onClick={() => onNavigate(item.name)}
          >
            <span className="nav-icon">
              {item.icon}
            </span>

            <span className="nav-text">
              {item.name}
            </span>

            {activePage === item.name && (
              <span className="active-indicator"></span>
            )}
          </button>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <button
          className={`nav-item ${
            activePage === "Settings" ? "active" : ""
          }`}
          onClick={() => onNavigate("Settings")}
        >
          <span className="nav-icon">⚙</span>

          <span className="nav-text">
            Settings
          </span>

          {activePage === "Settings" && (
            <span className="active-indicator"></span>
          )}
        </button>

        <button
          className="nav-item logout-item"
          onClick={onLogout}
        >
          <span className="nav-icon">↪</span>

          <span className="nav-text">
            Logout
          </span>
        </button>

        <div className="sidebar-user">
          <div className="user-avatar">
            A
          </div>

          <div className="user-details">
            <strong>Ashlesa</strong>

            <span>
              Support Agent
            </span>
          </div>

          <span className="online-dot"></span>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;