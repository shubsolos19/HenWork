const express = require('express');
const router = express.Router();
const attachmentController = require('../controllers/attachments.controller');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);

router.get('/task/:taskId', attachmentController.getTaskAttachments);
router.post('/task/:taskId', attachmentController.uploadAttachment);
router.get('/:attachmentId/download', attachmentController.getDownloadUrl);
router.delete('/:attachmentId', attachmentController.deleteAttachment);

module.exports = router;
