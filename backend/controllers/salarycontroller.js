const salaryModel = require('../models/Salary');

async function getSalaries(req, res) {
  try {
    const salaries = await salaryModel.getAll();
    res.json(salaries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function addSalary(req, res) {
  try {
    await salaryModel.insert(req.body);
    res.json({ message: 'Salary record added successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  getSalaries,
  addSalary
};
