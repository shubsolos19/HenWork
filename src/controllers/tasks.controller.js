const taskService = require('../services/tasks.service');
const { success, created, noContent } = require('../utils/response');

exports.create = async (req, res, next) => {
  try {
    const task = await taskService.createTask(req.supabase, req.user.id, req.params.projectId, req.body);
    return created(res, task);
  } catch (err) { next(err); }
};

exports.list = async (req, res, next) => {
  try {
    const tasks = await taskService.getProjectTasks(req.supabase, req.user.id, req.params.projectId, req.query);
    return success(res, tasks);
  } catch (err) { next(err); }
};

exports.getDetails = async (req, res, next) => {
  try {
    const task = await taskService.getTaskDetails(req.supabase, req.user.id, req.params.taskId);
    return success(res, task);
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const task = await taskService.updateTask(req.supabase, req.user.id, req.params.taskId, req.body);
    return success(res, task);
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    await taskService.deleteTask(req.supabase, req.user.id, req.params.taskId);
    return noContent(res);
  } catch (err) { next(err); }
};

exports.assign = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const { userId: targetUserId } = req.body;
    const assignment = await taskService.assignUser(req.supabase, req.user.id, taskId, targetUserId);
    return created(res, assignment);
  } catch (err) { next(err); }
};

exports.unassign = async (req, res, next) => {
  try {
    const { taskId, userId: targetUserId } = req.params;
    await taskService.unassignUser(req.supabase, req.user.id, taskId, targetUserId);
    return noContent(res);
  } catch (err) { next(err); }
};

exports.getAssignments = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const assignments = await taskService.getTaskAssignments(req.supabase, req.user.id, taskId);
    return success(res, assignments);
  } catch (err) { next(err); }
};
