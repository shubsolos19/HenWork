const { Router } = require('express');
const Joi = require('joi');
const ctrl = require('../controllers/comments.controller');
const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

const router = Router({ mergeParams: true });

const createSchema = {
  params: Joi.object({ taskId: Joi.string().uuid().required() }),
  body: Joi.object({
    content: Joi.string().max(5000).required(),
  }),
};

const deleteSchema = {
  params: Joi.object({
    taskId: Joi.string().uuid().required(),
    commentId: Joi.string().uuid().required(),
  }),
};

const starSchema = {
  params: Joi.object({
    taskId: Joi.string().uuid().required(),
    commentId: Joi.string().uuid().required(),
  }),
};

router.post('/', authenticate, validate(createSchema), ctrl.create);
router.get('/', authenticate, ctrl.list);
router.delete('/:commentId', authenticate, validate(deleteSchema), ctrl.remove);
router.post('/:commentId/star', authenticate, validate(starSchema), ctrl.star);
router.delete('/:commentId/star', authenticate, validate(starSchema), ctrl.unstar);

module.exports = router;
