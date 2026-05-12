const dashboardService = require('../services/dashboard.service');
const { success } = require('../utils/response');

exports.getStats = async (req, res, next) => {
  try {
    const stats = await dashboardService.getStats(req.supabase, req.user.id);
    return success(res, stats);
  } catch (err) { next(err); }
};

exports.getRecentTasks = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 10;
    const tasks = await dashboardService.getRecentTasks(req.supabase, req.user.id, limit);
    return success(res, tasks);
  } catch (err) { next(err); }
};
