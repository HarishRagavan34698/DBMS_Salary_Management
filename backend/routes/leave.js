const express = require('express');
const router = express.Router();
const leaveController = require('../controllers/leavecontroller');

// GET all leaves
router.get('/', leaveController.getLeaves);

// INSERT leave
router.post('/', leaveController.addLeave);

module.exports = router;