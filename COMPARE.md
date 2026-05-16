# TaskManager vs. Trello: A Comparison 🚀

This document provides a comprehensive comparison between **TaskManager** (this project) and **Trello**, two platforms designed for agile project management and task tracking.

## 📊 Feature Comparison Table

| Feature | TaskManager (This Project) | Trello |
| :--- | :--- | :--- |
| **Core View** | Kanban Board + List View | Kanban Board (Primary) |
| **Organization Structure** | Multi-Organization -> Projects -> Tasks | Workspaces -> Boards -> Lists -> Cards |
| **Privacy Rules** | **Strict Privacy**: Members cannot see other members' PII unless they are admins. | Open Visibility: Workspace members usually see everyone. |
| **Task Assignment** | Multi-user assignment per task with creator/admin restrictions. | Multi-user assignment per card. |
| **Attachments** | Direct Supabase Storage integration (PDF, DOCX, Images). | Trello Storage / Power-Up integrations. |
| **Comments** | Real-time thread-based comments. | Card-based activity/comments. |
| **Real-time Sync** | Powered by Supabase Real-time (PostgreSQL Changes). | Socket-based real-time updates. |
| **Auth Integration** | Google OAuth + Email/Password with automated Profile Sync. | Atlassian Account / Google OAuth. |
| **Access Control** | Role-based (Owner, Admin, Member) + Task Creator permissions. | Board Members, Workspace Admins, Guests. |

## 🛠 Technical Architecture

### TaskManager (This Project)
- **Frontend**: React 19, Vite, Tailwind CSS 4, Radix UI.
- **Backend**: Node.js (Express) with a focus on a "Thin Server" architecture.
- **Database**: PostgreSQL via Supabase.
- **Security**: Supabase Row Level Security (RLS) + JWT Middleware.
- **Philosophy**: Privacy-first. We explicitly mask PII (Names, Avatars) from regular members using the **Enrichment Pattern** in the backend.

### Trello
- **Frontend**: React-based with custom design systems.
- **Backend**: Distributed microservices (Atlassian stack).
- **Database**: Largely MongoDB (historical) and other distributed stores.
- **Philosophy**: Collaboration-first. Trello focuses on board-level flexibility and "Power-Ups" (plugins).

## 🌟 Key Differences & Unique Selling Points

### 1. Privacy-First "Blind" Membership
Unlike Trello, where joining a workspace usually exposes everyone's full identity, TaskManager implements a strict **Enrichment Pattern**. 
- In TaskManager, regular members only see "Member" or "Admin" roles instead of full names or profile pictures in organization lists. 
- Only Admins see the full team identity. This makes TaskManager suitable for external contractors or sensitive client projects.

### 2. Automated OAuth Sync
TaskManager features a unique `syncGoogleProfile` mechanism. The moment you sign in with Google, your profile picture and name are automatically synchronized and updated in our database, ensuring your identity is always current without manual profile editing.

### 3. Lightweight vs. Heavyweight
- **Trello** is a mature, massive ecosystem with thousands of integrations (Power-Ups).
- **TaskManager** is built to be a fast, modern, and lean alternative that prioritizes the core Kanban experience with superior real-time performance and strict data privacy.

## 🏁 Conclusion

While **Trello** is excellent for large-scale enterprise collaboration with many external integrations, **TaskManager** excels as a modern, privacy-conscious alternative for teams that value data isolation and a sleek, real-time experience out of the box.

---
*Built for teams that value both speed and security.*
