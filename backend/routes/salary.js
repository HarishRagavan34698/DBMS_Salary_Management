const express = require('express');
const router = express.Router();
const salaryController = require('../controllers/salarycontroller');

// GET all salaries
router.get('/', salaryController.getSalaries);

// INSERT salary
router.post('/', salaryController.addSalary);

module.exports = router;
