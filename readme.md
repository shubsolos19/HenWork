# TaskManager 📋

A modern, full-stack collaborative task management system built to streamline team workflows, track projects, and organize tasks with powerful real-time capabilities.

![TaskManager Overview](https://via.placeholder.com/800x400.png?text=TaskManager+App)

## 🌟 Key Features

### 🏢 Organizations & Projects
- **Multi-Tenant Architecture**: Create multiple organizations and switch between them seamlessly.
- **Project Workspaces**: Organize tasks into distinct projects under each organization.
- **Role-Based Access Control (RBAC)**: Distinct permissions for `Admin` and `Member` roles.
- **Strict Privacy Controls**: Non-admins see anonymized profiles (roles only), while admins can manage teams and see full identities.

### ✅ Task Management & Kanban
- **Interactive Kanban Boards**: Drag-and-drop or status-based task progression (To Do → In Progress → Completed).
- **Task Assignments**: Assign multiple team members to a single task using robust UUID-based tracking.
- **Task Details**: Rich descriptions, due dates, and priority levels (Low, Medium, High).

### 💬 Collaboration & Real-Time Sync
- **Live Updates**: Instant UI syncing across clients using **Supabase Realtime** for member assignments and task updates.
- **Task Comments**: Built-in discussion threads for individual tasks (with PII masking for non-admins).
- **File Attachments**: Upload documents and images (up to 25MB) directly to tasks using Supabase Storage.

## 🛠️ Technology Stack

**Frontend:**
- **React.js 18** (via Vite for lightning-fast HMR)
- **Tailwind CSS** (for highly customizable utility-first styling)
- **shadcn/ui** (Accessible, beautifully designed React components)
- **React Query (TanStack)** (For powerful asynchronous state management & caching)
- **React Router** (Client-side routing)
- **Lucide React** (Beautiful iconography)

**Backend:**
- **Node.js & Express.js** (RESTful API architecture)
- **Supabase** (PostgreSQL Database, Authentication, Storage, & Realtime Subscriptions)
- **Joi** (Strict payload validation)

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn
- A [Supabase](https://supabase.com/) account and project.

### 1. Environment Setup

Create a `.env` file in the root directory and add your backend/Supabase credentials:

```env
PORT=4000
NODE_ENV=development
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
FRONTEND_URL=http://localhost:3000
```

Create a `.env` file in the `client` directory for the frontend:

```env
VITE_API_URL=http://localhost:4000/api
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. Installation

Install dependencies for both the backend and frontend:

```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
```

### 3. Running the Application

Run the backend and frontend development servers concurrently:

```bash
# Terminal 1: Start the backend server (Root Directory)
npm run dev

# Terminal 2: Start the frontend React app (Client Directory)
cd client
npm run dev
```

The frontend will be available at `http://localhost:3000` (or `http://localhost:5173` depending on your Vite config), and the backend API will run on `http://localhost:4000`.

## 🔒 Security & Privacy Features

TaskManager implements a strict "Enrichment Pattern" for profile data. 
All Personally Identifiable Information (PII) like names, emails, and avatars are anonymized at the backend service layer before being sent to the client, unless the requesting user holds an `admin` role within that specific organization. This ensures regulatory compliance and internal privacy without sacrificing application functionality.

## 🤝 Roadmap & Future Enhancements

- [ ] Task filtering and advanced search functionality.
- [ ] Sub-tasks and checklists within parent tasks.
- [ ] Activity logs (audit trails) for tasks.
- [ ] Due-date reminders and email notifications.
- [ ] Dark Mode support across all UI components.

---
*Built with ❤️ for modern agile teams.*
