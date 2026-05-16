const { Router } = require('express');
const Joi = require('joi');
const ctrl = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');
const { validate } = require('../middleware/validate');

const router = Router();

const signUpSchema = {
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(128).required(),
    firstName: Joi.string().max(100).required(),
    lastName: Joi.string().max(100).required(),
  }),
};

const signInSchema = {
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
};

const updateProfileSchema = {
  body: Joi.object({
    first_name: Joi.string().max(100),
    last_name: Joi.string().max(100),
    profile_picture_url: Joi.string().uri().allow(null, ''),
    avatar_url: Joi.string().uri().allow(null, ''),
  }).min(1),
};

router.post('/signup', authLimiter, validate(signUpSchema), ctrl.signUp);
router.post('/login', authLimiter, validate(signInSchema), ctrl.signIn);
router.post('/logout', authenticate, ctrl.signOut);
router.get('/me', authenticate, ctrl.getMe);
router.patch('/me', authenticate, validate(updateProfileSchema), ctrl.updateMe);
router.post('/sync', authenticate, ctrl.syncProfile);

module.exports = router;
