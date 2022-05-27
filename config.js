const mysql = require("mysql2");


const pool = mysql.createPool({
  host: 'localhost',
  user: 'globalc',
  password: 'c0mplianT?',
  database: 'global_compliance',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

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