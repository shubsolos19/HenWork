const attachmentService = require('../services/attachments.service');
const { success, created } = require('../utils/response');

const uploadAttachment = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const data = await attachmentService.uploadAttachment(
      req.supabase,
      req.user.id,
      taskId,
      req.body
    );
    return created(res, data);
  } catch (err) {
    next(err);
  }
};

const getTaskAttachments = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const data = await attachmentService.getTaskAttachments(req.supabase, req.user.id, taskId);
    return success(res, data);
  } catch (err) {
    next(err);
  }
};

const deleteAttachment = async (req, res, next) => {
  try {
    const { attachmentId } = req.params;
    const data = await attachmentService.deleteAttachment(req.supabase, req.user.id, attachmentId);
    return success(res, data);
  } catch (err) {
    next(err);
  }
};

const getDownloadUrl = async (req, res, next) => {
  try {
    const { attachmentId } = req.params;
    const data = await attachmentService.getDownloadUrl(req.supabase, req.user.id, attachmentId);
    return success(res, data);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  uploadAttachment,
  getTaskAttachments,
  deleteAttachment,
  getDownloadUrl
};
