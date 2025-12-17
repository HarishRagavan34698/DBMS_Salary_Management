const db = require('../db');

// Get all employees
async function getAll() {
  const conn = await db.getConnection();
  const result = await conn.execute('SELECT * FROM employee');
  await conn.close();
  return result.rows;
}

// Insert employee
async function insert(emp) {
  const conn = await db.getConnection();
  await conn.execute(
    `INSERT INTO employee (EID, Name, Designation, Joining_Date, SID)
     VALUES (:EID, :Name, :Designation, :Joining_Date, :SID)`,
    emp,
    { autoCommit: true }
  );
  await conn.close();
}

module.exports = { getAll, insert };
