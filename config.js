/*
 * @Author: flowmar
 * @Date: 2022-07-02 23:11:46
 * @Last Modified by: flowmar
 * @Last Modified time: 2023-03-11 21:59:49
 */

const mysql = require('mysql2/promise');
require('dotenv').config();

if (process.env.MACHINE == 'local') {
    // Local config
    const pool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        waitForConnections: true,
        connectionLimit: process.env.CONNECTION_LIMIT,
        queueLimit: 0,
    });

    // pool.pool.query('SELECT * FROM global_compliance.mariners', function (err, results, fields) {
    //   console.log(results);
    // });

    module.exports = pool;
} else {
    // Config for Heroku
    // Make connection
    if (process.env.JAWSDB_URL) {
        pool = mysql.createPool(process.env.JAWSDB_URL);
    } else {
        pool = mysql.createPool({
            port: 3306,
            host: 'ohunm00fjsjs1uzy.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
            user: 'zn26ow89aymc68dd',
            password: 'qekt3b5gz9s5fn84',
            database: 'n4vuqpddmr1cqkdv',
        });
    }

    // Export connection
    module.exports = pool;
}
