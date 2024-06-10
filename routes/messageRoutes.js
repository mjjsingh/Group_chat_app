const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const messageController = require('../controllers/messageController');

router.post('/send', auth, messageController.sendMessage);
router.get('/fetch', auth, messageController.fetchMessages);
router.get('/all', auth, messageController.getAllMessages);

module.exports = router;

