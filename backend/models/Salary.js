const db = require('../db');

async function getAll() {
  const conn = await db.getConnection();
  const result = await conn.execute(
    'SELECT * FROM salary'
  );
  await conn.close();
  return result.rows;
}

async function insert(salary) {
  const conn = await db.getConnection();
  await conn.execute(
    `INSERT INTO salary (SID, Basic, Allowance)
     VALUES (:sid, :basic, :allowance)`,
    salary,
    { autoCommit: true }
  );
  await conn.close();
}

module.exports = { getAll, insert };
