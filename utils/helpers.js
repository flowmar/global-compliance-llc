const db = require('../config.js');
const mysql = require('mysql2');
exports.getAllEmployers = async (_req, res) => {
  const employerSQL = 'SELECT * FROM Employers';
  const employer_query = mysql.format(employerSQL);

  const employerRows = await db.query(employer_query);
  // Parse the result and place the employerName into the object
  let employerJSON = JSON.parse(JSON.stringify(employerRows[0]));

  return employerJSON[0];
}