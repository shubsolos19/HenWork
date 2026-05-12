-- 007: Row Level Security (RLS) policies for all tables
-- These policies enforce organization-based access control at the database level.

-- ═══════════════════════════════════════════════════════
-- PROFILES
-- ═══════════════════════════════════════════════════════

CREATE POLICY "profiles_select_own" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "profiles_insert_own" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "profiles_delete_own" ON public.profiles
  FOR DELETE USING (auth.uid() = id);

-- ═══════════════════════════════════════════════════════
-- ORGANIZATIONS
-- ═══════════════════════════════════════════════════════

CREATE POLICY "orgs_select_member" ON public.organizations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.organization_members
      WHERE organization_id = organizations.id
        AND user_id = auth.uid()
    )
  );

CREATE POLICY "orgs_insert_authenticated" ON public.organizations
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "orgs_update_admin" ON public.organizations
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.organization_members
      WHERE organization_id = organizations.id
        AND user_id = auth.uid()
        AND role = 'admin'
    )
  );

CREATE POLICY "orgs_delete_owner" ON public.organizations
  FOR DELETE USING (auth.uid() = owner_id);

-- ═══════════════════════════════════════════════════════
-- ORGANIZATION MEMBERS
-- ═══════════════════════════════════════════════════════

CREATE POLICY "org_members_select" ON public.organization_members
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.organization_members om
      WHERE om.organization_id = organization_members.organization_id
        AND om.user_id = auth.uid()
    )
  );

CREATE POLICY "org_members_insert_admin" ON public.organization_members
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.organization_members om
      WHERE om.organization_id = organization_members.organization_id
        AND om.user_id = auth.uid()
        AND om.role = 'admin'
    )
  );

CREATE POLICY "org_members_update_admin" ON public.organization_members
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.organization_members om
      WHERE om.organization_id = organization_members.organization_id
        AND om.user_id = auth.uid()
        AND om.role = 'admin'
    )
  );

CREATE POLICY "org_members_delete_admin" ON public.organization_members
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.organization_members om
      WHERE om.organization_id = organization_members.organization_id
        AND om.user_id = auth.uid()
        AND om.role = 'admin'
    )
  );

-- ═══════════════════════════════════════════════════════
-- PROJECTS
-- ═══════════════════════════════════════════════════════

CREATE POLICY "projects_select_member" ON public.projects
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.organization_members
      WHERE organization_id = projects.organization_id
        AND user_id = auth.uid()
    )
  );

CREATE POLICY "projects_insert_member" ON public.projects
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.organization_members
      WHERE organization_id = projects.organization_id
        AND user_id = auth.uid()
    )
  );

CREATE POLICY "projects_update_member" ON public.projects
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.organization_members
      WHERE organization_id = projects.organization_id
        AND user_id = auth.uid()
    )
  );

CREATE POLICY "projects_delete_owner" ON public.projects
  FOR DELETE USING (auth.uid() = owner_id);

-- ═══════════════════════════════════════════════════════
-- TASKS
-- ═══════════════════════════════════════════════════════

CREATE POLICY "tasks_select_member" ON public.tasks
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.projects p
      JOIN public.organization_members om ON om.organization_id = p.organization_id
      WHERE p.id = tasks.project_id
        AND om.user_id = auth.uid()
    )
  );

CREATE POLICY "tasks_insert_member" ON public.tasks
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.projects p
      JOIN public.organization_members om ON om.organization_id = p.organization_id
      WHERE p.id = tasks.project_id
        AND om.user_id = auth.uid()
    )
  );

CREATE POLICY "tasks_update_member" ON public.tasks
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.projects p
      JOIN public.organization_members om ON om.organization_id = p.organization_id
      WHERE p.id = tasks.project_id
        AND om.user_id = auth.uid()
    )
  );

CREATE POLICY "tasks_delete_creator" ON public.tasks
  FOR DELETE USING (auth.uid() = created_by_id);

-- ═══════════════════════════════════════════════════════
-- TASK COMMENTS
-- ═══════════════════════════════════════════════════════

CREATE POLICY "comments_select_member" ON public.task_comments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.tasks t
      JOIN public.projects p ON p.id = t.project_id
      JOIN public.organization_members om ON om.organization_id = p.organization_id
      WHERE t.id = task_comments.task_id
        AND om.user_id = auth.uid()
    )
  );

CREATE POLICY "comments_insert_member" ON public.task_comments
  FOR INSERT WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM public.tasks t
      JOIN public.projects p ON p.id = t.project_id
      JOIN public.organization_members om ON om.organization_id = p.organization_id
      WHERE t.id = task_comments.task_id
        AND om.user_id = auth.uid()
    )
  );

CREATE POLICY "comments_delete_author" ON public.task_comments
  FOR DELETE USING (auth.uid() = user_id);
