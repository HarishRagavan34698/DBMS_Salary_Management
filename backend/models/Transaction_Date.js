const db = require('../db');

async function getAll() {
  const conn = await db.getConnection();
  const result = await conn.execute(
    'SELECT * FROM transaction_record'
  );
  await conn.close();
  return result.rows;
}

async function insert(txn) {
  const conn = await db.getConnection();
  await conn.execute(
    `INSERT INTO transaction_record 
     (TID, EID, Salary_amount, transaction_date)
     VALUES (:tid, :eid, :salary_amount, :transaction_date)`,
    txn,
    { autoCommit: true }
  );
  await conn.close();
}

module.exports = { getAll, insert };
