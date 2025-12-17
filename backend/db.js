const oracledb = require('oracledb');

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

async function getConnection() {
  return await oracledb.getConnection({
    user: "salary_user",
    password: "pass123",
    connectString: "localhost/XEPDB1"
  });
}

module.exports = { getConnection };
