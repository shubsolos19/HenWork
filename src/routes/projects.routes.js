const { Router } = require('express');
const Joi = require('joi');
const ctrl = require('../controllers/projects.controller');
const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

const router = Router({ mergeParams: true }); // mergeParams to access :orgId

const createSchema = {
  params: Joi.object({ orgId: Joi.string().uuid().required() }),
  body: Joi.object({
    name: Joi.string().max(200).required(),
    description: Joi.string().max(2000).allow(null, ''),
  }),
};

const detailParam = {
  params: Joi.object({
    orgId: Joi.string().uuid().required(),
    projectId: Joi.string().uuid().required(),
  }),
};

const updateSchema = {
  ...detailParam,
  body: Joi.object({
    name: Joi.string().max(200),
    description: Joi.string().max(2000).allow(null, ''),
  }).min(1),
};

router.post('/', authenticate, validate(createSchema), ctrl.create);
router.get('/', authenticate, ctrl.list);
router.get('/:projectId', authenticate, validate(detailParam), ctrl.getDetails);
router.patch('/:projectId', authenticate, validate(updateSchema), ctrl.update);
router.delete('/:projectId', authenticate, validate(detailParam), ctrl.remove);

module.exports = router;
