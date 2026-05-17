# Graph Report - .  (2026-05-17)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 276 nodes · 496 edges · 17 communities (15 shown, 2 thin omitted)
- Extraction: 88% EXTRACTED · 12% INFERRED · 0% AMBIGUOUS · INFERRED: 62 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `f04a9c57`
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
- [[_COMMUNITY_Community 11|Community 11]]

## God Nodes (most connected - your core abstractions)
1. `verifyTaskAccess()` - 16 edges
2. `cn()` - 14 edges
3. `organizationsRoutes` - 14 edges
4. `tasksRoutes` - 14 edges
5. `supabase` - 13 edges
6. `authRoutes` - 13 edges
7. `success()` - 13 edges
8. `projectsRoutes` - 11 edges
9. `AppError` - 11 edges
10. `verifyOrgMembership()` - 11 edges

## Surprising Connections (you probably didn't know these)
- `ProtectedRoute()` --calls--> `useAuth()`  [INFERRED]
  client/src/App.jsx → client/src/context/AuthContext.jsx
- `PublicRoute()` --calls--> `useAuth()`  [INFERRED]
  client/src/App.jsx → client/src/context/AuthContext.jsx
- `AppLayout()` --calls--> `cn()`  [INFERRED]
  client/src/components/layout/AppLayout.jsx → client/src/lib/utils.js
- `TaskCard()` --calls--> `getPriorityColor()`  [INFERRED]
  client/src/components/tasks/TaskCard.jsx → client/src/lib/utils.js
- `Card()` --calls--> `cn()`  [INFERRED]
  client/src/components/ui/card.jsx → client/src/lib/utils.js

## Communities (17 total, 2 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.07
Nodes (36): { AppError, NotFoundError }, addMember(), { AppError, NotFoundError, ConflictError }, getOrganizationDetails(), getOrganizationMembers(), removeMember(), updateMemberRole(), updateOrganization() (+28 more)

### Community 1 - "Community 1"
Cohesion: 0.07
Nodes (31): useDeleteAttachment(), useTaskAttachments(), useUploadAttachment(), useAddComment(), useComments(), useDeleteComment(), useAssignUser(), useCreateTask() (+23 more)

### Community 2 - "Community 2"
Cohesion: 0.07
Nodes (21): LoginPage(), AuthContext, useAuth(), useDashboardStats(), useRecentTasks(), useAddMember(), useCreateOrg(), useDeleteOrg() (+13 more)

### Community 3 - "Community 3"
Cohesion: 0.13
Nodes (30): createUserClient(), { adminClient, createUserClient }, authenticate(), ctrl, Joi, signInSchema, signUpSchema, updateProfileSchema (+22 more)

### Community 4 - "Community 4"
Cohesion: 0.07
Nodes (25): Expanding the ESLint configuration, TaskManager Client, 🔐 Authentication & Access, 📎 Collaborative Tools, ✅ Current Features, 🗺️ Future Roadmap (Extra Features), ✨ Planned UI/UX Enhancements, 🚀 Project Features & Roadmap (+17 more)

### Community 5 - "Community 5"
Cohesion: 0.11
Nodes (19): cors, corsOptions, dotenv, missing, path, required, { createClient }, supabase (+11 more)

### Community 6 - "Community 6"
Cohesion: 0.22
Nodes (14): adminClient, { success, created }, deleteAttachment(), getDownloadUrl(), getTaskAttachments(), uploadAttachment(), addComment(), deleteComment() (+6 more)

### Community 7 - "Community 7"
Cohesion: 0.32
Nodes (8): orgService, projectService, { success, created, noContent }, taskService, created(), noContent(), paginated(), success()

## Knowledge Gaps
- **55 isolated node(s):** `queryClient`, `Input`, `AuthContext`, `api`, `token` (+50 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `useAuth()` connect `Community 2` to `Community 1`?**
  _High betweenness centrality (0.328) - this node is a cross-community bridge._
- **Why does `app` connect `Community 5` to `Community 2`, `Community 3`?**
  _High betweenness centrality (0.320) - this node is a cross-community bridge._
- **Are the 13 inferred relationships involving `cn()` (e.g. with `AppLayout()` and `TaskCard()`) actually correct?**
  _`cn()` has 13 INFERRED edges - model-reasoned connections that need verification._
- **What connects `queryClient`, `Input`, `AuthContext` to the rest of the system?**
  _55 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.07 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.07 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.07 - nodes in this community are weakly interconnected._