const { Router } = require('express');
const ctrl = require('../controllers/dashboard.controller');
const { authenticate } = require('../middleware/auth');

const router = Router();

router.get('/stats', authenticate, ctrl.getStats);
router.get('/recent-tasks', authenticate, ctrl.getRecentTasks);

module.exports = router;
