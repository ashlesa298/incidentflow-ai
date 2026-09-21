import { useMemo, useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_URL;

interface ChatMessage {
  id: number;
  role: "user" | "ai";
  content: string;
  time: string;
}

interface Conversation {
  id: number;
  title: string;
  time: string;
}

const quickActions = [
  { icon: "⌁", label: "Diagnose Incident" },
  { icon: "⌘", label: "Debug Error" },
  { icon: "◈", label: "Find Root Cause" },
  { icon: "⚒", label: "Suggest Fix" },
  { icon: "↗", label: "Deployment Help" },
  { icon: "▣", label: "Database Issue" },
  { icon: "◇", label: "Security Check" },
  { icon: "ϟ", label: "Performance Issue" },
];

function AIInsights() {
  const [message, setMessage] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: 1,
      title: "Payment API returning 500",
      time: "Today",
    },
    {
      id: 2,
      title: "Spring Boot database issue",
      time: "Yesterday",
    },
    {
      id: 3,
      title: "Deployment troubleshooting",
      time: "Sep 18",
    },
  ]);

  const currentConversationTitle = useMemo(() => {
    if (messages.length === 0) {
      return "New AI Copilot Session";
    }

    const firstUserMessage = messages.find(
      (item) => item.role === "user",
    );

    return (
      firstUserMessage?.content.slice(0, 38) ||
      "AI Copilot Session"
    );
  }, [messages]);

  const handleSend = async () => {
    const trimmedMessage = message.trim();

    if (!trimmedMessage || isThinking) {
      return;
    }

    const userMessage: ChatMessage = {
      id: Date.now(),
      role: "user",
      content: trimmedMessage,
      time: "Just now",
    };

    const nextMessages = [...messages, userMessage];

    setMessages(nextMessages);
    setMessage("");
    setIsThinking(true);

    try {
      const token =
        localStorage.getItem("token") ||
        localStorage.getItem("jwtToken") ||
        localStorage.getItem("accessToken") ||
        localStorage.getItem("authToken");

      if (!token) {
        throw new Error(
          "Authentication token not found. Please log in again.",
        );
      }

      const incidentContext = selectedIncident
        ? JSON.stringify({
            incidentId: "INC-102",
            title: "Payment API returning 500",
            severity: "HIGH",
            status: "OPEN",
          })
        : "No specific IncidentFlow incident selected.";

      const recentConversation = nextMessages
        .slice(-8)
        .map(
          (item) =>
            `${item.role === "user" ? "Developer" : "IncidentFlow AI"}: ${item.content}`,
        )
        .join("\n");

      const contextForAI = `${incidentContext}\n\nRecent conversation:\n${recentConversation}`;

      const response = await fetch(
        `${API_BASE_URL}/api/ai/chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            message: trimmedMessage,
            incidentContext: contextForAI,
          }),
        },
      );

      if (!response.ok) {
        let errorMessage = `AI request failed with status ${response.status}.`;

        try {
          const errorBody = await response.text();
          if (errorBody.trim()) {
            errorMessage += ` ${errorBody}`;
          }
        } catch {
          // Keep the status-based error message.
        }

        throw new Error(errorMessage);
      }

      const data: { response?: string } =
        await response.json();

      const aiResponse = data.response?.trim();

      if (!aiResponse) {
        throw new Error(
          "The AI backend returned an empty response.",
        );
      }

      const aiMessage: ChatMessage = {
        id: Date.now() + 1,
        role: "ai",
        content: aiResponse,
        time: "Just now",
      };

      setMessages((previous) => [...previous, aiMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: Date.now() + 1,
        role: "ai",
        content:
          error instanceof Error
            ? `I couldn't complete that request.\n\n${error.message}`
            : "I couldn't complete that request. Please check that the IncidentFlow backend is running and try again.",
        time: "Just now",
      };

      setMessages((previous) => [
        ...previous,
        errorMessage,
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleQuickAction = (action: string) => {
    setMessage(`${action}: `);
  };

  const handleNewChat = () => {
    setMessages([]);
    setMessage("");
    setIsThinking(false);
  };

  const handleClearChat = () => {
    setMessages([]);
  };

  const handleConversationClick = (
    conversation: Conversation,
  ) => {
    setMessages([
      {
        id: Date.now(),
        role: "user",
        content: conversation.title,
        time: conversation.time,
      },
    ]);
  };

  const handleSaveConversation = () => {
    if (messages.length === 0) {
      return;
    }

    const existingConversation = conversations.some(
      (conversation) =>
        conversation.title === currentConversationTitle,
    );

    if (existingConversation) {
      return;
    }

    setConversations((previous) => [
      {
        id: Date.now(),
        title: currentConversationTitle,
        time: "Just now",
      },
      ...previous,
    ]);
  };

  return (
    <>
      <style>{`
        * {
          box-sizing: border-box;
        }

        .ai-insights-page {
          position: relative;
          min-height: calc(100vh - 48px);
          display: flex;
          flex-direction: column;
          gap: 18px;
          color: #f5f7ff;
          overflow: hidden;
          isolation: isolate;
        }

        /* =========================
           AMBIENT BACKGROUND
        ========================= */

        .ai-insights-page::before {
          content: "";
          position: absolute;
          width: 520px;
          height: 520px;
          top: -220px;
          left: 12%;
          border-radius: 50%;
          background: rgba(111, 69, 255, 0.11);
          filter: blur(90px);
          pointer-events: none;
          z-index: -2;
          animation: ambientFloatOne 9s ease-in-out infinite;
        }

        .ai-insights-page::after {
          content: "";
          position: absolute;
          width: 450px;
          height: 450px;
          right: -180px;
          bottom: -160px;
          border-radius: 50%;
          background: rgba(36, 139, 255, 0.09);
          filter: blur(85px);
          pointer-events: none;
          z-index: -2;
          animation: ambientFloatTwo 11s ease-in-out infinite;
        }

        .ai-page-header {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          padding: 22px 24px;
          overflow: hidden;
          border: 1px solid rgba(153, 125, 255, 0.22);
          border-radius: 22px;
          background:
            linear-gradient(
              135deg,
              rgba(25, 20, 51, 0.88),
              rgba(10, 16, 34, 0.82)
            );
          box-shadow:
            0 25px 70px rgba(0, 0, 0, 0.34),
            inset 0 1px 0 rgba(255, 255, 255, 0.07),
            inset 0 -1px 0 rgba(98, 73, 190, 0.12);
          backdrop-filter: blur(22px);
          transform: translateZ(0);
        }

        .ai-page-header::before {
          content: "";
          position: absolute;
          width: 250px;
          height: 100px;
          left: 70px;
          top: -70px;
          border-radius: 50%;
          background: rgba(137, 91, 255, 0.2);
          filter: blur(35px);
        }

        .ai-page-header::after {
          content: "";
          position: absolute;
          inset: 0;
          background:
            linear-gradient(
              115deg,
              transparent 0%,
              rgba(255, 255, 255, 0.025) 48%,
              transparent 52%
            );
          pointer-events: none;
        }

        /* =========================
           3D ROBOT IDENTITY
        ========================= */

        .ai-robot-badge {
          position: relative;
          width: 62px;
          height: 62px;
          flex: 0 0 62px;
          display: grid;
          place-items: center;
          border-radius: 19px;
          transform-style: preserve-3d;
          perspective: 700px;
          background:
            linear-gradient(145deg, rgba(116, 79, 255, 0.24), rgba(38, 87, 170, 0.11));
          border: 1px solid rgba(151, 121, 255, 0.38);
          box-shadow:
            0 14px 34px rgba(56, 36, 142, 0.24),
            0 0 30px rgba(116, 78, 255, 0.13),
            inset 0 1px 0 rgba(255,255,255,0.13),
            inset 0 -10px 25px rgba(0,0,0,0.16);
          animation: robotBadgeFloat 4s ease-in-out infinite;
        }

        .ai-robot-badge::before {
          content: "";
          position: absolute;
          inset: 5px;
          border-radius: 15px;
          border: 1px solid rgba(126, 191, 255, 0.18);
          transform: translateZ(8px);
        }

        .ai-robot-face {
          position: relative;
          z-index: 3;
          font-size: 30px;
          line-height: 1;
          filter: drop-shadow(0 5px 8px rgba(0,0,0,0.38));
          transform: translateZ(20px);
          animation: robotFaceTilt 4s ease-in-out infinite;
        }

        .ai-robot-ring {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 55px;
          height: 20px;
          margin: -10px 0 0 -27.5px;
          border: 1px solid rgba(142, 111, 255, 0.42);
          border-radius: 50%;
          transform-style: preserve-3d;
          pointer-events: none;
        }

        .ai-robot-ring.ring-a {
          transform: rotateX(67deg) rotateZ(12deg) translateZ(3px);
          animation: robotRingOne 5s linear infinite;
        }

        .ai-robot-ring.ring-b {
          width: 47px;
          height: 47px;
          margin: -23.5px 0 0 -23.5px;
          border-color: rgba(91, 177, 255, 0.2);
          transform: rotateX(68deg) rotateY(28deg);
          animation: robotRingTwo 7s linear infinite reverse;
        }

        .ai-robot-spark {
          position: absolute;
          z-index: 4;
          color: #b7a4ff;
          text-shadow: 0 0 12px rgba(153, 122, 255, 0.9);
          pointer-events: none;
        }

        .ai-robot-spark.spark-a {
          top: 2px;
          right: 5px;
          font-size: 10px;
          animation: sparkFloat 2.2s ease-in-out infinite;
        }

        .ai-robot-spark.spark-b {
          bottom: 7px;
          left: 7px;
          font-size: 15px;
          animation: sparkFloat 2.8s ease-in-out infinite reverse;
        }

        .ai-header-left {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          gap: 17px;
        }

        /* =========================
           MINI AI ORB
        ========================= */

        .ai-mini-orb-wrap {
          position: relative;
          width: 52px;
          height: 52px;
        }

        .ai-mini-orb {
          position: absolute;
          inset: 7px;
          border-radius: 50%;
          background:
            radial-gradient(
              circle at 32% 25%,
              #ffffff 0%,
              #d7cbff 9%,
              #a17bff 24%,
              #7045ff 45%,
              #2c167b 72%,
              #090613 100%
            );
          box-shadow:
            0 0 14px rgba(145, 99, 255, 0.9),
            0 0 35px rgba(107, 73, 255, 0.55),
            inset -7px -8px 13px rgba(0, 0, 0, 0.42),
            inset 3px 3px 8px rgba(255, 255, 255, 0.2);
          animation: aiOrbFloat 3.5s ease-in-out infinite;
        }

        .ai-mini-orb::before {
          content: "";
          position: absolute;
          inset: -8px;
          border-radius: 50%;
          border: 1px solid rgba(161, 127, 255, 0.42);
          box-shadow:
            0 0 15px rgba(130, 90, 255, 0.28);
          animation: aiOrbPulse 2.5s ease-in-out infinite;
        }

        .ai-mini-orb::after {
          content: "";
          position: absolute;
          width: 8px;
          height: 8px;
          top: 3px;
          left: 9px;
          border-radius: 50%;
          background: #ffffff;
          filter: blur(1.5px);
          opacity: 0.9;
        }

        .ai-mini-orbit {
          position: absolute;
          inset: -2px;
          border: 1px solid rgba(119, 145, 255, 0.24);
          border-radius: 50%;
          transform: rotateX(65deg) rotateZ(-15deg);
          animation: miniOrbit 5s linear infinite;
        }

        .ai-header-title {
          margin: 0;
          font-size: 20px;
          font-weight: 800;
          letter-spacing: -0.5px;
          background:
            linear-gradient(
              100deg,
              #ffffff,
              #c9baff 50%,
              #8fc9ff
            );
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .ai-header-subtitle {
          margin: 5px 0 0;
          color: #858da5;
          font-size: 12px;
        }

        .ai-status-pill {
          position: relative;
          z-index: 2;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 9px 14px;
          border: 1px solid rgba(70, 226, 151, 0.23);
          border-radius: 999px;
          color: #7eeab3;
          background:
            linear-gradient(
              135deg,
              rgba(49, 195, 127, 0.1),
              rgba(36, 104, 86, 0.06)
            );
          box-shadow:
            0 0 25px rgba(49, 211, 145, 0.06),
            inset 0 1px 0 rgba(255, 255, 255, 0.05);
          font-size: 11px;
          font-weight: 750;
          white-space: nowrap;
        }

        .ai-status-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #4de39a;
          box-shadow:
            0 0 6px #4de39a,
            0 0 15px rgba(77, 227, 154, 0.8);
          animation: statusPulse 2s ease-in-out infinite;
        }

        /* =========================
           MAIN 3D WORKSPACE
        ========================= */

        .ai-workspace {
          position: relative;
          flex: 1;
          min-height: 650px;
          display: grid;
          grid-template-columns: 235px minmax(0, 1fr) 250px;
          overflow: hidden;
          border: 1px solid rgba(149, 121, 255, 0.2);
          border-radius: 24px;
          background:
            linear-gradient(
              135deg,
              rgba(17, 16, 34, 0.97),
              rgba(6, 9, 19, 0.99)
            );
          box-shadow:
            0 35px 100px rgba(0, 0, 0, 0.42),
            0 0 80px rgba(91, 65, 190, 0.07),
            inset 0 1px 0 rgba(255, 255, 255, 0.055),
            inset 0 -1px 0 rgba(112, 78, 220, 0.08);
          transform: perspective(1600px) rotateX(0.25deg);
        }

        .ai-workspace::before {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          background:
            linear-gradient(
              rgba(255,255,255,0.018) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(255,255,255,0.014) 1px,
              transparent 1px
            );
          background-size: 42px 42px;
          mask-image: linear-gradient(
            to bottom,
            rgba(0,0,0,0.8),
            transparent 88%
          );
          z-index: 0;
        }

        .ai-3d-particles {
          position: absolute;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          overflow: hidden;
          perspective: 900px;
        }

        .ai-3d-particles .particle {
          position: absolute;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #9d85ff;
          box-shadow: 0 0 9px rgba(157,133,255,0.8), 0 0 20px rgba(91,151,255,0.35);
          opacity: 0.4;
          animation: particleDrift 8s ease-in-out infinite;
        }

        .particle.p1 { left: 31%; top: 15%; animation-delay: -1s; }
        .particle.p2 { left: 72%; top: 22%; width: 3px; height: 3px; animation-delay: -4s; }
        .particle.p3 { left: 58%; top: 70%; width: 5px; height: 5px; animation-delay: -6s; }
        .particle.p4 { left: 84%; top: 61%; animation-delay: -2s; }
        .particle.p5 { left: 43%; top: 48%; width: 3px; height: 3px; animation-delay: -5s; }
        .particle.p6 { left: 67%; top: 83%; width: 3px; height: 3px; animation-delay: -7s; }
        .particle.p7 { left: 20%; top: 75%; width: 5px; height: 5px; animation-delay: -3s; }
        .particle.p8 { left: 91%; top: 34%; width: 3px; height: 3px; animation-delay: -6.5s; }

        .ai-hologram-line {
          position: absolute;
          z-index: 0;
          pointer-events: none;
          height: 1px;
          width: 45%;
          background: linear-gradient(90deg, transparent, rgba(129, 98, 255, 0.22), transparent);
          filter: blur(0.3px);
          animation: hologramSweep 7s ease-in-out infinite;
        }

        .ai-hologram-line.line-one { top: 26%; left: 29%; transform: rotate(-9deg); }
        .ai-hologram-line.line-two { top: 69%; left: 43%; transform: rotate(8deg); animation-delay: -3.5s; }

        /* =========================
           HISTORY PANEL
        ========================= */

        .ai-history-panel {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
          padding: 18px;
          border-right: 1px solid rgba(255, 255, 255, 0.065);
          background:
            linear-gradient(
              180deg,
              rgba(13, 14, 28, 0.82),
              rgba(6, 8, 17, 0.62)
            );
          backdrop-filter: blur(18px);
        }

        .ai-panel-label {
          margin: 0 0 12px;
          color: #707991;
          font-size: 9px;
          font-weight: 850;
          letter-spacing: 1.6px;
          text-transform: uppercase;
        }

        .ai-new-chat-button {
          position: relative;
          width: 100%;
          overflow: hidden;
          border: 1px solid rgba(142, 105, 255, 0.42);
          border-radius: 12px;
          padding: 11px 13px;
          color: #ffffff;
          background:
            linear-gradient(
              135deg,
              rgba(126, 85, 255, 0.22),
              rgba(59, 119, 255, 0.12)
            );
          box-shadow:
            0 8px 25px rgba(82, 58, 190, 0.12),
            inset 0 1px 0 rgba(255,255,255,0.06);
          cursor: pointer;
          font-size: 11px;
          font-weight: 750;
          transition: all 0.25s ease;
        }

        .ai-new-chat-button::before {
          content: "";
          position: absolute;
          top: 0;
          left: -100%;
          width: 70%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255,255,255,0.09),
            transparent
          );
          transform: skewX(-20deg);
          transition: left 0.5s ease;
        }

        .ai-new-chat-button:hover::before {
          left: 140%;
        }

        .ai-new-chat-button:hover {
          transform: translateY(-2px);
          border-color: rgba(166, 136, 255, 0.7);
          box-shadow:
            0 12px 30px rgba(82, 58, 190, 0.2),
            0 0 22px rgba(111, 77, 255, 0.08);
        }

        .ai-history-list {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-top: 18px;
          overflow-y: auto;
          scrollbar-width: thin;
        }

        .ai-history-item {
          position: relative;
          width: 100%;
          padding: 11px 10px;
          overflow: hidden;
          border: 1px solid transparent;
          border-radius: 10px;
          color: #9ea6bb;
          background: transparent;
          text-align: left;
          cursor: pointer;
          transition: all 0.22s ease;
        }

        .ai-history-item::before {
          content: "";
          position: absolute;
          left: 0;
          top: 8px;
          bottom: 8px;
          width: 2px;
          border-radius: 4px;
          background: linear-gradient(
            #8760ff,
            #4d8dff
          );
          opacity: 0;
          transition: opacity 0.2s ease;
        }

        .ai-history-item:hover {
          color: #ffffff;
          border-color: rgba(129, 101, 255, 0.16);
          background:
            linear-gradient(
              135deg,
              rgba(121, 92, 255, 0.1),
              rgba(72, 120, 255, 0.035)
            );
          transform: translateX(2px);
        }

        .ai-history-item:hover::before {
          opacity: 1;
        }

        .ai-history-title {
          display: block;
          overflow: hidden;
          font-size: 10px;
          font-weight: 650;
          line-height: 1.45;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .ai-history-time {
          display: block;
          margin-top: 4px;
          color: #5f687e;
          font-size: 8px;
        }

        .ai-history-bottom {
          margin-top: auto;
          padding-top: 18px;
        }

        .ai-save-button,
        .ai-clear-button {
          width: 100%;
          padding: 9px 10px;
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 9px;
          color: #7f879b;
          background: rgba(255, 255, 255, 0.025);
          cursor: pointer;
          font-size: 9px;
          font-weight: 700;
          transition: all 0.22s ease;
        }

        .ai-save-button:hover,
        .ai-clear-button:hover {
          color: #ffffff;
          border-color: rgba(139, 104, 255, 0.3);
          background: rgba(139, 104, 255, 0.08);
          transform: translateY(-1px);
        }

        .ai-clear-button {
          margin-top: 7px;
        }

        /* =========================
           CHAT PANEL
        ========================= */

        .ai-chat-panel {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
          overflow: hidden;
          background:
            radial-gradient(
              circle at 50% 30%,
              rgba(90, 58, 190, 0.035),
              transparent 42%
            );
        }

        .ai-chat-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 16px 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          background: rgba(12, 14, 27, 0.6);
          backdrop-filter: blur(16px);
        }

.ai-session-heading {
          display: flex;
          align-items: center;
          gap: 9px;
        }

        .ai-session-robot {
          display: grid;
          place-items: center;
          width: 27px;
          height: 27px;
          border-radius: 8px;
          background: linear-gradient(145deg, rgba(130, 93, 255, 0.22), rgba(64, 118, 255, 0.08));
          border: 1px solid rgba(140, 108, 255, 0.24);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.08), 0 0 15px rgba(111,78,255,0.08);
          font-size: 15px;
          animation: miniRobotPulse 3s ease-in-out infinite;
        }

        .ai-session-title {
          color: #e9ecf8;
          font-size: 11px;
          font-weight: 750;
        }

        .ai-session-subtitle {
          margin-top: 3px;
          color: #626b81;
          font-size: 8px;
        }

        .ai-context-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 7px 9px;
          border: 1px solid rgba(92, 145, 255, 0.2);
          border-radius: 8px;
          color: #8db7ff;
          background: rgba(73, 126, 255, 0.075);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.04);
          font-size: 8px;
          font-weight: 750;
          white-space: nowrap;
        }

        .ai-messages {
          position: relative;
          flex: 1;
          overflow-y: auto;
          padding: 26px 28px 20px;
          scrollbar-width: thin;
        }

        /* =========================
           3D WELCOME ORB
        ========================= */

        .ai-welcome {
          position: relative;
          max-width: 730px;
          margin: 25px auto 20px;
          text-align: center;
        }

        .ai-main-orb-wrap {
          position: relative;
          width: 170px;
          height: 170px;
          margin: 0 auto 22px;
          perspective: 700px;
        }

        .ai-main-orb-glow {
          position: absolute;
          inset: 28px;
          border-radius: 50%;
          background: rgba(115, 74, 255, 0.32);
          filter: blur(35px);
          animation: orbGlow 3.5s ease-in-out infinite;
        }

        .ai-main-orb {
          position: absolute;
          inset: 40px;
          border-radius: 50%;
          background:
            radial-gradient(
              circle at 31% 23%,
              #ffffff 0%,
              #e1d8ff 7%,
              #b28cff 17%,
              #8053ff 34%,
              #4921bc 58%,
              #1b0c55 80%,
              #07040f 100%
            );
          box-shadow:
            0 0 20px rgba(138, 92, 255, 0.95),
            0 0 55px rgba(103, 67, 255, 0.5),
            0 0 100px rgba(82, 72, 255, 0.18),
            inset -15px -17px 25px rgba(0, 0, 0, 0.45),
            inset 5px 5px 15px rgba(255,255,255,0.24);
          transform-style: preserve-3d;
          animation: mainOrbFloat 4.5s ease-in-out infinite;
        }

        .ai-main-orb::before {
          content: "";
          position: absolute;
          width: 24px;
          height: 13px;
          top: 12px;
          left: 15px;
          border-radius: 50%;
          background: rgba(255,255,255,0.75);
          filter: blur(5px);
          transform: rotate(-25deg);
        }

        .ai-main-orb::after {
          content: "";
          position: absolute;
          inset: 8px;
          border-radius: 50%;
          border: 1px solid rgba(210, 194, 255, 0.17);
        }

        .ai-orbit-ring {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 138px;
          height: 45px;
          margin-left: -69px;
          margin-top: -22px;
          border: 1px solid rgba(147, 116, 255, 0.48);
          border-radius: 50%;
          transform-style: preserve-3d;
        }

        .ai-orbit-ring.one {
          transform: rotateX(68deg) rotateZ(10deg);
          animation: orbitRotateOne 7s linear infinite;
        }

        .ai-orbit-ring.two {
          width: 150px;
          height: 50px;
          margin-left: -75px;
          margin-top: -25px;
          transform: rotateX(67deg) rotateY(35deg);
          border-color: rgba(76, 155, 255, 0.3);
          animation: orbitRotateTwo 9s linear infinite reverse;
        }

        .ai-orbit-ring.three {
          width: 128px;
          height: 128px;
          margin-left: -64px;
          margin-top: -64px;
          border-color: rgba(120, 96, 255, 0.16);
          transform: rotateX(68deg);
          animation: orbitRotateThree 12s linear infinite;
        }

        .ai-orbit-dot {
          position: absolute;
          width: 7px;
          height: 7px;
          top: 19px;
          right: 27px;
          border-radius: 50%;
          background: #a997ff;
          box-shadow:
            0 0 8px #a997ff,
            0 0 18px rgba(159, 138, 255, 0.9);
          animation: aiOrbit 4s linear infinite;
        }

        .ai-orbit-dot.blue {
          width: 5px;
          height: 5px;
          top: auto;
          right: auto;
          bottom: 34px;
          left: 25px;
          background: #72b8ff;
          box-shadow:
            0 0 8px #72b8ff,
            0 0 18px rgba(114, 184, 255, 0.8);
          animation-duration: 6s;
          animation-direction: reverse;
        }

        .ai-robot-welcome {
          position: relative;
          width: 106px;
          height: 126px;
          margin: 0 auto 4px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          perspective: 600px;
        }

        .ai-robot-plate {
          position: relative;
          width: 76px;
          height: 76px;
          display: grid;
          place-items: center;
          border-radius: 22px;
          border: 1px solid rgba(155, 127, 255, 0.42);
          background: linear-gradient(145deg, rgba(102, 70, 220, 0.24), rgba(31, 65, 125, 0.1));
          box-shadow:
            0 20px 38px rgba(44, 23, 111, 0.28),
            0 0 35px rgba(111, 76, 255, 0.16),
            inset 0 1px 0 rgba(255,255,255,0.13),
            inset 0 -12px 22px rgba(0,0,0,0.18);
          transform-style: preserve-3d;
          animation: heroRobotFloat 4s ease-in-out infinite;
        }

        .ai-robot-plate::before {
          content: "";
          position: absolute;
          inset: 7px;
          border-radius: 17px;
          border: 1px solid rgba(119, 184, 255, 0.17);
          transform: translateZ(8px);
        }

        .ai-robot-emoji {
          position: relative;
          z-index: 2;
          font-size: 38px;
          filter: drop-shadow(0 8px 9px rgba(0,0,0,0.45));
          transform: translateZ(22px);
        }

        .ai-robot-eye {
          position: absolute;
          top: 31px;
          width: 7px;
          height: 4px;
          border-radius: 50%;
          background: #8fe1ff;
          box-shadow: 0 0 7px #75d8ff, 0 0 15px rgba(117,216,255,0.65);
          opacity: 0.8;
          transform: translateZ(28px);
          animation: robotEyeBlink 4.5s infinite;
        }

        .ai-robot-eye.eye-left { left: 24px; }
        .ai-robot-eye.eye-right { right: 24px; }

        .ai-robot-label {
          margin-top: 9px;
          padding: 4px 8px;
          border: 1px solid rgba(126, 191, 255, 0.18);
          border-radius: 999px;
          color: #8ea9d7;
          background: rgba(45, 87, 145, 0.08);
          font-size: 6px;
          font-weight: 850;
          letter-spacing: 1.6px;
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.05);
        }

        .ai-welcome h2 {
          margin: 0;
          font-size: clamp(22px, 2.5vw, 31px);
          font-weight: 850;
          letter-spacing: -1px;
          line-height: 1.2;
          background:
            linear-gradient(
              90deg,
              #ffffff 0%,
              #d0c1ff 42%,
              #8ccfff 100%
            );
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          filter: drop-shadow(
            0 5px 18px rgba(126, 85, 255, 0.15)
          );
        }

        .ai-welcome p {
          max-width: 570px;
          margin: 13px auto 0;
          color: #7f889f;
          font-size: 11px;
          line-height: 1.8;
        }

        .ai-quick-actions {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 8px;
          margin-top: 25px;
        }

        .ai-quick-action {
          position: relative;
          overflow: hidden;
          padding: 9px 12px;
          border: 1px solid rgba(255, 255, 255, 0.075);
          border-radius: 10px;
          color: #a3abc0;
          background:
            linear-gradient(
              145deg,
              rgba(255,255,255,0.045),
              rgba(255,255,255,0.018)
            );
          box-shadow:
            0 8px 20px rgba(0,0,0,0.12),
            inset 0 1px 0 rgba(255,255,255,0.04);
          cursor: pointer;
          font-size: 9px;
          transition: all 0.25s ease;
          backdrop-filter: blur(10px);
        }

        .ai-quick-action:hover {
          transform:
            translateY(-3px)
            perspective(400px)
            rotateX(3deg);
          border-color: rgba(137, 102, 255, 0.42);
          color: #eee9ff;
          background:
            linear-gradient(
              145deg,
              rgba(122, 88, 255, 0.15),
              rgba(72, 120, 255, 0.07)
            );
          box-shadow:
            0 12px 30px rgba(72, 49, 175, 0.18),
            0 0 18px rgba(111, 77, 255, 0.08);
        }

        /* =========================
           CHAT MESSAGES
        ========================= */

        .ai-message-list {
          display: flex;
          flex-direction: column;
          gap: 18px;
          max-width: 900px;
          margin: 0 auto;
        }

        .ai-message-row {
          display: flex;
          gap: 11px;
          animation: messageAppear 0.35s ease both;
        }

        .ai-message-row.user {
          justify-content: flex-end;
        }

        .ai-message-avatar {
          position: relative;
          flex: 0 0 32px;
          width: 32px;
          height: 32px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          font-size: 12px;
          font-weight: 850;
          background:
            radial-gradient(
              circle at 30% 25%,
              #dcd2ff,
              #8258ff 40%,
              #382083 78%
            );
          box-shadow:
            0 5px 20px rgba(96, 65, 220, 0.3),
            inset 0 1px 0 rgba(255,255,255,0.2);
        }

        .ai-message-avatar::before {
          content: "";
          position: absolute;
          inset: -3px;
          border-radius: 12px;
          border: 1px solid rgba(132, 99, 255, 0.22);
          pointer-events: none;
        }

        .ai-message-avatar.ai-robot-avatar {
          border-radius: 11px;
          font-size: 18px;
          background:
            radial-gradient(circle at 35% 22%, #ffffff 0%, #d6c9ff 8%, #8b5fff 30%, #4220a7 65%, #12082f 100%);
          box-shadow:
            0 8px 24px rgba(104, 70, 239, 0.32),
            0 0 20px rgba(123, 87, 255, 0.15),
            inset 2px 2px 5px rgba(255,255,255,0.2),
            inset -4px -5px 8px rgba(0,0,0,0.34);
          transform-style: preserve-3d;
          animation: avatarFloat 3s ease-in-out infinite;
        }

        .ai-message-avatar.ai-robot-avatar::after {
          content: "";
          position: absolute;
          inset: -5px;
          border-radius: 14px;
          border: 1px solid rgba(143, 110, 255, 0.28);
          box-shadow: 0 0 14px rgba(115, 80, 255, 0.14);
          animation: avatarRing 2.7s ease-in-out infinite;
        }

        .ai-message-avatar.user-avatar {
          background:
            linear-gradient(
              145deg,
              #30384e,
              #171b2b
            );
          color: #aeb8d0;
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.07);
        }

        .ai-message-content {
          position: relative;
          max-width: min(78%, 680px);
          padding: 13px 15px;
          border: 1px solid rgba(255, 255, 255, 0.065);
          border-radius: 14px;
          color: #c8cede;
          background:
            linear-gradient(
              145deg,
              rgba(255,255,255,0.045),
              rgba(255,255,255,0.018)
            );
          box-shadow:
            0 10px 25px rgba(0,0,0,0.15),
            inset 0 1px 0 rgba(255,255,255,0.035);
          font-size: 11px;
          line-height: 1.75;
          white-space: pre-wrap;
          overflow-wrap: anywhere;
          backdrop-filter: blur(12px);
        }

        .ai-message-row.user .ai-message-content {
          border-color: rgba(104, 82, 208, 0.27);
          color: #e6e9f4;
          background:
            linear-gradient(
              145deg,
              rgba(110, 81, 226, 0.17),
              rgba(64, 89, 194, 0.08)
            );
          box-shadow:
            0 12px 30px rgba(58, 42, 143, 0.14),
            inset 0 1px 0 rgba(255,255,255,0.05);
        }

        .ai-message-time {
          margin-top: 7px;
          color: #555e74;
          font-size: 7px;
        }

        .ai-thinking {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: #a293da;
        }

        .ai-thinking-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #9679ff;
          box-shadow: 0 0 7px rgba(150,121,255,0.8);
          animation: aiThinking 1.1s infinite ease-in-out;
        }

        .ai-thinking-dot:nth-child(2) {
          animation-delay: 0.15s;
        }

        .ai-thinking-dot:nth-child(3) {
          animation-delay: 0.3s;
        }

        /* =========================
           COMPOSER
        ========================= */

        .ai-composer-wrap {
          position: relative;
          padding: 15px 20px 19px;
          border-top: 1px solid rgba(255, 255, 255, 0.055);
          background:
            linear-gradient(
              180deg,
              rgba(8, 10, 19, 0.32),
              rgba(7, 9, 17, 0.92)
            );
          backdrop-filter: blur(20px);
        }

        .ai-composer {
          position: relative;
          display: flex;
          align-items: flex-end;
          gap: 10px;
          max-width: 900px;
          margin: 0 auto;
          padding: 8px 8px 8px 14px;
          border: 1px solid rgba(132, 103, 255, 0.25);
          border-radius: 16px;
          background:
            linear-gradient(
              145deg,
              rgba(25, 25, 46, 0.95),
              rgba(12, 14, 27, 0.95)
            );
          box-shadow:
            0 15px 40px rgba(0,0,0,0.24),
            0 0 30px rgba(85, 65, 190, 0.07),
            inset 0 1px 0 rgba(255, 255, 255, 0.05),
            inset 0 -1px 0 rgba(90, 64, 180, 0.08);
          transition: all 0.25s ease;
        }

        .ai-composer::before {
          content: "";
          position: absolute;
          inset: -1px;
          border-radius: 17px;
          background:
            linear-gradient(
              110deg,
              rgba(143,102,255,0.0),
              rgba(143,102,255,0.2),
              rgba(79,154,255,0.0)
            );
          opacity: 0;
          z-index: -1;
          transition: opacity 0.25s ease;
        }

        .ai-composer:focus-within {
          border-color: rgba(145, 112, 255, 0.52);
          box-shadow:
            0 15px 45px rgba(65, 47, 160, 0.2),
            0 0 35px rgba(91, 70, 207, 0.13),
            inset 0 1px 0 rgba(255, 255, 255, 0.06);
        }

        .ai-composer:focus-within::before {
          opacity: 1;
        }

        .ai-input {
          flex: 1;
          min-width: 0;
          min-height: 42px;
          max-height: 130px;
          resize: vertical;
          border: 0;
          outline: none;
          color: #e9ecf5;
          background: transparent;
          font: inherit;
          font-size: 11px;
          line-height: 1.6;
        }

        .ai-input::placeholder {
          color: #555e73;
        }

        .ai-send-button {
          position: relative;
          flex: 0 0 auto;
          width: 41px;
          height: 41px;
          border: 0;
          border-radius: 12px;
          color: #ffffff;
          background:
            linear-gradient(
              145deg,
              #815bff,
              #4d80ff
            );
          cursor: pointer;
          font-size: 15px;
          box-shadow:
            0 8px 24px rgba(86, 69, 214, 0.35),
            inset 0 1px 0 rgba(255,255,255,0.2);
          transition: all 0.22s ease;
        }

        .ai-send-button:hover:not(:disabled) {
          transform:
            translateY(-2px)
            scale(1.035);
          filter: brightness(1.12);
          box-shadow:
            0 11px 28px rgba(86, 69, 214, 0.45),
            0 0 18px rgba(105, 80, 255, 0.22);
        }

        .ai-send-button:active:not(:disabled) {
          transform: translateY(0) scale(0.97);
        }

        .ai-send-button:disabled {
          cursor: not-allowed;
          opacity: 0.35;
        }

        .ai-composer-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          max-width: 900px;
          margin: 7px auto 0;
          color: #555e73;
          font-size: 7px;
        }

        .ai-context-indicator {
          display: inline-flex;
          align-items: center;
          gap: 5px;
        }

        .ai-context-indicator.active {
          color: #7eabff;
        }

        .ai-context-indicator-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #667087;
        }

        .ai-context-indicator.active .ai-context-indicator-dot {
          background: #6397ff;
          box-shadow: 0 0 8px rgba(99, 151, 255, 0.8);
        }

        /* =========================
           CONTEXT PANEL
        ========================= */

        .ai-context-panel {
          position: relative;
          z-index: 1;
          min-width: 0;
          padding: 18px;
          border-left: 1px solid rgba(255, 255, 255, 0.065);
          background:
            linear-gradient(
              180deg,
              rgba(13, 14, 27, 0.72),
              rgba(6, 8, 16, 0.65)
            );
          backdrop-filter: blur(18px);
        }

        .ai-context-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          margin-bottom: 14px;
        }

        .ai-context-header-title {
          margin: 0;
          color: #aeb5c8;
          font-size: 9px;
          font-weight: 850;
          letter-spacing: 1.25px;
          text-transform: uppercase;
        }

        .ai-context-toggle {
          width: 30px;
          height: 19px;
          position: relative;
          padding: 0;
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.08);
          cursor: pointer;
          transition: all 0.22s ease;
        }

        .ai-context-toggle.active {
          background:
            linear-gradient(
              90deg,
              rgba(106, 82, 222, 0.65),
              rgba(67, 128, 255, 0.5)
            );
          box-shadow: 0 0 14px rgba(93, 83, 220, 0.22);
        }

        .ai-context-toggle span {
          position: absolute;
          top: 3px;
          left: 3px;
          width: 11px;
          height: 11px;
          border-radius: 50%;
          background: #7d8498;
          box-shadow: 0 1px 4px rgba(0,0,0,0.35);
          transition: transform 0.2s ease;
        }

        .ai-context-toggle.active span {
          transform: translateX(11px);
          background: #ffffff;
          box-shadow:
            0 0 7px rgba(255,255,255,0.5);
        }

        .ai-incident-card {
          position: relative;
          overflow: hidden;
          padding: 14px;
          border: 1px solid rgba(102, 124, 255, 0.2);
          border-radius: 15px;
          background:
            linear-gradient(
              145deg,
              rgba(68, 76, 154, 0.16),
              rgba(34, 40, 76, 0.07)
            );
          box-shadow:
            0 12px 30px rgba(0,0,0,0.17),
            inset 0 1px 0 rgba(255,255,255,0.045);
        }

        .ai-incident-card::before {
          content: "";
          position: absolute;
          width: 100px;
          height: 100px;
          top: -55px;
          right: -45px;
          border-radius: 50%;
          background: rgba(92, 117, 255, 0.12);
          filter: blur(25px);
        }

        .ai-incident-id {
          position: relative;
          color: #8291ff;
          font-size: 8px;
          font-weight: 850;
          letter-spacing: 0.9px;
        }

        .ai-incident-title {
          position: relative;
          margin: 7px 0 12px;
          color: #e1e5f2;
          font-size: 11px;
          font-weight: 750;
          line-height: 1.45;
        }

        .ai-incident-meta {
          position: relative;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }

        .ai-meta-item {
          padding: 8px;
          border: 1px solid rgba(255,255,255,0.035);
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.027);
        }

        .ai-meta-label {
          color: #5e667b;
          font-size: 7px;
          text-transform: uppercase;
        }

        .ai-meta-value {
          margin-top: 3px;
          color: #aeb6ca;
          font-size: 8px;
          font-weight: 750;
        }

        .ai-no-incident {
          padding: 17px 12px;
          border: 1px dashed rgba(255, 255, 255, 0.1);
          border-radius: 13px;
          color: #616a80;
          background: rgba(255,255,255,0.012);
          text-align: center;
          font-size: 9px;
          line-height: 1.7;
        }

        .ai-context-note {
          position: relative;
          margin-top: 12px;
          color: #555e73;
          font-size: 7px;
          line-height: 1.7;
        }

        .ai-capabilities {
          margin-top: 25px;
        }

        .ai-capability {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 9px;
          color: #727b90;
          font-size: 8px;
          transition: color 0.2s ease;
        }

        .ai-capability:hover {
          color: #b0b7ca;
        }

        .ai-capability-icon {
          width: 22px;
          height: 22px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(126, 99, 255, 0.15);
          border-radius: 7px;
          background:
            linear-gradient(
              145deg,
              rgba(126, 99, 255, 0.08),
              rgba(69, 118, 255, 0.035)
            );
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.035);
          font-size: 9px;
        }

        /* =========================
           ANIMATIONS
        ========================= */

        @keyframes aiOrbFloat {
          0%,
          100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-5px);
          }
        }

        @keyframes mainOrbFloat {
          0%,
          100% {
            transform: translateY(0) rotateX(0deg);
          }

          50% {
            transform: translateY(-7px) rotateX(4deg);
          }
        }

        @keyframes aiOrbPulse {
          0%,
          100% {
            opacity: 0.35;
            transform: scale(0.94);
          }

          50% {
            opacity: 0.8;
            transform: scale(1.06);
          }
        }

        @keyframes orbGlow {
          0%,
          100% {
            opacity: 0.55;
            transform: scale(0.95);
          }

          50% {
            opacity: 0.9;
            transform: scale(1.08);
          }
        }

        @keyframes miniOrbit {
          from {
            transform:
              rotateX(65deg)
              rotateZ(0deg);
          }

          to {
            transform:
              rotateX(65deg)
              rotateZ(360deg);
          }
        }

        @keyframes orbitRotateOne {
          from {
            transform:
              rotateX(68deg)
              rotateZ(0deg);
          }

          to {
            transform:
              rotateX(68deg)
              rotateZ(360deg);
          }
        }

        @keyframes orbitRotateTwo {
          from {
            transform:
              rotateX(67deg)
              rotateY(35deg)
              rotateZ(0deg);
          }

          to {
            transform:
              rotateX(67deg)
              rotateY(35deg)
              rotateZ(360deg);
          }
        }

        @keyframes orbitRotateThree {
          from {
            transform:
              rotateX(68deg)
              rotateZ(0deg);
          }

          to {
            transform:
              rotateX(68deg)
              rotateZ(360deg);
          }
        }

        @keyframes aiOrbit {
          from {
            transform:
              rotate(0deg)
              translateX(45px)
              rotate(0deg);
          }

          to {
            transform:
              rotate(360deg)
              translateX(45px)
              rotate(-360deg);
          }
        }

        @keyframes statusPulse {
          0%,
          100% {
            opacity: 1;
            transform: scale(1);
          }

          50% {
            opacity: 0.55;
            transform: scale(0.78);
          }
        }

        @keyframes aiThinking {
          0%,
          80%,
          100% {
            opacity: 0.35;
            transform: translateY(0);
          }

          40% {
            opacity: 1;
            transform: translateY(-3px);
          }
        }

        @keyframes messageAppear {
          from {
            opacity: 0;
            transform: translateY(7px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes robotBadgeFloat {
          0%, 100% { transform: translateY(0) rotateX(0deg) rotateY(0deg); }
          50% { transform: translateY(-4px) rotateX(3deg) rotateY(-4deg); }
        }

        @keyframes robotFaceTilt {
          0%, 100% { transform: translateZ(20px) rotateY(0deg); }
          50% { transform: translateZ(20px) rotateY(-7deg) rotateZ(2deg); }
        }

        @keyframes robotRingOne {
          from { transform: rotateX(67deg) rotateZ(12deg) rotate(0deg) translateZ(3px); }
          to { transform: rotateX(67deg) rotateZ(12deg) rotate(360deg) translateZ(3px); }
        }

        @keyframes robotRingTwo {
          from { transform: rotateX(68deg) rotateY(28deg) rotate(0deg); }
          to { transform: rotateX(68deg) rotateY(28deg) rotate(360deg); }
        }

        @keyframes sparkFloat {
          0%, 100% { transform: translate3d(0,0,0) scale(0.85); opacity: 0.45; }
          50% { transform: translate3d(2px,-5px,8px) scale(1.15); opacity: 1; }
        }

        @keyframes particleDrift {
          0%, 100% { transform: translate3d(0, 0, 0) scale(0.7); opacity: 0.18; }
          25% { transform: translate3d(18px, -22px, 35px) scale(1); opacity: 0.6; }
          55% { transform: translate3d(-12px, -42px, 70px) scale(0.8); opacity: 0.32; }
          80% { transform: translate3d(22px, -15px, 25px) scale(1.15); opacity: 0.55; }
        }

        @keyframes hologramSweep {
          0%, 100% { opacity: 0.08; transform: translateX(-20px) rotate(-9deg) scaleX(0.75); }
          50% { opacity: 0.32; transform: translateX(65px) rotate(-9deg) scaleX(1); }
        }

        @keyframes avatarFloat {
          0%, 100% { transform: translateY(0) rotateX(0deg); }
          50% { transform: translateY(-2px) rotateX(5deg); }
        }

        @keyframes avatarRing {
          0%, 100% { transform: scale(0.94); opacity: 0.35; }
          50% { transform: scale(1.08); opacity: 0.9; }
        }

        @keyframes miniRobotPulse {
          0%, 100% { transform: translateZ(0) scale(1); box-shadow: inset 0 1px 0 rgba(255,255,255,0.08), 0 0 15px rgba(111,78,255,0.08); }
          50% { transform: translateZ(5px) scale(1.05); box-shadow: inset 0 1px 0 rgba(255,255,255,0.1), 0 0 22px rgba(111,78,255,0.2); }
        }

        @keyframes heroRobotFloat {
          0%, 100% { transform: translate3d(0, 0, 0) rotateX(0deg) rotateY(0deg); }
          50% { transform: translate3d(0, -7px, 20px) rotateX(5deg) rotateY(-7deg); }
        }

        @keyframes robotEyeBlink {
          0%, 43%, 47%, 100% { transform: translateZ(28px) scaleY(1); }
          45% { transform: translateZ(28px) scaleY(0.1); }
        }

        @keyframes ambientFloatOne {
          0%,
          100% {
            transform: translate(0, 0);
          }

          50% {
            transform: translate(80px, 40px);
          }
        }

        @keyframes ambientFloatTwo {
          0%,
          100% {
            transform: translate(0, 0);
          }

          50% {
            transform: translate(-60px, -35px);
          }
        }

        /* =========================
           RESPONSIVE
        ========================= */

        @media (max-width: 1180px) {
          .ai-workspace {
            grid-template-columns: 205px minmax(0, 1fr);
          }

          .ai-context-panel {
            display: none;
          }
        }

        @media (max-width: 820px) {
          .ai-page-header {
            align-items: flex-start;
          }

          .ai-workspace {
            grid-template-columns: 1fr;
          }

          .ai-history-panel {
            display: none;
          }

          .ai-messages {
            padding: 20px 15px;
          }

          .ai-composer-wrap {
            padding-left: 12px;
            padding-right: 12px;
          }

          .ai-main-orb-wrap {
            transform: scale(0.88);
            margin-bottom: 10px;
          }
        }

        @media (max-width: 560px) {
          .ai-page-header {
            padding: 15px;
          }

          .ai-header-title {
            font-size: 16px;
          }

          .ai-header-subtitle {
            font-size: 10px;
          }

          .ai-status-pill {
            padding: 7px 9px;
            font-size: 9px;
          }

          .ai-mini-orb-wrap {
            width: 43px;
            height: 43px;
          }

          .ai-mini-orb {
            inset: 6px;
          }

          .ai-welcome {
            margin-top: 10px;
          }

          .ai-welcome h2 {
            font-size: 21px;
          }

          .ai-quick-actions {
            gap: 6px;
          }

          .ai-message-content {
            max-width: 88%;
          }

          .ai-session-subtitle {
            display: none;
          }

          .ai-context-badge {
            font-size: 7px;
            padding: 6px 7px;
          }

          .ai-composer-footer {
            font-size: 6px;
          }
        }

        @media (max-width: 700px) {
          .ai-robot-badge {
            width: 50px;
            height: 50px;
            flex-basis: 50px;
            border-radius: 16px;
          }

          .ai-robot-face {
            font-size: 25px;
          }

          .ai-robot-ring.ring-a {
            width: 45px;
            margin-left: -22.5px;
          }

          .ai-session-heading {
            min-width: 0;
          }

          .ai-session-robot {
            width: 23px;
            height: 23px;
            font-size: 13px;
          }
        }
      `}</style>

      <section className="ai-insights-page">
        <header className="ai-page-header">
          <div className="ai-header-left">
            <div className="ai-robot-badge" aria-label="IncidentFlow AI Copilot">
              <span className="ai-robot-face">🤖</span>
              <span className="ai-robot-ring ring-a" />
              <span className="ai-robot-ring ring-b" />
              <span className="ai-robot-spark spark-a">✦</span>
              <span className="ai-robot-spark spark-b">·</span>
            </div>

            <div className="ai-mini-orb-wrap">
              <div className="ai-mini-orb" />
              <div className="ai-mini-orbit" />
            </div>

            <div>
              <h1 className="ai-header-title">
                IncidentFlow AI
              </h1>

              <p className="ai-header-subtitle">
                AI-powered developer copilot for incident
                resolution
              </p>
            </div>
          </div>

          <div className="ai-status-pill">
            <span className="ai-status-dot" />
            AI Online
          </div>
        </header>

        <div className="ai-workspace">
          <div className="ai-3d-particles" aria-hidden="true">
            <span className="particle p1" />
            <span className="particle p2" />
            <span className="particle p3" />
            <span className="particle p4" />
            <span className="particle p5" />
            <span className="particle p6" />
            <span className="particle p7" />
            <span className="particle p8" />
          </div>

          <div className="ai-hologram-line line-one" aria-hidden="true" />
          <div className="ai-hologram-line line-two" aria-hidden="true" />

          <aside className="ai-history-panel">
            <p className="ai-panel-label">
              Conversations
            </p>

            <button
              type="button"
              className="ai-new-chat-button"
              onClick={handleNewChat}
            >
              ＋ New Chat
            </button>

            <div className="ai-history-list">
              {conversations.map((conversation) => (
                <button
                  key={conversation.id}
                  type="button"
                  className="ai-history-item"
                  onClick={() =>
                    handleConversationClick(conversation)
                  }
                >
                  <span className="ai-history-title">
                    {conversation.title}
                  </span>

                  <span className="ai-history-time">
                    {conversation.time}
                  </span>
                </button>
              ))}
            </div>

            <div className="ai-history-bottom">
              <button
                type="button"
                className="ai-save-button"
                onClick={handleSaveConversation}
              >
                Save Conversation
              </button>

              <button
                type="button"
                className="ai-clear-button"
                onClick={handleClearChat}
              >
                Clear Chat
              </button>
            </div>
          </aside>

          <section className="ai-chat-panel">
            <div className="ai-chat-topbar">
              <div className="ai-session-heading">
                <span className="ai-session-robot">🤖</span>
                <div>
                  <div className="ai-session-title">
                    {currentConversationTitle}
                  </div>

                  <div className="ai-session-subtitle">
                    Developer troubleshooting session
                  </div>
                </div>
              </div>

              <div className="ai-context-badge">
                ◈{" "}
                {selectedIncident
                  ? "Incident Context Active"
                  : "No Incident Selected"}
              </div>
            </div>

            <div className="ai-messages">
              {messages.length === 0 ? (
                <div className="ai-welcome">
                  <div className="ai-main-orb-wrap">
                    <div className="ai-main-orb-glow" />
                    <div className="ai-orbit-ring one" />
                    <div className="ai-orbit-ring two" />
                    <div className="ai-orbit-ring three" />
                    <div className="ai-main-orb" />
                    <div className="ai-orbit-dot" />
                    <div className="ai-orbit-dot blue" />
                  </div>

                  <div className="ai-robot-welcome" aria-hidden="true">
                    <div className="ai-robot-plate">
                      <span className="ai-robot-emoji">🤖</span>
                      <span className="ai-robot-eye eye-left" />
                      <span className="ai-robot-eye eye-right" />
                    </div>
                    <span className="ai-robot-label">AI COPILOT ONLINE</span>
                  </div>

                  <h2>
                    ✦ IncidentFlow AI — Your AI Copilot
                    for Incident Resolution.
                  </h2>

                  <p>
                    Diagnose incidents, debug technical
                    problems, identify possible root causes,
                    and get practical developer-focused
                    troubleshooting guidance.
                  </p>

                  <div className="ai-quick-actions">
                    {quickActions.map((action) => (
                      <button
                        key={action.label}
                        type="button"
                        className="ai-quick-action"
                        onClick={() =>
                          handleQuickAction(action.label)
                        }
                      >
                        {action.icon} {action.label}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="ai-message-list">
                  {messages.map((chatMessage) => (
                    <div
                      key={chatMessage.id}
                      className={`ai-message-row ${chatMessage.role}`}
                    >
                      {chatMessage.role === "ai" && (
                        <div className="ai-message-avatar ai-robot-avatar" title="IncidentFlow AI">
                          🤖
                        </div>
                      )}

                      <div className="ai-message-content">
                        {chatMessage.content}

                        <div className="ai-message-time">
                          {chatMessage.time}
                        </div>
                      </div>

                      {chatMessage.role === "user" && (
                        <div className="ai-message-avatar user-avatar">
                          U
                        </div>
                      )}
                    </div>
                  ))}

                  {isThinking && (
                    <div className="ai-message-row">
                      <div className="ai-message-avatar ai-robot-avatar" title="IncidentFlow AI">
                        🤖
                      </div>

                      <div className="ai-message-content">
                        <div className="ai-thinking">
                          <span>AI is thinking</span>

                          <span className="ai-thinking-dot" />
                          <span className="ai-thinking-dot" />
                          <span className="ai-thinking-dot" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="ai-composer-wrap">
              <div className="ai-composer">
                <textarea
                  className="ai-input"
                  value={message}
                  onChange={(event) =>
                    setMessage(event.target.value)
                  }
                  onKeyDown={(event) => {
                    if (
                      event.key === "Enter" &&
                      !event.shiftKey
                    ) {
                      event.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Ask IncidentFlow AI about an incident, error, API, database, deployment..."
                  rows={1}
                />

                <button
                  type="button"
                  className="ai-send-button"
                  onClick={handleSend}
                  disabled={
                    !message.trim() || isThinking
                  }
                  aria-label="Send message"
                >
                  ➤
                </button>
              </div>

              <div className="ai-composer-footer">
                <span
                  className={`ai-context-indicator ${
                    selectedIncident ? "active" : ""
                  }`}
                >
                  <span className="ai-context-indicator-dot" />

                  {selectedIncident
                    ? "Incident context included"
                    : "No incident context"}
                </span>

                <span>
                  Enter to send · Shift + Enter for new line
                </span>
              </div>
            </div>
          </section>

          <aside className="ai-context-panel">
            <div className="ai-context-header">
              <h3 className="ai-context-header-title">
                Incident Context
              </h3>

              <button
                type="button"
                className={`ai-context-toggle ${
                  selectedIncident ? "active" : ""
                }`}
                onClick={() =>
                  setSelectedIncident(
                    (previous) => !previous,
                  )
                }
                aria-label="Toggle incident context"
              >
                <span />
              </button>
            </div>

            {selectedIncident ? (
              <div className="ai-incident-card">
                <div className="ai-incident-id">
                  INC-102
                </div>

                <div className="ai-incident-title">
                  Payment API returning 500
                </div>

                <div className="ai-incident-meta">
                  <div className="ai-meta-item">
                    <div className="ai-meta-label">
                      Severity
                    </div>

                    <div className="ai-meta-value">
                      HIGH
                    </div>
                  </div>

                  <div className="ai-meta-item">
                    <div className="ai-meta-label">
                      Status
                    </div>

                    <div className="ai-meta-value">
                      OPEN
                    </div>
                  </div>
                </div>

                <p className="ai-context-note">
                  This incident will be included as context
                  when asking the AI about the problem.
                </p>
              </div>
            ) : (
              <div className="ai-no-incident">
                No incident selected.
                <br />
                Enable context when you want the AI to
                reason about a specific IncidentFlow
                incident.
              </div>
            )}

            <div className="ai-capabilities">
              <p className="ai-panel-label">
                Copilot Capabilities
              </p>

              <div className="ai-capability">
                <span className="ai-capability-icon">
                  ◉
                </span>
                Incident diagnosis
              </div>

              <div className="ai-capability">
                <span className="ai-capability-icon">
                  &lt;/&gt;
                </span>
                Code debugging
              </div>

              <div className="ai-capability">
                <span className="ai-capability-icon">
                  ◇
                </span>
                Root-cause analysis
              </div>

              <div className="ai-capability">
                <span className="ai-capability-icon">
                  ⚙
                </span>
                Fix suggestions
              </div>

              <div className="ai-capability">
                <span className="ai-capability-icon">
                  ⚡
                </span>
                Performance analysis
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}

export default AIInsights;