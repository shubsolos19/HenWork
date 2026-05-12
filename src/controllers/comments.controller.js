const commentService = require('../services/comments.service');
const { success, created, noContent } = require('../utils/response');

exports.create = async (req, res, next) => {
  try {
    const comment = await commentService.addComment(req.supabase, req.user.id, req.params.taskId, req.body.content);
    return created(res, comment);
  } catch (err) { next(err); }
};

exports.list = async (req, res, next) => {
  try {
    const comments = await commentService.getTaskComments(req.supabase, req.user.id, req.params.taskId);
    return success(res, comments);
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    await commentService.deleteComment(req.supabase, req.user.id, req.params.commentId);
    return noContent(res);
  } catch (err) { next(err); }
};
