/**
 * Tasks Service — CRUD operations for tasks within projects.
 */

const { adminClient } = require('../config/supabase');
const { AppError } = require('../utils/errors');
const {
  verifyProjectAccess,
  verifyTaskAccess,
  verifyTaskCreator,
  verifyTaskAssignmentManager,
  verifyOrgMembership,
} = require('../utils/permissions');

/**
 * Create a new task in a project.
 */
async function createTask(supabase, userId, projectId, {
  title,
  description,
  priority,
  dueDate,
  assignedToId,
}) {
  await verifyProjectAccess(supabase, userId, projectId);

  // If assigning, verify the assignee is an org member
  if (assignedToId) {
    const { data: project } = await supabase
      .from('projects')
      .select('organization_id')
      .eq('id', projectId)
      .single();

    const { data: member } = await supabase
      .from('organization_members')
      .select('id')
      .eq('organization_id', project.organization_id)
      .eq('user_id', assignedToId)
      .single();

    if (!member) {
      throw new AppError('Assigned user is not a member of this organization', 400);
    }
  }

  const { data, error } = await supabase
    .from('tasks')
    .insert({
      project_id: projectId,
      created_by_id: userId,
      assigned_to_id: assignedToId || null,
      title,
      description: description || null,
      status: 'todo',
      priority: priority || 'medium',
      due_date: dueDate || null,
    })
    .select()
    .single();

  if (error) {
    throw new AppError(error.message, 400);
  }

  return data;
}

const { anonymizeProfile } = require('../utils/privacy');

/**
 * Get tasks in a project with optional filtering.
 */
async function getProjectTasks(supabase, userId, projectId, filters = {}) {
  const { membership, project } = await verifyProjectAccess(supabase, userId, projectId);
  const isAdmin = membership.role === 'admin';
  const orgId = project.organization_id;

  let query = supabase
    .from('tasks')
    .select('*')
    .eq('project_id', projectId);

  if (filters.status) {
    query = query.eq('status', filters.status);
  }
  if (filters.priority) {
    query = query.eq('priority', filters.priority);
  }
  if (filters.assignedTo) {
    query = query.eq('assigned_to_id', filters.assignedTo);
  }

  query = query.order('created_at', { ascending: false });

  const { data, error } = await query;

  if (error) {
    throw new AppError(error.message, 400);
  }

  // Enrich tasks with assignee profile info
  const enriched = await Promise.all(
    (data || []).map(async (task) => {
      // Get all assignments for this task
      const { data: assignments } = await supabase
        .from('task_assignments')
        .select('user_id')
        .eq('task_id', task.id);

      const assignees = await Promise.all(
        (assignments || []).map(async (asgn) => {
          const { data: memberData } = await supabase
            .from('organization_members')
            .select('role')
            .eq('organization_id', orgId)
            .eq('user_id', asgn.user_id)
            .single();

          const { data: profile } = await adminClient
            .from('profiles')
            .select('id, first_name, last_name, avatar_url')
            .eq('id', asgn.user_id)
            .single();

          return anonymizeProfile(profile, memberData?.role, isAdmin, asgn.user_id === userId);
        })
      );

      // Enrich creator
      const { data: creatorMember } = await supabase
        .from('organization_members')
        .select('role')
        .eq('organization_id', orgId)
        .eq('user_id', task.created_by_id)
        .single();

      const { data: creatorProfile } = await adminClient
        .from('profiles')
        .select('id, first_name, last_name, avatar_url')
        .eq('id', task.created_by_id)
        .single();
      
      const creator = anonymizeProfile(creatorProfile, creatorMember?.role, isAdmin, task.created_by_id === userId);

      return { ...task, assignees, creator };
    })
  );

  return enriched;
}

/**
 * Get task details with comments and assignee info.
 */
