# Graph Report - .  (2026-05-19)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 462 nodes · 827 edges · 27 communities (18 shown, 9 thin omitted)
- Extraction: 86% EXTRACTED · 14% INFERRED · 0% AMBIGUOUS · INFERRED: 117 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `46e23868`
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
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 23|Community 23]]

## God Nodes (most connected - your core abstractions)
1. `TaskDetailPage()` - 22 edges
2. `cn()` - 17 edges
3. `authenticate()` - 16 edges
4. `verifyTaskAccess()` - 16 edges
5. `success()` - 16 edges
6. `useAuth()` - 15 edges
7. `organizationsRoutes` - 15 edges
8. `tasksRoutes` - 15 edges
9. `supabase` - 14 edges
10. `authRoutes` - 14 edges

## Surprising Connections (you probably didn't know these)
- `AppLayout()` --calls--> `cn()`  [INFERRED]
  client/src/components/layout/AppLayout.jsx → client/src/lib/utils.js
- `Skeleton()` --calls--> `cn()`  [INFERRED]
  client/src/components/ui/skeleton.jsx → client/src/lib/utils.js
- `useToast()` --calls--> `useToastContext()`  [INFERRED]
  client/src/hooks/useToast.js → client/src/components/ToastProvider.jsx
- `AppLayout()` --calls--> `useOrganizations()`  [INFERRED]
  client/src/components/layout/AppLayout.jsx → client/src/hooks/useOrganizations.js
- `TaskCard()` --calls--> `getPriorityColor()`  [INFERRED]
  client/src/components/tasks/TaskCard.jsx → client/src/lib/utils.js

## Communities (27 total, 9 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.05
Nodes (68): { adminClient, createUserClient }, { AppError }, authenticate(), validate(), attachmentController, { authenticate }, express, router (+60 more)

### Community 1 - "Community 1"
Cohesion: 0.05
Nodes (48): addComment(), { adminClient }, { anonymizeProfile }, { AppError }, deleteComment(), { verifyTaskAccess, verifyCommentAuthor }, addMember(), { adminClient } (+40 more)

### Community 2 - "Community 2"
Cohesion: 0.07
Nodes (37): useDeleteAttachment(), useTaskAttachments(), useUploadAttachment(), useAddComment(), useComments(), useDeleteComment(), useStarComment(), useUnstarComment() (+29 more)

### Community 3 - "Community 3"
Cohesion: 0.09
Nodes (34): attachmentService, deleteAttachment(), getDownloadUrl(), getTaskAttachments(), { success, created }, uploadAttachment(), authService, { success, created } (+26 more)

### Community 4 - "Community 4"
Cohesion: 0.07
Nodes (20): LoginPage(), SignupPage(), SocialAuth(), ToastContext, useToastContext(), AuthContext, AuthProvider(), useAuth() (+12 more)

### Community 5 - "Community 5"
Cohesion: 0.06
Nodes (35): Expanding the ESLint configuration, TaskManager Client, 🔐 Authentication & Access, 📎 Collaborative Tools, ✅ Current Features, 🗺️ Future Roadmap (Extra Features), ✨ Planned UI/UX Enhancements, 🚀 Project Features & Roadmap (+27 more)

### Community 6 - "Community 6"
Cohesion: 0.08
Nodes (18): adminClient, config, { createClient }, createUserClient(), supabase, { createClient }, setup(), supabase (+10 more)

### Community 7 - "Community 7"
Cohesion: 0.09
Nodes (23): config, cors, corsOptions, dotenv, missing, path, required, { AppError } (+15 more)

### Community 8 - "Community 8"
Cohesion: 0.14
Nodes (18): DashboardPage(), useDashboardMentions(), useDashboardStarred(), useDashboardStats(), useRecentTasks(), useAddMember(), useDeleteOrg(), useOrganization() (+10 more)

### Community 10 - "Community 10"
Cohesion: 0.6
Nodes (3): CardSkeleton(), ListSkeleton(), StatsSkeleton()

## Knowledge Gaps
- **123 isolated node(s):** `ToastContext`, `Input`, `notificationConfig`, `TOAST_DURATIONS`, `TOAST_POSITIONS` (+118 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `useAuth()` connect `Community 4` to `Community 8`, `Community 2`?**
  _High betweenness centrality (0.290) - this node is a cross-community bridge._
- **Why does `app` connect `Community 4` to `Community 0`, `Community 7`?**
  _High betweenness centrality (0.285) - this node is a cross-community bridge._
- **Are the 21 inferred relationships involving `TaskDetailPage()` (e.g. with `cn()` and `useAuth()`) actually correct?**
  _`TaskDetailPage()` has 21 INFERRED edges - model-reasoned connections that need verification._
- **Are the 15 inferred relationships involving `cn()` (e.g. with `AppLayout()` and `TaskCard()`) actually correct?**
  _`cn()` has 15 INFERRED edges - model-reasoned connections that need verification._
- **What connects `ToastContext`, `Input`, `notificationConfig` to the rest of the system?**
  _123 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.05 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.05 - nodes in this community are weakly interconnected._