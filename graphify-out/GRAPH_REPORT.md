# Graph Report - .  (2026-05-17)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 424 nodes · 776 edges · 23 communities (16 shown, 7 thin omitted)
- Extraction: 87% EXTRACTED · 13% INFERRED · 0% AMBIGUOUS · INFERRED: 103 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `b143447b`
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
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 19|Community 19]]

## God Nodes (most connected - your core abstractions)
1. `TaskDetailPage()` - 19 edges
2. `cn()` - 16 edges
3. `authenticate()` - 16 edges
4. `verifyTaskAccess()` - 16 edges
5. `success()` - 16 edges
6. `useAuth()` - 15 edges
7. `organizationsRoutes` - 15 edges
8. `tasksRoutes` - 15 edges
9. `supabase` - 14 edges
10. `authRoutes` - 14 edges

## Surprising Connections (you probably didn't know these)
- `SocialAuth()` --calls--> `useAuth()`  [INFERRED]
  client/src/components/auth/SocialAuth.jsx → client/src/context/AuthContext.jsx
- `AppLayout()` --calls--> `useOrganizations()`  [INFERRED]
  client/src/components/layout/AppLayout.jsx → client/src/hooks/useOrganizations.js
- `AppLayout()` --calls--> `cn()`  [INFERRED]
  client/src/components/layout/AppLayout.jsx → client/src/lib/utils.js
- `TaskCard()` --calls--> `getPriorityColor()`  [INFERRED]
  client/src/components/tasks/TaskCard.jsx → client/src/lib/utils.js
- `Skeleton()` --calls--> `cn()`  [INFERRED]
  client/src/components/ui/skeleton.jsx → client/src/lib/utils.js

## Communities (23 total, 7 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.06
Nodes (66): createUserClient(), { adminClient, createUserClient }, { AppError }, authenticate(), authLimiter, validate(), attachmentController, { authenticate } (+58 more)

### Community 1 - "Community 1"
Cohesion: 0.06
Nodes (52): addComment(), { adminClient }, { anonymizeProfile }, { AppError }, deleteComment(), getTaskComments(), { verifyTaskAccess, verifyCommentAuthor }, addMember() (+44 more)

### Community 2 - "Community 2"
Cohesion: 0.07
Nodes (35): useDeleteAttachment(), useTaskAttachments(), useUploadAttachment(), useAddComment(), useComments(), useDeleteComment(), useAssignUser(), useCreateTask() (+27 more)

### Community 3 - "Community 3"
Cohesion: 0.06
Nodes (35): Expanding the ESLint configuration, TaskManager Client, 🔐 Authentication & Access, 📎 Collaborative Tools, ✅ Current Features, 🗺️ Future Roadmap (Extra Features), ✨ Planned UI/UX Enhancements, 🚀 Project Features & Roadmap (+27 more)

### Community 4 - "Community 4"
Cohesion: 0.11
Nodes (28): attachmentService, deleteAttachment(), getDownloadUrl(), getTaskAttachments(), { success, created }, uploadAttachment(), authService, { success, created } (+20 more)

### Community 5 - "Community 5"
Cohesion: 0.12
Nodes (18): DashboardPage(), useDashboardStats(), useRecentTasks(), useAddMember(), useCreateOrg(), useDeleteOrg(), useOrganization(), useOrganizations() (+10 more)

### Community 6 - "Community 6"
Cohesion: 0.1
Nodes (14): LoginPage(), SignupPage(), SocialAuth(), AuthContext, AuthProvider(), useAuth(), useProfile(), useUpdateProfile() (+6 more)

### Community 7 - "Community 7"
Cohesion: 0.1
Nodes (22): config, cors, corsOptions, dotenv, missing, path, required, { AppError } (+14 more)

### Community 8 - "Community 8"
Cohesion: 0.11
Nodes (11): adminClient, config, { createClient }, supabase, { createClient }, setup(), supabase, { createClient } (+3 more)

### Community 9 - "Community 9"
Cohesion: 0.18
Nodes (6): dashboardService, { success }, { authenticate }, ctrl, { Router }, { AppError }

### Community 10 - "Community 10"
Cohesion: 0.6
Nodes (3): CardSkeleton(), ListSkeleton(), StatsSkeleton()

## Knowledge Gaps
- **115 isolated node(s):** `Input`, `api`, `token`, `attachmentService`, `{ createClient }` (+110 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `useAuth()` connect `Community 6` to `Community 2`, `Community 5`?**
  _High betweenness centrality (0.303) - this node is a cross-community bridge._
- **Why does `app` connect `Community 6` to `Community 0`, `Community 7`?**
  _High betweenness centrality (0.295) - this node is a cross-community bridge._
- **Are the 18 inferred relationships involving `TaskDetailPage()` (e.g. with `useAuth()` and `useTaskAttachments()`) actually correct?**
  _`TaskDetailPage()` has 18 INFERRED edges - model-reasoned connections that need verification._
- **Are the 15 inferred relationships involving `cn()` (e.g. with `AppLayout()` and `TaskCard()`) actually correct?**
  _`cn()` has 15 INFERRED edges - model-reasoned connections that need verification._
- **What connects `Input`, `api`, `token` to the rest of the system?**
  _115 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.06 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.06 - nodes in this community are weakly interconnected._