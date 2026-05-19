<div align="center">

<br/>

<pre align="center">
 ██╗  ██╗███████╗███╗   ██╗    ██╗    ██╗ ██████╗ ██████╗ ██╗  ██╗
 ██║  ██║██╔════╝████╗  ██║    ██║    ██║██╔═══██╗██╔══██╗██║ ██╔╝
 ███████║█████╗  ██╔██╗ ██║    ██║ █╗ ██║██║   ██║██████╔╝█████╔╝ 
 ██╔══██║██╔══╝  ██║╚██╗██║    ██║███╗██║██║   ██║██╔══██╗██╔═██╗ 
 ██║  ██║███████╗██║ ╚████║    ╚███╔███╔╝╚██████╔╝██║  ██║██║  ██╗
 ╚═╝  ╚═╝╚══════╝╚═╝  ╚═══╝     ╚══╝╚══╝  ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝
</pre>

**A modern, full-stack collaborative task management system**  
*built to streamline team workflows with real-time capabilities.*

<br/>

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-Realtime-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-F59E0B?style=for-the-badge)](LICENSE)
[![React Doctor](https://www.react.doctor/share/badge?p=client&s=90&w=147&f=21)](https://www.react.doctor/share?p=client&s=90&w=147&f=21)

<br/>

</div>

---

## ✨ Overview

TaskManager is a **production-ready, multi-tenant task management platform** designed for modern agile teams. It combines a powerful Kanban-based workflow engine with real-time collaboration, strict privacy controls, and a clean, intuitive UI — giving your team everything it needs to ship faster.

---

## 🌟 Features & Rules

### 🚀 What HenWork Can Do
* 🏢 **Multi-Tenant Workspaces**: Keep your businesses, agencies, and side projects organized in completely separate workspaces.
* 📋 **Visual Kanban Boards**: Move tasks easily across **To Do**, **In Progress**, and **Completed** lists. The layout automatically stacks on mobile screens so you never lose visibility.
* 💬 **Team Collaboration**: Comment on tasks in real time, star important replies, and check your `@mentions` directly on your dashboard.
* 📎 **File Attachments**: Upload documents and images (up to **25MB**) directly inside any task details view.
* ⚡ **Instant Skeleton Loaders**: Pages load instantly on refresh using beautiful, smooth skeleton frameworks instead of blocky loading screens.
* 🎨 **Stunning Aesthetics**: Premium glassmorphic styling, calming colors, and a silent background video wallpaper.

---

### 🛡️ Core Rules We Follow
We built HenWork with strict rules to keep the app secure, fast, and light:

* 🧠 **No Memory Leaks (React Doctor)**: Every real-time database listener, timer, or event listener is automatically cleaned up when a page closes. This keeps the application incredibly fast and lightweight.
* 🔒 **Strict Privacy for Members (PII Rule)**: Regular team members see anonymous profiles to protect user privacy. Only organization **Admins** have full permission to see real names, emails, and profile pictures.
* 🛡️ **Safe & Spam-Protected**: Enforces healthy rate limits on database actions to keep performance high and prevent spam.

---

## 🛠️ Tech Stack

<table>
<tr>
<td valign="top" width="50%">

### 🖥️ Frontend
- ⚛️ **React.js 18** — via Vite (lightning-fast HMR)
- 🎨 **Tailwind CSS** — utility-first styling
- 🧩 **shadcn/ui** — accessible, designed components
- 🔄 **TanStack Query** — async state & caching
- 🔁 **React Router** — client-side routing
- 🖼️ **Lucide React** — beautiful iconography

</td>
<td valign="top" width="50%">

### ⚙️ Backend
- 🟢 **Node.js & Express.js** — RESTful API
- 🐘 **Supabase** — PostgreSQL, Auth, Storage & Realtime
- ✅ **Joi** — strict payload validation

</td>
</tr>
</table>

---

## 📊 Project Insights & Analytics

### 🏥 React Health Report
Our frontend is optimized for performance with a **React Doctor Score of 90/100** — ensuring zero memory leaks, efficient rendering, and a lightning-fast user experience.

[![React Doctor Report](https://img.shields.io/badge/React%20Doctor-90%2F100-4CAF50?style=for-the-badge&logo=react&logoColor=white)](https://www.react.doctor/share?p=client&s=90&w=147&f=21)

👉 **[View Full React Health Report](https://www.react.doctor/share?p=client&s=90&w=147&f=21)**

---

### 🌐 Architecture Visualization
Explore the complete system architecture and component relationships through our interactive network graph:

[![Henwork Graph Visualization](https://img.shields.io/badge/System%20Architecture-Interactive%20Graph-6366F1?style=for-the-badge&logo=graphql&logoColor=white)](https://shubsolos19.github.io/Henwork-Graph-Visualization/)

👉 **[View Architecture Graph](https://shubsolos19.github.io/Henwork-Graph-Visualization/)**

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- ✅ **Node.js** v18 or higher
- ✅ **npm** or **yarn**
- ✅ A **[Supabase](https://supabase.com/)** account and project

---

### 1️⃣ Environment Setup

**Backend** — Create `.env` in the root directory:

```env
PORT=4000
NODE_ENV=development
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
FRONTEND_URL=http://localhost:3000
```

**Frontend** — Create `.env` in the `/client` directory:

```env
VITE_API_URL=http://localhost:4000/api
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

> ⚠️ **Never commit `.env` files to version control.** Add them to `.gitignore`.

---

### 2️⃣ Installation

```bash
# Install backend dependencies (root directory)
npm install

# Install frontend dependencies
cd client && npm install
```

---

### 3️⃣ Run the Application

Open two terminals and run:

```bash
# Terminal 1 — Backend (root directory)
npm run dev

# Terminal 2 — Frontend (client directory)
cd client && npm run dev
```

| Service | URL |
|---|---|
| 🖥️ Frontend | `http://localhost:3000` or `http://localhost:5173` |
| ⚙️ Backend API | `http://localhost:4000` |

---

## 🔒 Security & Privacy

TaskManager implements the **Enrichment Pattern** for all profile data:

> All Personally Identifiable Information (PII) — names, emails, avatars — is **anonymized at the backend service layer** before reaching the client, unless the requesting user holds an `admin` role within that specific organization.

This ensures regulatory compliance and internal privacy **without** sacrificing application functionality.

---

## 🗺️ Roadmap

Track upcoming features and improvements:

- [ ] 🔍 Task filtering and advanced search
- [ ] 🌿 Sub-tasks and checklists within parent tasks
- [ ] 📜 Activity logs and audit trails for tasks
- [ ] 🔔 Due-date reminders and email notifications
- [ ] 🌙 Dark Mode support across all UI components

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push and open a Pull Request

---

<div align="center">

<br/>

*Built with ❤️ for modern agile teams.*
<br/>

<img src="https://capsule-render.vercel.app/api?type=waving&color=d4af37&height=100&section=footer&animation=fadeIn" width="100%"/>

</div>
