const employeeModel = require('../models/Employee');

async function getEmployees(req, res) {
  try {
    const employees = await employeeModel.getAll();
    res.json(employees);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function addEmployee(req, res) {
  try {
    await employeeModel.insert(req.body);
    res.json({ message: 'Employee added successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  getEmployees,
  addEmployee
};
