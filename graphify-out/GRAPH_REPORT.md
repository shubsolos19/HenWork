# Graph Report - test  (2026-05-14)

## Corpus Check
- 87 files · ~20,941 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 390 nodes · 697 edges · 20 communities (16 shown, 4 thin omitted)
- Extraction: 91% EXTRACTED · 9% INFERRED · 0% AMBIGUOUS · INFERRED: 66 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `c311d9e4`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]

## God Nodes (most connected - your core abstractions)
1. `TaskDetailPage()` - 18 edges
2. `authenticate()` - 16 edges
3. `verifyTaskAccess()` - 16 edges
4. `success()` - 16 edges
5. `organizationsRoutes` - 15 edges
6. `tasksRoutes` - 15 edges
7. `supabase` - 14 edges
8. `cn()` - 14 edges
9. `authRoutes` - 14 edges
10. `projectsRoutes` - 12 edges

## Surprising Connections (you probably didn't know these)
- `ProtectedRoute()` --calls--> `useAuth()`  [INFERRED]
  client/src/App.jsx → client/src/context/AuthContext.jsx
- `PublicRoute()` --calls--> `useAuth()`  [INFERRED]
  client/src/App.jsx → client/src/context/AuthContext.jsx
- `SocialAuth()` --calls--> `useAuth()`  [INFERRED]
  client/src/components/auth/SocialAuth.jsx → client/src/context/AuthContext.jsx
- `AppLayout()` --calls--> `useAuth()`  [INFERRED]
  client/src/components/layout/AppLayout.jsx → client/src/context/AuthContext.jsx
- `AppLayout()` --calls--> `useProfile()`  [INFERRED]
  client/src/components/layout/AppLayout.jsx → client/src/hooks/useProfile.js

## Communities (20 total, 4 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.05
Nodes (53): addComment(), { adminClient }, { anonymizeProfile }, { AppError }, deleteComment(), getTaskComments(), { verifyTaskAccess, verifyCommentAuthor }, { AppError } (+45 more)

### Community 1 - "Community 1"
Cohesion: 0.06
Nodes (61): createUserClient(), { adminClient, createUserClient }, { AppError }, authenticate(), validate(), attachmentController, { authenticate }, express (+53 more)

### Community 2 - "Community 2"
Cohesion: 0.1
Nodes (30): attachmentService, deleteAttachment(), getDownloadUrl(), getTaskAttachments(), { success, created }, uploadAttachment(), authService, { success, created } (+22 more)

### Community 3 - "Community 3"
Cohesion: 0.06
Nodes (35): useDeleteAttachment(), useTaskAttachments(), useUploadAttachment(), useAddComment(), useComments(), useDeleteComment(), useAssignUser(), useCreateTask() (+27 more)

### Community 4 - "Community 4"
Cohesion: 0.1
Nodes (12): LoginPage(), SignupPage(), SocialAuth(), AuthContext, useAuth(), useProfile(), useUpdateProfile(), ProfilePage() (+4 more)

### Community 5 - "Community 5"
Cohesion: 0.11
Nodes (17): 1. Environment Setup, 2. Installation, 3. Running the Application, code:env (PORT=4000), code:env (VITE_API_URL=http://localhost:4000/api), code:bash (# Install backend dependencies), code:bash (# Terminal 1: Start the backend server (Root Directory)), 💬 Collaboration & Real-Time Sync (+9 more)

### Community 6 - "Community 6"
Cohesion: 0.07
Nodes (30): config, cors, corsOptions, dotenv, missing, path, required, { AppError } (+22 more)

### Community 7 - "Community 7"
Cohesion: 0.11
Nodes (19): DashboardPage(), useDashboardStats(), useRecentTasks(), useAddMember(), useCreateOrg(), useDeleteOrg(), useOrganization(), useOrganizations() (+11 more)

### Community 8 - "Community 8"
Cohesion: 0.12
Nodes (11): adminClient, config, { createClient }, supabase, { createClient }, setup(), supabase, { createClient } (+3 more)

### Community 17 - "Community 17"
Cohesion: 0.25
Nodes (7): 🔐 Authentication & Access, 📎 Collaborative Tools, ✅ Current Features, 🗺️ Future Roadmap (Extra Features), ✨ Planned UI/UX Enhancements, 🚀 Project Features & Roadmap, 📋 Task Management

## Knowledge Gaps
- **115 isolated node(s):** `queryClient`, `Input`, `AuthContext`, `api`, `token` (+110 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `useAuth()` connect `Community 4` to `Community 3`, `Community 7`?**
  _High betweenness centrality (0.313) - this node is a cross-community bridge._
- **Why does `app` connect `Community 4` to `Community 1`, `Community 6`?**
  _High betweenness centrality (0.309) - this node is a cross-community bridge._
- **Are the 17 inferred relationships involving `TaskDetailPage()` (e.g. with `useAuth()` and `useTask()`) actually correct?**
  _`TaskDetailPage()` has 17 INFERRED edges - model-reasoned connections that need verification._
- **What connects `queryClient`, `Input`, `AuthContext` to the rest of the system?**
  _115 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.05 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.06 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._