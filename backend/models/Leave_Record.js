const db = require('../db');

async function getAll() {
  const conn = await db.getConnection();
  const result = await conn.execute(
    'SELECT * FROM leave_record'
  );
  await conn.close();
  return result.rows;
}

async function insert(leave) {
  const conn = await db.getConnection();
  await conn.execute(
    `INSERT INTO leave_record (EID, Month, Leave_Days)
     VALUES (:eid, :month, :leave_days)`,
    leave,
    { autoCommit: true }
  );
  await conn.close();
}

module.exports = { getAll, insert };
