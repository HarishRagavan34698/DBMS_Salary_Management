const leaveModel = require('../models/Leave_Record');

async function getLeaves(req, res) {
  try {
    const leaves = await leaveModel.getAll();
    res.json(leaves);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function addLeave(req, res) {
  try {
    await leaveModel.insert(req.body);
    res.json({ message: 'Leave record added successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  getLeaves,
  addLeave
};
