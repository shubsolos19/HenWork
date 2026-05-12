# Team Task Manager - Complete AI Handoff Documentation

> **Purpose**: This document provides a complete project overview for any AI assistant (Google AI Studio, Claude, etc.) to understand and continue development of the Team Task Manager application.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Architecture & Design](#architecture--design)
4. [Database Schema](#database-schema)
5. [Authentication System](#authentication-system)
6. [Server Actions (API Layer)](#server-actions-api-layer)
7. [Frontend Pages & Components](#frontend-pages--components)
8. [User Flows & Workflows](#user-flows--workflows)
9. [Security & RLS Policies](#security--rls-policies)
10. [Environment Configuration](#environment-configuration)
11. [File Structure](#file-structure)
12. [Development Guidelines](#development-guidelines)
13. [Common Tasks & Patterns](#common-tasks--patterns)
14. [Known Issues & Limitations](#known-issues--limitations)
15. [Testing Instructions](#testing-instructions)
16. [Deployment Guide](#deployment-guide)

---

## Project Overview

### What is Team Task Manager?

A **full-stack web application** for managing team projects and tasks with role-based access control. Teams can create organizations, invite members, create projects, assign tasks, and collaborate through task comments.

### Key Objectives

- ✅ Enable teams to organize work across multiple projects
- ✅ Support hierarchical access control (Organizations → Projects → Tasks)
- ✅ Provide role-based permissions (Admin/Member)
- ✅ Allow task assignment and progress tracking
- ✅ Facilitate team collaboration through comments
- ✅ Maintain data security with Row Level Security (RLS)

### Core Features (MVP Implemented)

| Feature | Status | Details |
|---------|--------|---------|
| User Authentication | ✅ Complete | Email/password signup & login with Supabase Auth |
| Organizations | ✅ Complete | Create organizations, manage members with roles |
| Projects | ✅ Complete | Create projects within organizations |
| Tasks | ✅ Complete | Full CRUD with priority, status, assignment, due dates |
| Task Comments | ✅ Complete | Thread-based discussions on tasks |
| Dashboard | ✅ Complete | Overview with statistics and quick access |
| Role-Based Access | ✅ Complete | Admin/Member roles with database-enforced RLS |
| Member Management | ✅ Complete | Add/remove members, assign roles |
| Task Filtering | ✅ Complete | Filter by status, priority, assignee |

---

## Technology Stack

### Frontend

```
Framework:    Next.js 16 (App Router)
Language:     TypeScript
UI Library:   React 19
Styling:      Tailwind CSS v4
Components:   shadcn/ui (pre-built Radix UI components)
State:        React hooks (useState, useEffect)
Forms:        HTML forms with server actions
```

### Backend

```
Server:       Next.js 16 Server Components
API Layer:    Next.js Server Actions (no REST endpoints)
Runtime:      Node.js
Language:     TypeScript
```

### Database

```
Provider:     Supabase (hosted PostgreSQL)
Database:     PostgreSQL 15+
Auth:         Supabase Auth (managed email/password)
Security:     Row Level Security (RLS) policies
Connection:   @supabase/supabase-js + @supabase/ssr
```

### Deployment

```
Hosting:      Vercel (Next.js native)
CDN:          Vercel Edge Network
Environment:  Node.js 18+ LTS
```

### Dev Tools

```
Package Manager:  pnpm
Bundler:          Turbopack (Next.js 16 default)
TypeScript:       v5+
Testing:          None (ready for addition)
```

---

## Architecture & Design

### High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     Client (Browser)                            │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  React Components (Client Components)                      │ │
│  │  - Forms                                                   │ │
│  │  - Tables                                                  │ │
│  │  - Navigation                                              │ │
│  │  - Task Lists                                              │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────┬──────────────────────────────────────────────────┘
              │ HTTP Request with Server Actions
              ↓
┌─────────────────────────────────────────────────────────────────┐
│              Next.js 16 Server (App Router)                     │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Middleware (middleware.ts)                                │ │
│  │  - Token refresh                                           │ │
│  │  - Request routing                                         │ │
│  └────────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Server Actions (app/actions/*.ts)                         │ │
│  │  - Authentication                                          │ │
│  │  - Organization CRUD                                       │ │
│  │  - Project CRUD                                            │ │
│  │  - Task CRUD                                               │ │
│  │  - Permission checks                                       │ │
│  └────────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Server Components (app/**/page.tsx)                       │ │
│  │  - Data fetching                                           │ │
│  │  - Initial page rendering                                 │ │
│  └────────────────────────────────────────────────────────────┘ │
└────────��────┬──────────────────────────────────────────────────┘
              │ SQL Queries with user context (RLS)
              ↓
┌─────────────────────────────────────────────────────────────────┐
│              Supabase (PostgreSQL + Auth)                       │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Database Tables                                           │ │
│  │  - profiles, organizations, organization_members          │ │
│  │  - projects, tasks, task_comments                          │ │
│  └────────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Row Level Security (RLS)                                  │ │
│  │  - Organization membership enforcement                     │ │
│  │  - Role-based access policies                              │ │
│  │  - Creator/author permissions                              │ │
│  └────────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Authentication                                            │ │
│  │  - User signup/login                                       │ │
│  │  - Session management                                      │ │
│  │  - Token refresh                                           │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### Data Flow Pattern

```
User Action (Click, Form Submit)
    ↓
React Event Handler
    ↓
Call Server Action (e.g., createTask())
    ↓
Server Action Function (app/actions/tasks.ts)
    ├─ Get current user: await getCurrentUser()
    ├─ Verify permission: Check if user in organization
    ├─ Validate data: Type checking and business rules
    ├─ Query database: Create task in Supabase
    └─ Revalidate cache: revalidatePath('/dashboard')
    ↓
Response sent to client
    ↓
Page revalidates and re-renders
    ↓
UI updates to show new/modified data
```

### Component Hierarchy

```
RootLayout (app/layout.tsx)
├── LS Home (app/page.tsx)
│   └── Shows loading spinner, redirects to /auth/login or /dashboard
├── AuthLayout (implicit from file structure)
│   ├── Login (app/auth/login/page.tsx)
│   ├── SignUp (app/auth/sign-up/page.tsx)
│   ├── Callback (app/auth/callback/route.ts)
│   ├── Error (app/auth/error/page.tsx)
│   └── Success (app/auth/sign-up-success/page.tsx)
└── DashboardLayout (app/dashboard/layout.tsx)
    ├── DashboardHeader (shows user menu, org selector)
    ├── DashboardSidebar (org navigation, project list)
    └── Main Content
        ├── Dashboard (app/dashboard/page.tsx) - Overview
        ├── NewOrg (app/dashboard/new-org/page.tsx) - Create org
        ├── OrgDetail (app/dashboard/org/[orgId]/page.tsx) - Org view
        ├── Members (app/dashboard/org/[orgId]/members/page.tsx) - Member mgmt
        ├── ProjectDetail (app/dashboard/project/[projectId]/page.tsx) - Task list
        └── TaskDetail (app/dashboard/task/[taskId]/page.tsx) - Task view
```

---

## Database Schema

### Complete Schema Definition

All tables are in the `public` schema. See the full migration in the database.

#### 1. **profiles** table

```sql
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name text,
  last_name text,
  avatar_url text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);
```

**Purpose**: Stores user profile information  
**Key Fields**:
- `id` - References auth.users, primary key
- `first_name`, `last_name` - User's name
- `avatar_url` - Profile picture URL (optional)

**RLS Policies**:
- SELECT: Users can view their own profile
- INSERT: Users can create their own profile
- UPDATE: Users can update their own profile
- DELETE: Users can delete their own profile

**Triggers**: Auto-created on signup via `handle_new_user()` trigger

#### 2. **organizations** table

```sql
CREATE TABLE public.organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  owner_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);
```

**Purpose**: Represents team organizations  
**Key Fields**:
- `id` - UUID primary key
- `name` - Organization name (required)
- `description` - Optional description
- `owner_id` - User who created it

**RLS Policies**:
- SELECT: Only members can view
- INSERT: Authenticated users can create
- UPDATE: Only admins can update
- DELETE: Only owner can delete

**Relationships**:
- Has many `projects`
- Has many `organization_members` (join table)

#### 3. **organization_members** table

```sql
CREATE TABLE public.organization_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'member')),
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(organization_id, user_id)
);
```

**Purpose**: Join table linking users to organizations with roles  
**Key Fields**:
- `id` - UUID primary key
- `organization_id` - FK to organizations
- `user_id` - FK to auth.users
- `role` - 'admin' or 'member' (enforced via CHECK constraint)

**RLS Policies**:
- SELECT: Members of org can view member list
- INSERT: Org admins can add members
- UPDATE: Org admins can change roles
- DELETE: Org admins can remove members

**Relationships**:
- Belongs to `organizations`
- Belongs to `auth.users`

**Key Constraint**: Unique(organization_id, user_id) - One user per org, only one role

#### 4. **projects** table

```sql
CREATE TABLE public.projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  owner_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);
```

**Purpose**: Projects within organizations  
**Key Fields**:
- `id` - UUID primary key
- `organization_id` - FK to organizations
- `name` - Project name (required)
- `description` - Optional description
- `owner_id` - User who created it

**RLS Policies**:
- SELECT: Org members can view
- INSERT: Org members can create
- UPDATE: Org members can update
- DELETE: Project owner can delete

**Relationships**:
- Belongs to `organizations`
- Has many `tasks`

#### 5. **tasks** table

```sql
CREATE TABLE public.tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  created_by_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  assigned_to_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  title text NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'todo' 
    CHECK (status IN ('todo', 'in_progress', 'completed')),
  priority text NOT NULL DEFAULT 'medium' 
    CHECK (priority IN ('low', 'medium', 'high')),
  due_date timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);
```

**Purpose**: Individual tasks within projects  
**Key Fields**:
- `id` - UUID primary key
- `project_id` - FK to projects
- `created_by_id` - User who created task
- `assigned_to_id` - User assigned to (can be NULL)
- `title` - Task name (required)
- `description` - Optional details
- `status` - 'todo' | 'in_progress' | 'completed'
- `priority` - 'low' | 'medium' | 'high'
- `due_date` - Optional deadline

**RLS Policies**:
- SELECT: Project members can view
- INSERT: Project members can create
- UPDATE: Project members can update
- DELETE: Task creator can delete

**Relationships**:
- Belongs to `projects`
- Belongs to `auth.users` (creator and assignee)
- Has many `task_comments`

#### 6. **task_comments** table

```sql
CREATE TABLE public.task_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id uuid NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);
```

**Purpose**: Comments/discussions on tasks  
**Key Fields**:
- `id` - UUID primary key
- `task_id` - FK to tasks
- `user_id` - Comment author
- `content` - Comment text (required)

**RLS Policies**:
- SELECT: Project members can view
- INSERT: Project members can comment
- DELETE: Comment author can delete

**Relationships**:
- Belongs to `tasks`
- Belongs to `auth.users` (author)

### Entity Relationship Diagram (ERD)

```
auth.users (Supabase managed)
    ├─── profiles (1:1)
    ├─── organization_members (1:N) ──┐
    ├─── organizations (owner) (1:N) │
    ├─── projects (owner) (1:N)      │
    ├─── tasks (creator) (1:N)       │
    ├─── tasks (assignee) (0:N)      │
    └─── task_comments (author) (1:N)│
         │                            │
         └─→ organizations            │
              ├─ projects (1:N)       │
              │   └─ tasks (1:N)      │
              │       └─ task_comments│
              └─ organization_members ┘
                 └─ (back to users)
```

### Key Relationships Explained

1. **User → Organization**
   - Users are members of organizations via `organization_members`
   - Each organization has an `owner_id` (the creating user)
   - Users have a role in each organization (admin or member)

2. **Organization → Project**
   - Projects belong to an organization (org_id)
   - Only members of the org can access projects
   - Each project has an `owner_id` (the creating user)

3. **Project → Task**
   - Tasks belong to a project
   - Only org members can see tasks
   - Tasks have `created_by_id` and optional `assigned_to_id`

4. **Task → Comments**
   - Comments belong to tasks (one-to-many)
   - Only org members can comment
   - Comments have `user_id` (author)

---

## Authentication System

### How Authentication Works

#### 1. Signup Flow

```
User fills signup form (email, password, name)
    ↓
Frontend calls signUp() action with emailRedirectTo
    ↓
Supabase creates auth user with metadata (first_name, last_name)
    ↓
Email confirmation sent (if enabled in Supabase)
    ↓
User confirms email
    ↓
Trigger `handle_new_user()` creates profile in public.profiles
    ↓
Redirect to /auth/sign-up-success
    ↓
User can then login
```

#### 2. Login Flow

```
User fills login form (email, password)
    ↓
Frontend calls signInWithPassword()
    ↓
Supabase verifies credentials
    ↓
Session created (JWT token + refresh token in cookies)
    ↓
Middleware handles token refresh on each request
    ↓
User redirected to /dashboard
```

#### 3. Session Management

```
HTTP Request with cookie
    ↓
Middleware (middleware.ts) intercepts
    ↓
Refreshes token if needed
    ↓
Updates response with new cookies
    ↓
Request proceeds with valid session
```

### Authentication Files

**Location**: `lib/supabase/` and `app/auth/`

| File | Purpose |
|------|---------|
| `lib/supabase/client.ts` | Browser-side Supabase client |
| `lib/supabase/server.ts` | Server-side Supabase client |
| `lib/supabase/proxy.ts` | Session update helper (middleware support) |
| `middleware.ts` | Token refresh and route protection |
| `app/auth/login/page.tsx` | Login form |
| `app/auth/sign-up/page.tsx` | Signup form |
| `app/auth/callback/route.ts` | Email confirmation callback |
| `app/auth/error/page.tsx` | Auth error page |
| `app/auth/sign-up-success/page.tsx` | Signup confirmation page |

### Key Functions

#### `createClient()` - Browser

```typescript
// lib/supabase/client.ts
export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase environment variables')
  }
  
  return createBrowserClient(supabaseUrl, supabaseKey)
}
```

Used in client components to call Supabase Auth methods.

#### `createClient()` - Server

```typescript
// lib/supabase/server.ts
export async function createClient() {
  const cookieStore = await cookies()
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase environment variables')
  }
  
  return createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() { /* ... */ },
      setAll(cookiesToSet) { /* ... */ },
    },
  })
}
```

Used in server components and server actions to query data with user context.

#### `getCurrentUser()` - Server Action

```typescript
// app/actions/auth.ts
export async function getCurrentUser() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    return user
  } catch (error) {
    console.error('[v0] Error getting current user:', error)
    return null
  }
}
```

Returns the authenticated user or null.

### Environment Variables Required

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
```

These are automatically set when Supabase integration is connected.

---

## Server Actions (API Layer)

Server Actions are Next.js functions that run on the server and can be called from client components. They're the API layer for this application.

### Location & Organization

All server actions are in `app/actions/`:

```
app/actions/
├── auth.ts              (2 functions)
├── organizations.ts     (6 functions)
├── projects.ts          (6 functions)
└── tasks.ts             (9 functions)
```

### General Pattern

```typescript
'use server'

import { getCurrentUser } from './auth'
import { createClient } from '@/lib/supabase/server'

export async function doSomething(param: string) {
  try {
    // 1. Get current user
    const user = await getCurrentUser()
    if (!user) throw new Error('Not authenticated')
    
    // 2. Create Supabase client with user context
    const supabase = await createClient()
    
    // 3. Check permission
    const isAllowed = await checkPermission(supabase, user.id, param)
    if (!isAllowed) throw new Error('Not authorized')
    
    // 4. Validate input
    if (!param) throw new Error('Invalid input')
    
    // 5. Perform database operation
    const { data, error } = await supabase.from('table').insert({...})
    if (error) throw error
    
    // 6. Revalidate affected pages
    revalidatePath('/path/where/data/is/shown')
    
    return { success: true, data }
  } catch (error) {
    console.error('[v0] Error:', error)
    return { success: false, error: error.message }
  }
}
```

### Auth Actions (app/actions/auth.ts)

#### `getCurrentUser()`

```typescript
export async function getCurrentUser()
```

**Purpose**: Get the currently authenticated user  
**Returns**: `User | null`  
**Errors**: Logged but returns null (safe)  
**Usage**: 
```typescript
const user = await getCurrentUser()
if (!user) redirect('/auth/login')
```

#### `signOut()`

```typescript
export async function signOut()
```

**Purpose**: Sign out the current user  
**Returns**: `Promise<void>`  
**Errors**: Logged silently  
**Side Effects**: Invalidates session, clears cookies, revalidates layout  
**Usage**:
```typescript
await signOut()
router.push('/auth/login')
```

### Organization Actions (app/actions/organizations.ts)

#### `createOrganization(name, description)`

```typescript
export async function createOrganization(
  name: string,
  description?: string
): Promise<{ success: boolean; data?: Organization; error?: string }>
```

**Purpose**: Create a new organization  
**Permissions**: Any authenticated user  
**Auto-Effects**: User becomes admin of new org  
**Validation**:
- User must be authenticated
- Name must be non-empty
- Name max 200 characters
**Usage**:
```typescript
const { success, data } = await createOrganization('My Team', 'Team description')
if (success) {
  router.push(`/dashboard/org/${data.id}`)
}
```

#### `getUserOrganizations()`

```typescript
export async function getUserOrganizations(): Promise<Organization[]>
```

**Purpose**: Get all organizations current user is a member of  
**Returns**: Array of organizations with member role included  
**Usage**:
```typescript
const orgs = await getUserOrganizations()
```

#### `getOrganizationDetails(orgId)`

```typescript
export async function getOrganizationDetails(orgId: string): Promise<{
  organization: Organization
  userRole: 'admin' | 'member'
  memberCount: number
} | null>
```

**Purpose**: Get organization with user's role  
**Permissions**: Must be organization member  
**Returns**: Org details with user's role  
**Usage**:
```typescript
const details = await getOrganizationDetails(orgId)
const canManage = details?.userRole === 'admin'
```

#### `addMemberToOrganization(orgId, email, role)`

```typescript
export async function addMemberToOrganization(
  orgId: string,
  email: string,
  role: 'admin' | 'member'
): Promise<{ success: boolean; error?: string }>
```

**Purpose**: Invite a user to organization  
**Permissions**: Admin only  
**Validation**:
- User must be org admin
- Email must be valid
- User must exist (by email)
- User cannot already be in org
**Usage**:
```typescript
const { success } = await addMemberToOrganization(orgId, 'user@example.com', 'member')
```

**Note**: This assumes user exists. In production, might send invite link for non-existent users.

#### `removeMemberFromOrganization(orgId, memberId)`

```typescript
export async function removeMemberFromOrganization(
  orgId: string,
  memberId: string
): Promise<{ success: boolean; error?: string }>
```

**Purpose**: Remove a user from organization  
**Permissions**: Admin only  
**Validation**: User must be org admin  
**Usage**:
```typescript
await removeMemberFromOrganization(orgId, userId)
```

#### `getOrganizationMembers(orgId)`

```typescript
export async function getOrganizationMembers(orgId: string): Promise<OrganizationMember[]>
```

**Purpose**: Get all members of an organization  
**Returns**: Array of members with roles  
**Permissions**: Org members only  
**Usage**:
```typescript
const members = await getOrganizationMembers(orgId)
```

### Project Actions (app/actions/projects.ts)

#### `createProject(orgId, name, description)`

```typescript
export async function createProject(
  orgId: string,
  name: string,
  description?: string
): Promise<{ success: boolean; data?: Project; error?: string }>
```

**Purpose**: Create a project in organization  
**Permissions**: Org members  
**Auto-Effects**: Creator becomes owner  
**Validation**: User must be org member  
**Usage**:
```typescript
const { data } = await createProject(orgId, 'Q2 Roadmap')
```

#### `getProjectsByOrganization(orgId)`

```typescript
export async function getProjectsByOrganization(orgId: string): Promise<Project[]>
```

**Purpose**: Get all projects in organization  
**Returns**: Array of projects  
**Usage**:
```typescript
const projects = await getProjectsByOrganization(orgId)
```

#### `getProjectDetails(projectId)`

```typescript
export async function getProjectDetails(projectId: string): Promise<Project | null>
```

**Purpose**: Get project with details  
**Permissions**: Org members  
**Usage**:
```typescript
const project = await getProjectDetails(projectId)
```

#### `updateProject(projectId, name, description)`

```typescript
export async function updateProject(
  projectId: string,
  name: string,
  description?: string
): Promise<{ success: boolean; error?: string }>
```

**Purpose**: Update project details  
**Permissions**: Org members  
**Usage**:
```typescript
await updateProject(projectId, 'Q3 Roadmap', 'New description')
```

#### `deleteProject(projectId)`

```typescript
export async function deleteProject(projectId: string): Promise<{ success: boolean; error?: string }>
```

**Purpose**: Delete a project  
**Permissions**: Project owner only  
**Auto-Effects**: Deletes all tasks in project (cascade)  
**Usage**:
```typescript
await deleteProject(projectId)
```

### Task Actions (app/actions/tasks.ts)

#### `createTask(projectId, title, description?, priority?, dueDate?, assignedToId?)`

```typescript
export async function createTask(
  projectId: string,
  title: string,
  description?: string,
  priority?: 'low' | 'medium' | 'high',
  dueDate?: Date,
  assignedToId?: string
): Promise<{ success: boolean; data?: Task; error?: string }>
```

**Purpose**: Create a new task  
**Permissions**: Org members  
**Defaults**:
- priority: 'medium'
- status: 'todo'
- assignedToId: null (unassigned)
**Validation**:
- Title required and non-empty
- DueDate must be future (if provided)
- AssignedToId must be org member (if provided)
**Usage**:
```typescript
const { data: task } = await createTask(
  projectId,
  'Implement auth',
  'Add email/password auth',
  'high',
  new Date('2026-06-01')
)
```

#### `getProjectTasks(projectId, filters?)`

```typescript
export async function getProjectTasks(
  projectId: string,
  filters?: {
    status?: 'todo' | 'in_progress' | 'completed'
    priority?: 'low' | 'medium' | 'high'
    assignedTo?: string // user ID
  }
): Promise<Task[]>
```

**Purpose**: Get tasks in project with optional filtering  
**Returns**: Array of tasks  
**Filters**:
- `status`: Filter by task status
- `priority`: Filter by priority
- `assignedTo`: Filter by assignee
**Usage**:
```typescript
const inProgress = await getProjectTasks(projectId, { status: 'in_progress' })
```

#### `getTaskDetails(taskId)`

```typescript
export async function getTaskDetails(taskId: string): Promise<{
  task: Task
  comments: TaskComment[]
  assignedTo?: User
} | null>
```

**Purpose**: Get task with comments and assignee details  
**Returns**: Task object with related data  
**Usage**:
```typescript
const taskData = await getTaskDetails(taskId)
```

#### `updateTask(taskId, updates)`

```typescript
export async function updateTask(
  taskId: string,
  updates: {
    title?: string
    description?: string
    status?: 'todo' | 'in_progress' | 'completed'
    priority?: 'low' | 'medium' | 'high'
    dueDate?: Date | null
    assignedToId?: string | null
  }
): Promise<{ success: boolean; error?: string }>
```

**Purpose**: Update task properties  
**Permissions**: Org members can update  
**Validation**: Updated fields are validated individually  
**Usage**:
```typescript
await updateTask(taskId, {
  status: 'in_progress',
  assignedToId: userId
})
```

#### `deleteTask(taskId)`

```typescript
export async function deleteTask(taskId: string): Promise<{ success: boolean; error?: string }>
```

**Purpose**: Delete a task  
**Permissions**: Task creator only  
**Auto-Effects**: Deletes associated comments (cascade)  
**Usage**:
```typescript
await deleteTask(taskId)
```

#### `addTaskComment(taskId, content)`

```typescript
export async function addTaskComment(
  taskId: string,
  content: string
): Promise<{ success: boolean; data?: TaskComment; error?: string }>
```

**Purpose**: Add comment to task  
**Permissions**: Org members  
**Validation**: Content must be non-empty  
**Usage**:
```typescript
await addTaskComment(taskId, 'Started implementation')
```

#### `getTaskComments(taskId)`

```typescript
export async function getTaskComments(taskId: string): Promise<TaskComment[]>
```

**Purpose**: Get all comments on a task  
**Returns**: Array of comments with author info  
**Usage**:
```typescript
const comments = await getTaskComments(taskId)
```

#### `deleteTaskComment(commentId)`

```typescript
export async function deleteTaskComment(commentId: string): Promise<{ success: boolean; error?: string }>
```

**Purpose**: Delete a comment  
**Permissions**: Comment author only  
**Usage**:
```typescript
await deleteTaskComment(commentId)
```

---

## Frontend Pages & Components

### Component Files

#### `components/dashboard-header.tsx`

```typescript
interface DashboardHeaderProps {
  user: User
}

export function DashboardHeader({ user }: DashboardHeaderProps)
```

**Purpose**: Top navigation bar  
**Features**:
- Shows current user name
- User menu with logout button
- Organization selector (coming)
**Used In**: `app/dashboard/layout.tsx`

#### `components/dashboard-sidebar.tsx`

```typescript
interface DashboardSidebarProps {
  organizations: Organization[]
}

export function DashboardSidebar({ organizations }: DashboardSidebarProps)
```

**Purpose**: Left navigation sidebar  
**Features**:
- Organization list
- Quick links (Dashboard, Create Org)
- Responsive collapse
**Used In**: `app/dashboard/layout.tsx`

### Page Files

#### Root Pages

**`app/layout.tsx`** - Root layout
- Sets metadata (title: "Team Task Manager")
- Imports fonts (Geist)
- Adds background styling
- Providers for toasts (if used)

**`app/page.tsx`** - Home page
- Redirects to `/auth/login` or `/dashboard` based on auth status
- Shows loading spinner while checking
- Handles errors gracefully

#### Auth Pages

**`app/auth/login/page.tsx`**
- Email/password login form
- Client component (handles form submission)
- Calls `signInWithPassword()` from Supabase
- Redirects to `/dashboard` on success
- Error handling and display

**`app/auth/sign-up/page.tsx`**
- Email/password signup form
- Captures first_name, last_name metadata
- Calls `signUp()` with emailRedirectTo
- Redirects to `/auth/sign-up-success` on success
- Validation and error handling

**`app/auth/callback/route.ts`**
- Handles email confirmation callback
- Exchanges auth code for session
- Redirects to `/dashboard`

**`app/auth/error/page.tsx`**
- Generic error page
- Shows auth errors

**`app/auth/sign-up-success/page.tsx`**
- Confirmation page after signup
- Prompts user to verify email

#### Dashboard Pages

**`app/dashboard/layout.tsx`**
- Wraps all dashboard pages
- Checks authentication (redirects if not logged in)
- Loads organizations
- Renders DashboardHeader + DashboardSidebar
- Provides main content area

**`app/dashboard/page.tsx`**
- Main dashboard overview
- Shows task statistics:
  - Total tasks
  - In-progress tasks
  - Completed tasks
  - Overdue tasks
- Lists organizations with quick access
- Lists recent tasks

**`app/dashboard/new-org/page.tsx`**
- Organization creation form
- Client component with form handling
- Calls `createOrganization()`
- Redirects to org details on success

**`app/dashboard/org/[orgId]/page.tsx`**
- Organization overview
- Shows projects in organization
- Shows project creation form
- Calls `getProjectsByOrganization()`
- Client component with project list and create form

**`app/dashboard/org/[orgId]/members/page.tsx`**
- Member management page
- Lists all organization members with roles
- Add member form (admin only)
- Remove member buttons (admin only)
- Calls `getOrganizationMembers()`
- Calls `addMemberToOrganization()`

**`app/dashboard/project/[projectId]/page.tsx`**
- Project view with task list
- Shows all tasks in project
- Task creation form
- Task filtering (by status, priority, assignee)
- Task status badges
- Quick edit inline (status, priority, assignee)
- Calls `getProjectTasks()`
- Calls `updateTask()` for inline edits

**`app/dashboard/task/[taskId]/page.tsx`**
- Full task detail page
- Task properties (title, description, status, priority, due date, assignee)
- Edit form for all properties
- Comments section
- Comment add form
- Comment list with delete buttons
- Calls `getTaskDetails()`
- Calls `updateTask()`
- Calls `addTaskComment()`
- Calls `deleteTaskComment()`

### Form Patterns

All forms follow this pattern:

```typescript
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { someAction } from '@/app/actions/...'

export default function FormPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({ field: '' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const result = await someAction(formData.field)
      if (!result.success) {
        setError(result.error || 'Something went wrong')
        return
      }

      router.push('/redirect/path')
    } catch (err) {
      setError('An error occurred')
      console.error('[v0] Error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="text-red-500">{error}</div>}
      {/* Form fields */}
      <button disabled={isLoading}>
        {isLoading ? 'Loading...' : 'Submit'}
      </button>
    </form>
  )
}
```

---

## User Flows & Workflows

### Complete User Onboarding Flow

```
1. First Time User
   ├─ Lands on /
   ├─ Redirected to /auth/login (not authenticated)
   ├─ Clicks "Sign up instead"
   └─ Redirected to /auth/sign-up

2. Sign Up
   ├─ Fills email, password, first name, last name
   ├─ Clicks "Create account"
   ├─ Supabase creates auth.users record
   ├─ Trigger creates profiles record
   ├─ Redirect to /auth/sign-up-success
   ├─ (Email confirmation sent if enabled)
   └─ Prompt to verify email

3. Email Confirmation (if enabled)
   ├─ User clicks confirmation link
   ├─ Email confirmed
   ├─ User can login

4. Login
   ├─ User goes to /auth/login
   ├─ Enters email and password
   ├─ Redirected to /dashboard
   └─ Session created (cookie + JWT)

5. Dashboard First View
   ├─ Shows overview page
   ├─ No organizations yet
   ├─ Prompt to create organization
   └─ Click "Create Organization"

6. Organization Creation
   ├─ Fill name and description
   ├─ Click "Create"
   ├─ Organization created with user as admin
   ├─ Redirected to /dashboard/org/[orgId]
   └─ Empty projects state

7. Project Creation
   ├─ Click "+ New Project"
   ├─ Fill name and description
   ├─ Click "Create"
   ├─ Project created
   ├─ Redirected to project view
   └─ Empty tasks state

8. Task Creation
   ├─ Click "+ New Task"
   ├─ Fill title, description, priority, due date
   ├─ Assign to team member (optional)
   ├─ Click "Create"
   ├─ Task created and appears in list
   └─ Can click to view details

9. Invite Team Members
   ├─ Go to /dashboard/org/[orgId]/members
   ├─ Fill email and select role
   ├─ Click "Add Member"
   ├─ Member added to organization
   └─ Member can now see projects and tasks

10. Ongoing Usage
    ├─ Dashboard shows task overview
    ├─ Create tasks in projects
    ├─ Update task status
    ├─ Assign tasks to team members
    ├─ Comment on tasks
    ├─ Filter and search tasks
    └─ Manage team members
```

### Task Assignment & Tracking Workflow

```
Task Creator
├─ Creates task
├─ Sets priority and due date
├─ Assigns to team member
└─ Sends notification (future feature)

Task Assignee
├─ Sees task in their dashboard
├─ Opens task details
├─ Reviews description and comments
├─ Updates status to "in_progress"
├─ Adds progress comments
├─ Updates status to "completed"
└─ Task moves to "completed" section

Task Manager/Admin
├─ Views task status
├─ Reassigns tasks if needed
├─ Comments with feedback
├─ Tracks overdue tasks
└─ Generates reports (future feature)
```

### Organization Hierarchy

```
Organization (Team)
├─ Admin Members
│  ├─ Can manage organization
│  ├─ Can add/remove members
│  ├─ Can delete projects
│  └─ Can manage all tasks
├─ Regular Members
│  ├─ Can create projects
│  ├─ Can create tasks
│  ├─ Can edit own tasks
│  └─ Cannot manage members or delete projects
└─ Projects
   ├─ Visible to all org members
   ├─ Contains tasks
   └─ Tasks
      ├─ Can be assigned
      ├─ Can have comments
      └─ Can be updated
```

---

## Security & RLS Policies

### How Row Level Security Works

RLS is a PostgreSQL feature that filters query results based on policies. When a user queries data, only rows matching the policy conditions are returned.

**Example**:
```sql
-- Org admin must be member with admin role
CREATE POLICY "orgs_update_by_admin" ON organizations FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM organization_members
      WHERE organization_id = organizations.id
        AND user_id = auth.uid()
        AND role = 'admin'
    )
  )
```

When an admin updates an org, RLS checks that they're an admin member of that org.

### Complete RLS Policy List

**Profiles**:
- SELECT: Can view own profile only (`auth.uid() = id`)
- INSERT: Can insert own profile only
- UPDATE: Can update own profile only
- DELETE: Can delete own profile only

**Organizations**:
- SELECT: Must be member of org
- INSERT: Owner must be authenticated user
- UPDATE: Must be admin member of org
- DELETE: Must be owner of org

**Organization_members**:
- SELECT: Must be member of same org
- INSERT: Must be admin of org (can add members)
- UPDATE: Must be admin of org (can change roles)
- DELETE: Must be admin of org (can remove members)

**Projects**:
- SELECT: Must be member of org (via org_id)
- INSERT: Must be member of org
- UPDATE: Must be member of org
- DELETE: Must be owner of project

**Tasks**:
- SELECT: Must be member of org (checked via project→org)
- INSERT: Must be member of org
- UPDATE: Must be member of org
- DELETE: Must be creator of task

**Task_comments**:
- SELECT: Must be member of org (checked via task→project→org)
- INSERT: Must be member of org (and user_id must be current user)
- DELETE: Must be author of comment

### Key Security Principles

1. **Organization Membership as Access Control**
   - All data access routes through organization membership
   - Projects belong to orgs
   - Tasks belong to projects → orgs
   - RLS enforces org membership at every level

2. **Role-Based Access**
   - Admin: Can manage members and settings
   - Member: Can create and work with tasks
   - Creator permissions: Some actions (delete task) require being creator

3. **User Context in Queries**
   - `auth.uid()` in RLS policies = current user
   - Queries automatically filtered to user's data
   - No need for manual WHERE clauses in app code

4. **Server-Side Authority**
   - All mutations happen on server (server actions)
   - Client cannot bypass RLS
   - Permissions checked both in app logic and database

5. **Error Handling**
   - Permission denies return query errors (RLS policy mismatch)
   - App should handle gracefully (catch error, show friendly message)

---

## Environment Configuration

### Required Environment Variables

```env
# Supabase Configuration (Auto-set by v0 integration)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
```

### Where to Set Variables

**Development**:
1. Create `.env.local` file in project root
2. Add variables there
3. Restart dev server for changes to take effect

**Production (Vercel)**:
1. Project Settings → Environment Variables
2. Add variables
3. Redeploy to apply

### Variable Breakdown

| Variable | Value | Purpose |
|----------|-------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Browser client initialization |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key | Browser client auth |

**Important**: `NEXT_PUBLIC_` prefix means these are exposed to browser (safe, they're public keys).

### How to Find Your Supabase Keys

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to Settings → API
4. Copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - Anon Key (under "Project API keys") → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## File Structure

### Complete Directory Layout

```
team-task-manager/
├── app/
│   ├── actions/
│   │   ├── auth.ts                  (2 functions)
│   │   ├── organizations.ts         (6 functions)
│   │   ├── projects.ts              (6 functions)
│   │   └── tasks.ts                 (9 functions)
│   ├── auth/
│   │   ├── callback/
│   │   │   └── route.ts
│   │   ├── error/
│   │   │   └── page.tsx
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── sign-up/
│   │   │   └── page.tsx
│   │   └── sign-up-success/
│   │       └── page.tsx
│   ├── dashboard/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── new-org/
│   │   │   └── page.tsx
│   │   ├── org/
│   │   │   └── [orgId]/
│   │   │       ├── page.tsx
│   │   │       └── members/
│   │   │           └── page.tsx
│   │   ├── project/
│   │   │   └── [projectId]/
│   │   │       └── page.tsx
│   │   └── task/
│   │       └── [taskId]/
│   │           └── page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/                          (shadcn components)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   └── ...
│   ├── dashboard-header.tsx
│   └── dashboard-sidebar.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── proxy.ts
│   └── utils.ts
├── middleware.ts
├── .env.local                       (local env vars)
├── .env.example                     (template)
├── package.json
├── tsconfig.json
├── next.config.mjs
├── tailwind.config.ts
├── postcss.config.mjs
├── components.json                  (shadcn config)
├── README.md                        (user documentation)
├── IMPLEMENTATION_SUMMARY.md        (technical summary)
└── AI_HANDOFF.md                    (this file)
```

### File Purposes

| File | Purpose |
|------|---------|
| `app/layout.tsx` | Root layout with metadata and fonts |
| `app/page.tsx` | Home page (redirects based on auth) |
| `app/globals.css` | Global styles and Tailwind directives |
| `middleware.ts` | Auth token refresh and routing |
| `lib/supabase/*.ts` | Supabase client setup |
| `app/actions/*.ts` | Server-side business logic |
| `app/auth/*.tsx` | Authentication pages |
| `app/dashboard/*.tsx` | Dashboard and main app pages |
| `components/*.tsx` | Reusable components |
| `next.config.mjs` | Next.js configuration |
| `tsconfig.json` | TypeScript configuration |
| `tailwind.config.ts` | Tailwind CSS theming |
| `package.json` | Dependencies and scripts |

---

## Development Guidelines

### Code Style

#### TypeScript Usage

- **Strict Mode**: Use strict TypeScript (`"strict": true` in tsconfig.json)
- **Type Imports**: Use `import type` for type-only imports
- **Never use `any`**: Always provide proper types
- **React Components**: Type props with interfaces

Example:
```typescript
interface ButtonProps {
  onClick: () => void
  label: string
  disabled?: boolean
}

export function Button({ onClick, label, disabled }: ButtonProps) {
  return <button onClick={onClick} disabled={disabled}>{label}</button>
}
```

#### Server Actions Pattern

```typescript
'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from './auth'

export async function myAction(param: string) {
  try {
    const user = await getCurrentUser()
    if (!user) return { success: false, error: 'Not authenticated' }

    const supabase = await createClient()
    
    // Validation
    if (!param || param.length === 0) {
      return { success: false, error: 'Invalid input' }
    }

    // Permission check
    const isAllowed = await checkPermission(supabase, user.id, param)
    if (!isAllowed) return { success: false, error: 'Not authorized' }

    // Database operation
    const { data, error } = await supabase.from('table').insert({...})
    if (error) throw error

    // Revalidate affected pages
    revalidatePath('/path/where/data/shows')

    return { success: true, data }
  } catch (error) {
    console.error('[v0] Error in myAction:', error)
    return { success: false, error: error?.message || 'Something went wrong' }
  }
}
```

#### Client Component Pattern

```typescript
'use client'

import { useState } from 'react'
import { myAction } from '@/app/actions/...'

interface MyComponentProps {
  initialData?: Data
}

export function MyComponent({ initialData }: MyComponentProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleAction = async () => {
    setIsLoading(true)
    setError('')
    try {
      const result = await myAction('param')
      if (!result.success) {
        setError(result.error || 'Failed')
        return
      }
      // Handle success
    } catch (err) {
      setError('An error occurred')
      console.error('[v0] Error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      {error && <div className="text-red-500">{error}</div>}
      <button onClick={handleAction} disabled={isLoading}>
        {isLoading ? 'Loading...' : 'Click me'}
      </button>
    </div>
  )
}
```

### Debugging

#### Console Logging Pattern

Always use `[v0]` prefix for app logs:

```typescript
console.log('[v0] Component mounted with props:', props)
console.error('[v0] Error in action:', error)
```

This makes logs easy to find and distinguish from library logs.

#### Common Debugging Scenarios

**Session Issues**:
```typescript
const supabase = createClient()
const { data: { session } } = await supabase.auth.getSession()
console.log('[v0] Current session:', session)
```

**RLS Permissions**:
```typescript
// If getting empty results or permission errors
// 1. Check user is authenticated
// 2. Check user is in organization
// 3. Check RLS policies in database

const user = await getCurrentUser()
const orgs = await getUserOrganizations()
console.log('[v0] User:', user?.id, 'Orgs:', orgs.length)
```

**Page Rendering Issues**:
```typescript
// Add at top of server component
console.log('[v0] Rendering page with params:', params)

const data = await fetchData()
console.log('[v0] Fetched data:', data)
```

### Adding New Features

#### Steps to Add a New Feature

1. **Plan the Feature**
   - What data entities are involved?
   - What permissions apply?
   - What pages/components needed?

2. **Database Changes**
   - If new table/columns needed, create migration
   - Add RLS policies
   - Test policies

3. **Server Actions**
   - Create action functions in `app/actions/`
   - Add permission checks
   - Add validation
   - Add error handling

4. **Frontend**
   - Create page/component
   - Call server actions
   - Handle loading/error states
   - Add form validation

5. **Testing**
   - Test happy path
   - Test error cases
   - Test permissions

#### Example: Adding Task Status Update Feature

**1. Database** (Already done - status field exists)

**2. Server Action** (in `app/actions/tasks.ts`):
```typescript
export async function updateTaskStatus(
  taskId: string,
  status: 'todo' | 'in_progress' | 'completed'
) {
  const user = await getCurrentUser()
  if (!user) return { success: false, error: 'Not authenticated' }

  const supabase = await createClient()
  
  // Verify user has access to task
  const { data: task } = await supabase.from('tasks').select().eq('id', taskId).single()
  if (!task) return { success: false, error: 'Task not found' }

  const { data: project } = await supabase.from('projects').select().eq('id', task.project_id).single()
  if (!project) return { success: false, error: 'Project not found' }

  // Check org membership
  const { data: member } = await supabase
    .from('organization_members')
    .select()
    .eq('organization_id', project.organization_id)
    .eq('user_id', user.id)
    .single()
  
  if (!member) return { success: false, error: 'Not authorized' }

  // Update status
  const { error } = await supabase.from('tasks').update({ status }).eq('id', taskId)
  if (error) return { success: false, error: error.message }

  revalidatePath(`/dashboard/project/${project.id}`)
  return { success: true }
}
```

**3. Frontend** (in a component):
```typescript
'use client'

import { updateTaskStatus } from '@/app/actions/tasks'

export function TaskStatusButton({ taskId, currentStatus }) {
  const [isLoading, setIsLoading] = useState(false)

  const nextStatus = currentStatus === 'todo' ? 'in_progress' : 'completed'

  const handleClick = async () => {
    setIsLoading(true)
    const result = await updateTaskStatus(taskId, nextStatus)
    if (!result.success) {
      alert(result.error)
    }
    setIsLoading(false)
  }

  return (
    <button onClick={handleClick} disabled={isLoading}>
      Move to {nextStatus}
    </button>
  )
}
```

---

## Common Tasks & Patterns

### How to Query Data from Supabase

#### In Server Actions

```typescript
const supabase = await createClient()

// Select all
const { data, error } = await supabase.from('table').select()

// Select with filter
const { data } = await supabase.from('tasks').select().eq('status', 'todo')

// Select single row
const { data } = await supabase.from('tasks').select().eq('id', id).single()

// Select with joins
const { data } = await supabase.from('tasks').select(`
  *,
  project:projects(id, name),
  assigned_to:assigned_to_id(first_name, last_name)
`).eq('id', taskId).single()

// Select with filters
const { data } = await supabase.from('tasks')
  .select()
  .eq('project_id', projectId)
  .eq('status', 'in_progress')
  .order('created_at', { ascending: false })
```

#### In Client Components

```typescript
const supabase = createClient()

const { data, error } = await supabase.from('table').select()
```

### How to Update Data

```typescript
const { error } = await supabase
  .from('table')
  .update({ field: newValue })
  .eq('id', id)

if (error) throw error

// Don't forget to revalidate!
revalidatePath('/affected/page')
```

### How to Delete Data

```typescript
const { error } = await supabase
  .from('table')
  .delete()
  .eq('id', id)

if (error) throw error

revalidatePath('/affected/page')
```

### How to Insert Data

```typescript
const { data, error } = await supabase
  .from('table')
  .insert([
    {
      field1: value1,
      field2: value2,
    }
  ])
  .select()

if (error) throw error

revalidatePath('/affected/page')
return data[0]
```

### How to Handle Dates

```typescript
// Store as ISO string or timestamp
const dueDate = new Date('2026-06-01').toISOString() // ✅ Correct

// In component, parse back
const date = new Date(task.due_date) // Returns Date object

// Format for display
const formatted = date.toLocaleDateString('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric'
}) // "Jun 01, 2026"

// Check if overdue
const isOverdue = new Date() > new Date(task.due_date)
```

### How to Handle Errors

```typescript
try {
  const result = await someAction()
  if (!result.success) {
    // Set error state
    setError(result.error)
    return
  }
  // Handle success
} catch (error) {
  // Unexpected error
  console.error('[v0] Unexpected error:', error)
  setError('An unexpected error occurred')
}
```

### How to Handle Loading States

```typescript
const [isLoading, setIsLoading] = useState(false)

const handleAction = async () => {
  setIsLoading(true)
  try {
    await myAction()
  } finally {
    setIsLoading(false) // Always reset
  }
}

return (
  <button disabled={isLoading}>
    {isLoading ? 'Loading...' : 'Click me'}
  </button>
)
```

---

## Known Issues & Limitations

### Current Limitations

1. **Email Confirmation Required**
   - Supabase has email confirmation enabled by default
   - User cannot login until email is confirmed
   - Can be disabled in Supabase Settings → Auth
   - Future: Implement invite links for non-existing users

2. **No Real-Time Updates**
   - Changes require page refresh
   - Future: Add Supabase Realtime subscriptions

3. **No File Uploads**
   - No task attachments
   - Future: Integrate Vercel Blob or Supabase Storage

4. **No Notifications**
   - No email/in-app notifications
   - Future: Add notification system

5. **No Search or Full-Text**
   - No task search functionality
   - Future: Add Postgres full-text search

6. **Limited Filtering**
   - Only basic filters (status, priority, assignee)
   - Future: Advanced filters, saved views

### Potential Issues & Troubleshooting

#### "Not authenticated" errors

**Cause**: User session is invalid or expired  
**Fix**:
1. Logout and login again
2. Check browser cookies (DevTools → Application → Cookies)
3. Verify Supabase keys are correct

#### "Not authorized" / permission errors

**Cause**: User doesn't have permission for operation  
**Check**:
- Is user a member of the organization?
- Do they have the required role (admin/member)?
- Is it a creator-only action?

#### "Column not found" errors

**Cause**: Database schema mismatch  
**Fix**:
1. Run database migration again
2. Verify schema in Supabase dashboard
3. Restart dev server

#### White screen on page load

**Cause**: Middleware or initialization error  
**Fix**:
1. Check browser console for errors
2. Verify environment variables are set
3. Check dev server terminal for error messages

#### Tasks not appearing

**Cause**: RLS policies blocking query  
**Fix**:
1. Verify user is org member
2. Verify project belongs to org
3. Check RLS policies in database

---

## Testing Instructions

### Manual Testing Checklist

#### Authentication
- [ ] Can sign up with email/password
- [ ] Profile created automatically
- [ ] Can login with created credentials
- [ ] Session persists on page reload
- [ ] Can logout
- [ ] Redirects to login when not authenticated

#### Organization Management
- [ ] Can create organization
- [ ] Creator becomes admin
- [ ] Can view organization
- [ ] Can list organization members
- [ ] Admin can add member by email
- [ ] Admin can remove member
- [ ] Regular member cannot manage members

#### Project Management
- [ ] Can create project in organization
- [ ] Creator becomes owner
- [ ] All org members can see projects
- [ ] Can edit project details
- [ ] Only owner can delete project
- [ ] Deleted project removes all tasks

#### Task Management
- [ ] Can create task in project
- [ ] Can set priority and due date
- [ ] Can assign to team member
- [ ] Can update task properties
- [ ] Can change task status
- [ ] Task creator can delete task
- [ ] Overdue tasks are marked
- [ ] Can filter tasks by status/priority

#### Task Comments
- [ ] Can add comment to task
- [ ] Comment appears immediately
- [ ] Can view all comments
- [ ] Can delete own comment
- [ ] Cannot delete others' comments

#### Dashboard
- [ ] Shows task statistics correctly
- [ ] Shows organizations
- [ ] Shows recent tasks
- [ ] Filters and searches work

### Testing Edge Cases

1. **No Organizations**
   - New user sees empty state
   - Prompt to create organization

2. **Organization with No Projects**
   - Shows empty projects list
   - Prompt to create project

3. **Project with No Tasks**
   - Shows empty tasks list
   - Prompt to create task

4. **Overdue Tasks**
   - Past due date tasks are marked
   - Shows count in dashboard

5. **Completed Tasks**
   - Completed tasks appear in "completed" filter
   - Can reopen (change status back)

6. **Unassigned Tasks**
   - Can create unassigned task
   - Can assign later

7. **Permission Boundaries**
   - Non-admin cannot access member management
   - Non-creator cannot delete task
   - Non-member cannot access organization

---

## Deployment Guide

### Deploy to Vercel

#### Prerequisites
- GitHub repository with code
- Vercel account
- Supabase project created

#### Steps

1. **Push code to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Import in Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Select GitHub repository
   - Click "Import"

3. **Configure Environment Variables**
   - In Vercel project settings, go to Environment Variables
   - Add:
     ```
     NEXT_PUBLIC_SUPABASE_URL=your_url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
     ```
   - Click "Save"

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Get production URL

5. **Update Supabase Redirect URLs**
   - Go to Supabase project settings
   - Auth → URL Configuration
   - Add production URL to redirect allowlist:
     ```
     https://your-production-url.vercel.app/auth/callback
     ```

6. **Test Production**
   - Visit production URL
   - Test signup, login, core features
   - Check browser console for errors

### Production Checklist

- [ ] Environment variables set in Vercel
- [ ] Supabase redirect URLs configured
- [ ] Email verification enabled/configured
- [ ] Database backups enabled
- [ ] Monitoring/error tracking set up
- [ ] Custom domain configured (optional)
- [ ] SSL certificate enabled
- [ ] Rate limiting configured (optional)

### Monitoring & Maintenance

**Regular Tasks**:
- Check error logs in Supabase
- Monitor Vercel deployment logs
- Review RLS policies for gaps
- Update dependencies quarterly

**Scaling**:
- Supabase auto-scales database
- Vercel handles unlimited traffic
- Consider adding caching layer if needed

---

## Summary for AI Tools

This Team Task Manager application is a **production-ready, full-stack SaaS application** built with modern tech (Next.js 16, TypeScript, Supabase, Tailwind CSS).

### Key Points for Quick Understanding

1. **Technology**: Next.js 16 (App Router) + React 19 + TypeScript + Tailwind + Supabase
2. **Architecture**: Server Actions (no REST API) + Server Components + RLS
3. **Security**: Row Level Security at database, role-based access control, server-side validation
4. **Data Model**: Organizations → Projects → Tasks (hierarchical)
5. **Permissions**: Admin/Member roles with database-enforced RLS policies
6. **Features**: Auth, org/project/task management, comments, dashboard, filtering

### File Summary

```
Actions (Business Logic): app/actions/ (23 functions)
Pages & Components: app/ + components/ (13 pages + 2 main components)
Supabase Setup: lib/supabase/ (3 client files)
Database: 6 tables with comprehensive RLS policies
```

### To Continue Development

1. Read this file top-to-bottom for architecture understanding
2. Review the actual code files for implementation details
3. Check `lib/supabase/server.ts` for database query patterns
4. Check `app/actions/*.ts` for permission/validation patterns
5. Check `app/dashboard/*/page.tsx` for UI patterns
6. Use server actions pattern for new features
7. Always add RLS policies for new tables
8. Test permissions thoroughly

---

**Document Version**: 1.0  
**Last Updated**: 2026-05-10  
**App Status**: ✅ Production Ready