async function getTaskDetails(supabase, userId, taskId) {
  const { task, membership, project } = await verifyTaskAccess(supabase, userId, taskId);
  const isAdmin = membership.role === 'admin';
  const orgId = project.organization_id;

  // Get assignments
  const { data: assignments } = await supabase
    .from('task_assignments')
    .select('user_id, assigned_by, assigned_at')
    .eq('task_id', taskId);

  const enrichedAssignees = await Promise.all(
    (assignments || []).map(async (asgn) => {
      const { data: memberData } = await supabase
        .from('organization_members')
        .select('role')
        .eq('organization_id', orgId)
        .eq('user_id', asgn.user_id)
        .single();

      const { data: profile } = await adminClient
        .from('profiles')
        .select('id, first_name, last_name, avatar_url')
        .eq('id', asgn.user_id)
        .single();
      
      return { 
        ...asgn, 
        profile: anonymizeProfile(profile, memberData?.role, isAdmin, asgn.user_id === userId) 
      };
    })
  );

  // Get creator profile
  const { data: creatorMember } = await supabase
    .from('organization_members')
    .select('role')
    .eq('organization_id', orgId)
    .eq('user_id', task.created_by_id)
    .single();

  const { data: creatorProfile } = await adminClient
    .from('profiles')
    .select('id, first_name, last_name, avatar_url')
    .eq('id', task.created_by_id)
    .single();

  const creator = anonymizeProfile(creatorProfile, creatorMember?.role, isAdmin, task.created_by_id === userId);

  // Get comments
  const { data: comments } = await supabase
    .from('task_comments')
    .select('*')
    .eq('task_id', taskId)
    .order('created_at', { ascending: true });

  // Enrich comments with author info
  const enrichedComments = await Promise.all(
    (comments || []).map(async (comment) => {
      const { data: authorMember } = await supabase
        .from('organization_members')
        .select('role')
        .eq('organization_id', orgId)
        .eq('user_id', comment.user_id)
        .single();

      const { data: authorProfile } = await adminClient
        .from('profiles')
        .select('id, first_name, last_name, avatar_url')
        .eq('id', comment.user_id)
        .single();

      return { 
        ...comment, 
        author: anonymizeProfile(authorProfile, authorMember?.role, isAdmin, comment.user_id === userId) 
      };
    })
  );

  return {
    ...task,
    assignees: enrichedAssignees,
    creator,
    comments: enrichedComments,
  };
}

/**
 * Update task properties.
 */
async function updateTask(supabase, userId, taskId, updates) {
  await verifyTaskAccess(supabase, userId, taskId);

  // Build update payload — only include fields that were provided
  const payload = { updated_at: new Date().toISOString() };

  if (updates.title !== undefined) payload.title = updates.title;
  if (updates.description !== undefined) payload.description = updates.description;
  if (updates.status !== undefined) payload.status = updates.status;
  if (updates.priority !== undefined) payload.priority = updates.priority;
  if (updates.dueDate !== undefined) payload.due_date = updates.dueDate;
  if (updates.assignedToId !== undefined) payload.assigned_to_id = updates.assignedToId;

  const { data, error } = await supabase
    .from('tasks')
    .update(payload)
    .eq('id', taskId)
    .select()
    .single();

  if (error) {
    throw new AppError(error.message, 400);
  }

  return data;
}

/**
 * Delete a task (creator only).
 */
async function deleteTask(supabase, userId, taskId) {
  await verifyTaskCreator(supabase, userId, taskId);

  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', taskId);

  if (error) {
    throw new AppError(error.message, 400);
  }
}

module.exports = {
  createTask,
  getProjectTasks,
  getTaskDetails,
  updateTask,
  deleteTask,
  assignUser,
  unassignUser,
  getTaskAssignments,
};

/**
 * Assign a user to a task.
 */
async function assignUser(supabase, userId, taskId, targetUserId) {
  const { project } = await verifyTaskAssignmentManager(supabase, userId, taskId);

  // Verify target user is in the organization
  await verifyOrgMembership(supabase, targetUserId, project.organization_id);

  const { data, error } = await supabase
    .from('task_assignments')
    .upsert({
      task_id: taskId,
      user_id: targetUserId,
      assigned_by: userId
    }, { onConflict: 'task_id, user_id' })
    .select()
    .single();

  if (error) {
    throw new AppError(error.message, 400);
  }

  return data;
}

/**
 * Unassign a user from a task.
 */
async function unassignUser(supabase, userId, taskId, targetUserId) {
  await verifyTaskAssignmentManager(supabase, userId, taskId);

  const { error } = await supabase
    .from('task_assignments')
    .delete()
    .eq('task_id', taskId)
    .eq('user_id', targetUserId);

  if (error) {
    throw new AppError(error.message, 400);
  }
}

/**
 * Get all assignees for a task.
 */
async function getTaskAssignments(supabase, userId, taskId) {
  const { task, membership, project } = await verifyTaskAccess(supabase, userId, taskId);
  const isAdmin = membership.role === 'admin';
  const orgId = project.organization_id;

  const { data, error } = await supabase
    .from('task_assignments')
    .select('*')
    .eq('task_id', taskId);

  if (error) {
    throw new AppError(error.message, 400);
  }

  // Enrich with profile info
  const enriched = await Promise.all(
    (data || []).map(async (asgn) => {
      const { data: memberData } = await supabase
        .from('organization_members')
        .select('role')
        .eq('organization_id', orgId)
        .eq('user_id', asgn.user_id)
        .single();

      const { data: profile } = await adminClient
        .from('profiles')
        .select('id, first_name, last_name, avatar_url')
        .eq('id', asgn.user_id)
        .single();
      
      return { 
        ...asgn, 
        profile: anonymizeProfile(profile, memberData?.role, isAdmin, asgn.user_id === userId) 
      };
    })
  );

  return enriched;
}
