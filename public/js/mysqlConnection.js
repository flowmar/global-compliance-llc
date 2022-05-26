const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'globalc',
  database: 'global_compliance'
})

connection.query('SELECT * FROM client_schedule.appointments', function (err, results, fields) {
  console.log(results);
  console.log(fields);
});