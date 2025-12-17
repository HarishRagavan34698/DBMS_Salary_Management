const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactioncontroller');

// GET all transactions
router.get('/', transactionController.getTransactions);

// INSERT transaction
router.post('/', transactionController.addTransaction);

module.exports = router;
