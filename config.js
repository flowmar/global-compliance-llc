/*
 * @Author: flowmar
 * @Date: 2022-07-02 23:11:46
 * @Last Modified by: flowmar
 * @Last Modified time: 2022-07-02 23:16:20
 */

const mysql = require("mysql2/promise");
require("dotenv").config();

if (process.env.MACHINE == 'local') {
  // Local config
  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    waitForConnections: true,
    connectionLimit: process.env.CONNECTION_LIMIT,
    queueLimit: 0
  });

  // pool.pool.query('SELECT * FROM global_compliance.mariners', function (err, results, fields) {
  //   console.log(results);
  // });

  module.exports = pool;
  }

else {
// Config for Heroku
  // Make connection
  if (process.env.JAWSDB_URL) {
    let pool = mysql.createPool(process.env.JAWSDB_URL)
  } else {
    let pool = mysql.createPool({
      port: 3306,
      host: 'eyvqcfxf5reja3nv.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
      user: 'nqz7brmzxbdnzm48',
      password: 'ok7qa3sku1bwqony',
      database: 'et2g6mv72e6t4f88'
    })
  }

  // Export connection
  module.exports = pool;
}
