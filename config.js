const mysql = require("mysql");

// // Local config
// const pool = mysql.createPool({
//   host: 'localhost',
//   user: 'globalc',
//   password: 'c0mplianT?',
//   database: 'global_compliance',
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0
// });

// // Config for Heroku
// const hpool = mysql.createPool({
//   host: 'eyvqcfxf5reja3nv.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
//   user: 'nqz7brmzxbdnzm48',
//   password: 'hmkikezy9mt00fli',
//   port: 3306,
//   database: 'et2g6mv72e6t4f88',
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0
// });

const connection = mysql.createConnection(process.env.JAWSDB_URL);

connection.connect();

connection.query("SELECT * FROM et2g6mv72e6t4f8.Mariners", function (err, rows, fields) {
  if (err) throw err;
  
  console.log('The solution is: ', rows[0].solution);
});

connection.end();

// pool.connect(function (err) {
//   if (err) {
//     console.error('error connecting: ' + err.stack)
//     return
//   }
//   console.log('Connected as id ' + connection.threadId);
// });



module.exports = {
  getConnection: (callback) => {
    // return pool.getConnection(callback);
    return connection;
  }
}