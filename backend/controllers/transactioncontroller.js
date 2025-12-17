const transactionModel = require('../models/Transaction_Date');

async function getTransactions(req, res) {
  try {
    const transactions = await transactionModel.getAll();
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function addTransaction(req, res) {
  try {
    await transactionModel.insert(req.body);
    res.json({ message: 'Transaction added successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  getTransactions,
  addTransaction
};
