# 🚨 IncidentFlow AI

### 🤖 AI-Powered Incident Management Platform

IncidentFlow AI is a full-stack incident management platform designed for IT and software teams to **create, track, analyze, and resolve incidents** with the help of AI-powered assistance.

🌐 **Live Demo:** https://incidentflow-ai.netlify.app/
💻 **GitHub:** https://github.com/ashlesa298/incidentflow-ai

---

## ✨ Features

* 🚨 **Incident Management** — Create, update, track, and manage incidents
* 🔐 **Secure Authentication** — JWT authentication with Spring Security
* 👥 **Multiple Roles** — Admin, Manager, Support Agent, Developer, and Customer
* 📊 **Dashboard** — Real-time incident statistics and operational overview
* 📈 **Analytics** — Incident status, severity, workload, and resolution metrics
* 🤖 **AI Copilot** — Ask questions and get AI-powered assistance
* 🧠 **AI Incident Analysis** — AI-assisted incident summaries, root-cause suggestions, and recommended actions
* 📑 **Reports** — Operational reports with CSV export and print support
* 🎨 **Modern UI** — Responsive dark-themed interface with futuristic AI/robot visuals

---

## 🛠️ Tech Stack

### Frontend

* ⚛️ React
* 📘 TypeScript
* ⚡ Vite
* 🎨 CSS

### Backend

* ☕ Java 21
* 🍃 Spring Boot 4.1.1
* 🔐 Spring Security
* 🔑 JWT
* 🗃️ Spring Data JPA
* 🔄 Hibernate
* 📦 Maven

### Database & AI

* 🐘 PostgreSQL 18
* 🤖 Google Gemini API

### Deployment

* ▲ Netlify — Frontend
* 🚀 Render — Backend
* 🐘 Render PostgreSQL — Database
* 🐳 Docker
* 🐙 GitHub

---

## 🏗️ Architecture

```text
             ⚛️ React + TypeScript
                      │
                      │ REST API
                      ▼
              ☕ Spring Boot
                      │
          ┌───────────┼───────────┐
          │           │           │
          ▼           ▼           ▼
       🔐 JWT      🐘 PostgreSQL  🤖 Gemini
     Security        Database       AI
```

---

## 🤖 AI Copilot

The AI Copilot is integrated through the Spring Boot backend.

```text
👤 User
   ↓
⚛️ React AI Copilot
   ↓
☕ Spring Boot REST API
   ↓
🧠 AI Service
   ↓
🤖 Gemini API
   ↓
💬 AI Response
   ↓
👤 User
```

The AI can handle:

* 💬 General questions and conversations
* 👋 Greetings
* 🛠️ Technical questions
* 🚨 Incident-related questions
* 🔍 Incident context
* 💡 Troubleshooting guidance

AI incident analysis can also assist with:

* 📝 Incident summaries
* 🔎 Possible root causes
* 🛠️ Suggested investigation steps
* 💡 Recommended actions

---

## 🔐 Authentication

IncidentFlow AI uses **Spring Security + JWT** for authentication.

```text
👤 Login
   ↓
☕ Spring Boot
   ↓
🔐 Spring Security
   ↓
🔑 JWT Token
   ↓
⚛️ React
   ↓
🔒 Protected API Requests
```

Passwords are securely hashed using **BCrypt** before being stored in PostgreSQL.

---

## 📊 Dashboard & Analytics

The dashboard provides an operational overview including:

* Total incidents
* Open incidents
* In-progress incidents
* Resolved incidents
* Closed incidents
* Severity distribution
* Active workload
* Resolution rate

Analytics are calculated from incident data retrieved from the backend.

---

## 👥 Supported Roles

```text
👑 ADMIN
🧑‍💼 MANAGER
🛠️ SUPPORT_AGENT
👨‍💻 DEVELOPER
👤 CUSTOMER
```

The backend supports registration and authentication for these roles.

---

## 🚀 Running Locally

### Backend

```bash
cd backend
```

Windows:

```cmd
mvnw.cmd spring-boot:run
```

Backend:

```text
http://localhost:8080
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend:

```text
http://localhost:5173
```

### Environment Variables

Backend configuration uses environment variables for sensitive values such as:

```text
DB_PASSWORD
SPRING_DATASOURCE_USERNAME
SPRING_DATASOURCE_URL
JWT_SECRET
GEMINI_API_KEY
```

Frontend:

```text
VITE_API_URL
```

🔒 **Never commit API keys, passwords, or JWT secrets to GitHub.**

---

## 🌍 Live Deployment

### Frontend

🌐 https://incidentflow-ai.netlify.app/

### Backend

🚀 https://incidentflow-backend-25f9.onrender.com

---

## 🔮 Future Enhancements

* 🔔 Real-time notifications
* 📧 Email notifications
* 👥 More granular role-based permissions
* 💬 Incident comments and collaboration
* 📎 File attachments
* 🔎 Advanced incident search and filtering
* 🧠 More advanced AI-powered root-cause analysis
* 📈 Advanced incident trends and insights

---

## 👩‍💻 Developer

### Ashlesa Behera

🎓 B.Tech Computer Science Engineering — 2026

**Java | Spring Boot | React | TypeScript | PostgreSQL | REST APIs | JWT | Generative AI**

---

### ⭐ IncidentFlow AI

**Manage incidents. Understand problems. Resolve faster. 🤖🚀**
