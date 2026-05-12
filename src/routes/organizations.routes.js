const { Router } = require('express');
const Joi = require('joi');
const ctrl = require('../controllers/organizations.controller');
const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

const router = Router();

const uuidParam = { params: Joi.object({ orgId: Joi.string().uuid().required() }) };

const createSchema = {
  body: Joi.object({
    name: Joi.string().max(200).required(),
    description: Joi.string().max(2000).allow(null, ''),
  }),
};

const updateSchema = {
  ...uuidParam,
  body: Joi.object({
    name: Joi.string().max(200),
    description: Joi.string().max(2000).allow(null, ''),
  }).min(1),
};

const addMemberSchema = {
  ...uuidParam,
  body: Joi.object({
    email: Joi.string().email().required(),
    role: Joi.string().valid('admin', 'member').default('member'),
  }),
};

const updateMemberSchema = {
  params: Joi.object({
    orgId: Joi.string().uuid().required(),
    memberId: Joi.string().uuid().required(),
  }),
  body: Joi.object({
    role: Joi.string().valid('admin', 'member').required(),
  }),
};

const memberParam = {
  params: Joi.object({
    orgId: Joi.string().uuid().required(),
    memberId: Joi.string().uuid().required(),
  }),
};

// Org CRUD
router.post('/', authenticate, validate(createSchema), ctrl.create);
router.get('/', authenticate, ctrl.list);
router.get('/:orgId', authenticate, validate(uuidParam), ctrl.getDetails);
router.patch('/:orgId', authenticate, validate(updateSchema), ctrl.update);
router.delete('/:orgId', authenticate, validate(uuidParam), ctrl.remove);

// Member management
router.get('/:orgId/members', authenticate, validate(uuidParam), ctrl.listMembers);
router.post('/:orgId/members', authenticate, validate(addMemberSchema), ctrl.addMember);
router.patch('/:orgId/members/:memberId', authenticate, validate(updateMemberSchema), ctrl.updateMember);
router.delete('/:orgId/members/:memberId', authenticate, validate(memberParam), ctrl.removeMember);

module.exports = router;
