const mysql = require("mysql2");

// Local config
const pool = mysql.createPool({
  host: 'localhost',
  user: 'globalc',
  password: 'c0mplianT?',
  database: 'global_compliance',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// // Config for Heroku
// const hpool = mysql.createPool({
//   host: 'eyvqcfxf5reja3nv.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
//   user: 'nqz7brmzxbdnzm48',
//   password: 'umo5swm6ewqpi3py',
//   port: 3306,
//   database: 'et2g6mv72e6t4f88',
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0
// });

// pool.connect(function (err) {
//   if (err) {
//     console.error('error connecting: ' + err.stack)
//     return
//   }
//   console.log('Connected as id ' + connection.threadId);
// });



module.exports = {
  getConnection: (callback) => {
    return pool.getConnection(callback);
  }
}