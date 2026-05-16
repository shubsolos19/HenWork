/**
 * Route aggregator — mounts all route modules under /api.
 */
const { Router } = require('express');

const authRoutes = require('./auth.routes');
const organizationsRoutes = require('./organizations.routes');
const projectsRoutes = require('./projects.routes');
const tasksRoutes = require('./tasks.routes');
const commentsRoutes = require('./comments.routes');
const dashboardRoutes = require('./dashboard.routes');
const attachmentsRoutes = require('./attachments.routes');

const router = Router();

router.use('/auth', authRoutes);
router.use('/organizations', organizationsRoutes);
router.use('/organizations/:orgId/projects', projectsRoutes);
router.use('/projects/:projectId/tasks', tasksRoutes);
router.use('/tasks', tasksRoutes);
router.use('/tasks/:taskId/comments', commentsRoutes);
router.use('/attachments', attachmentsRoutes);
router.use('/dashboard', dashboardRoutes);

module.exports = router;
