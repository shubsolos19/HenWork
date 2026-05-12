const projectService = require('../services/projects.service');
const { success, created, noContent } = require('../utils/response');

exports.create = async (req, res, next) => {
  try {
    const project = await projectService.createProject(req.supabase, req.user.id, req.params.orgId, req.body);
    return created(res, project);
  } catch (err) { next(err); }
};

exports.list = async (req, res, next) => {
  try {
    const projects = await projectService.getProjectsByOrganization(req.supabase, req.user.id, req.params.orgId);
    return success(res, projects);
  } catch (err) { next(err); }
};

exports.getDetails = async (req, res, next) => {
  try {
    const project = await projectService.getProjectDetails(req.supabase, req.user.id, req.params.projectId);
    return success(res, project);
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const project = await projectService.updateProject(req.supabase, req.user.id, req.params.projectId, req.body);
    return success(res, project);
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    await projectService.deleteProject(req.supabase, req.user.id, req.params.projectId);
    return noContent(res);
  } catch (err) { next(err); }
};
