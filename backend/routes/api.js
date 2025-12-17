const express = require('express');
const router = express.Router();

// Import all route modules
const employeeRoutes = require('./employee');
const leaveRoutes = require('./leave');
const salaryRoutes = require('./salary');
const transactionRoutes = require('./transaction');

// Mount routes
router.use('/employees', employeeRoutes);
router.use('/leaves', leaveRoutes);
router.use('/salaries', salaryRoutes);
router.use('/transactions', transactionRoutes);

module.exports = router;
