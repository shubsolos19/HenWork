const orgService = require('../services/organizations.service');
const { success, created, noContent } = require('../utils/response');

exports.create = async (req, res, next) => {
  try {
    const org = await orgService.createOrganization(req.supabase, req.user.id, req.body);
    return created(res, org);
  } catch (err) { next(err); }
};

exports.list = async (req, res, next) => {
  try {
    const orgs = await orgService.getUserOrganizations(req.supabase, req.user.id);
    return success(res, orgs);
  } catch (err) { next(err); }
};

exports.getDetails = async (req, res, next) => {
  try {
    const org = await orgService.getOrganizationDetails(req.supabase, req.user.id, req.params.orgId);
    return success(res, org);
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const org = await orgService.updateOrganization(req.supabase, req.user.id, req.params.orgId, req.body);
    return success(res, org);
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    await orgService.deleteOrganization(req.supabase, req.user.id, req.params.orgId);
    return noContent(res);
  } catch (err) { next(err); }
};

exports.listMembers = async (req, res, next) => {
  try {
    const members = await orgService.getOrganizationMembers(req.supabase, req.user.id, req.params.orgId);
    return success(res, members);
  } catch (err) { next(err); }
};

exports.addMember = async (req, res, next) => {
  try {
    const member = await orgService.addMember(req.supabase, req.user.id, req.params.orgId, req.body);
    return created(res, member);
  } catch (err) { next(err); }
};

exports.updateMember = async (req, res, next) => {
  try {
    const member = await orgService.updateMemberRole(
      req.supabase, req.user.id, req.params.orgId, req.params.memberId, req.body.role
    );
    return success(res, member);
  } catch (err) { next(err); }
};

exports.removeMember = async (req, res, next) => {
  try {
    await orgService.removeMember(req.supabase, req.user.id, req.params.orgId, req.params.memberId);
    return noContent(res);
  } catch (err) { next(err); }
};
