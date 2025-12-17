const express = require('express');
const router = express.Router();
const controller = require('../controllers/employeecontroller');


router.get('/', controller.getEmployees);
router.post('/', controller.addEmployee);


module.exports = router;