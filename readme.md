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

<br/>

</div>

---

## ✨ Overview

TaskManager is a **production-ready, multi-tenant task management platform** designed for modern agile teams. It combines a powerful Kanban-based workflow engine with real-time collaboration, strict privacy controls, and a clean, intuitive UI — giving your team everything it needs to ship faster.

---

## 🌟 Feature Highlights

### 🏢 Organizations & Projects
| Feature | Description |
|---|---|
| **Multi-Tenant Architecture** | Create multiple organizations and switch between them seamlessly |
| **Project Workspaces** | Organize tasks into distinct projects under each organization |
| **Role-Based Access Control** | Distinct permissions for `Admin` and `Member` roles |
| **Strict Privacy Controls** | Non-admins see anonymized profiles; admins manage full identities |

### ✅ Task Management & Kanban
| Feature | Description |
|---|---|
| **Interactive Kanban Boards** | Drag-and-drop task progression: `To Do` → `In Progress` → `Completed` |
| **Task Assignments** | Assign multiple team members using robust UUID-based tracking |
| **Rich Task Details** | Descriptions, due dates, and priority levels (Low / Medium / High) |

### 💬 Collaboration & Real-Time Sync
| Feature | Description |
|---|---|
| **Live Updates** | Instant UI sync via **Supabase Realtime** subscriptions |
| **Task Comments** | Built-in discussion threads with PII masking for non-admins |
| **File Attachments** | Upload documents and images (up to **25MB**) directly to tasks |

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
