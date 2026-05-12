const { Router } = require('express');
const Joi = require('joi');
const ctrl = require('../controllers/tasks.controller');
const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

const router = Router({ mergeParams: true });

const createSchema = {
  params: Joi.object({ projectId: Joi.string().uuid().required() }),
  body: Joi.object({
    title: Joi.string().max(500).required(),
    description: Joi.string().max(5000).allow(null, ''),
    priority: Joi.string().valid('low', 'medium', 'high').default('medium'),
    dueDate: Joi.date().iso().allow(null),
    assignedToId: Joi.string().uuid().allow(null),
  }),
};

const listSchema = {
  params: Joi.object({ projectId: Joi.string().uuid().required() }),
  query: Joi.object({
    status: Joi.string().valid('todo', 'in_progress', 'completed'),
    priority: Joi.string().valid('low', 'medium', 'high'),
    assignedTo: Joi.string().uuid(),
  }),
};

const taskParam = {
  params: Joi.object({
    projectId: Joi.string().uuid().required(),
    taskId: Joi.string().uuid().required(),
  }),
};

const updateSchema = {
  ...taskParam,
  body: Joi.object({
    title: Joi.string().max(500),
    description: Joi.string().max(5000).allow(null, ''),
    status: Joi.string().valid('todo', 'in_progress', 'completed'),
    priority: Joi.string().valid('low', 'medium', 'high'),
    dueDate: Joi.date().iso().allow(null),
    assignedToId: Joi.string().uuid().allow(null),
  }).min(1),
};

router.post('/', authenticate, validate(createSchema), ctrl.create);
router.get('/', authenticate, validate(listSchema), ctrl.list);
router.get('/:taskId', authenticate, validate(taskParam), ctrl.getDetails);
router.patch('/:taskId', authenticate, validate(updateSchema), ctrl.update);
router.delete('/:taskId', authenticate, validate(taskParam), ctrl.remove);

module.exports = router;
