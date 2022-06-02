const express = require("express");
const axios = require("axios"); // HTTP request library
const path = require("path");
require("dotenv").config();
const PORT = process.env.PORT;
const db = require("./config");
const mysql = require('mysql2/promise');
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");



/* Express Setup */
// Use Express to create the application
const app = express();

// Logger Set Up
if (process.env.MACHINE == 'local') {
  const logger = require('morgan'); // Logger
  // Set up Logger
  app.use(logger('dev'));
}


// Set views
app.set("views", path.join(__dirname, "views"));

// Set the view engine to use Pug
app.set("view engine", "pug");

// Set the stylesheets as static
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to read request params
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));


/* Routing */
// Request for root URL
app.get("/", async (req, res) => {
  const query = await axios.get("https://randomuser.me/api/?results=9");
  res.render("index", {
    users: query.data.results,
  title: "Login"});
});

// Request for '/search' URL
app.get("/search", async (req, res) => {
  res.render("search", {
    title: "Search"
  })
})

// Request for '/add' URL
app.get("/add", async (req, res) => {
  res.render("add", {
    title: "Add"
  })
})

// Request for '/reports' URL
app.get("/reports", async (req, res) => {
  res.render("reports", {
    title: "Reports"
  })
})

// Request for '/maintenance' URL
app.get("/maintenance", async (req, res) => {
  res.render("maintenance", {
    title: "Maintenance"
  })
});

// Route for user creation
app.post("/createUser", async (req, res) => {
  const salt = 2;
  console.log(req.body);
  const user = req.body.username;
  console.log("USER:" + user);
  console.log("Pw" + req.body.password);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);
  console.log(hashedPassword);

  // db.pool.getConnection(async (err, connection) => {
  // if (err) throw err;
  const sqlSearch = "SELECT * FROM `users` WHERE user = ?";
  const search_query = mysql.format(sqlSearch, [user]);

  const sqlInsert = "INSERT INTO `users` VALUES (0, ?, ?)";
  const insert_query = mysql.format(sqlInsert, [user, hashedPassword]);

  db.pool.query(search_query, async (err, result) => {
    if (err) throw err;
    console.log("--------> Search Results");
    console.log(result.length);
    if (result.length != 0) {
      console.log("------> User already exists!");
      res.sendStatus(409);
    }
    else {
      db.pool.query(insert_query, (err, result) => {
        if (err) throw err;
        console.log("------> Created new User!");
        console.log(result.insertId);
        res.sendStatus(201);
      });
    }
  });
});

// Route for authentication
app.post("/authenticate", async (req, res) => {
  // Get the input from the request body
  let user = req.body.inputUsername;
  let password = req.body.inputPassword;

  // Create and format the SQL query
  const sqlSearch = 'SELECT * FROM `users` WHERE user = ? ';
  const search_query = mysql.format(sqlSearch, [user]);

  // Search for the username in the database
  db.pool.query(search_query, async (err, result) => {
    if (err) throw err;

    // If no results, user does not exist
    if (result.length == 0) {
      console.log("The user does not exist.");
      res.sendStatus(404);
    }
    else {
      // Otherwise get the hashedPassword
      let hashedPassword = result[0].password;

      // Compare the passwords using bcrypt
      if (await bcrypt.compare(password, hashedPassword)) {
        console.log("Success!");
        res.send(`${user}` + " has successfully logged in!");
      }
      else {
        console.log("Password Incorrect!");
        res.send("Your password was incorrect.");
      }
    }
  });
});

// Error Handling
app.use((req, res) => {
  res.statusCode = 404;
  res.end("404 Error... Page cannot be found! Please contact an administrator.");
});

/** Test Database Connection */
// Test MySQL DB Connection
if (process.env.MACHINE == 'local') {
  // Database connection
  db.getConnection(function (err, connection) {
    if (err) {
      console.log("Error: Something went wrong! " + err.stack);
    }
    else { 
      // Select and print from the Agents table
      connection.query('SELECT * FROM global_compliance.Agents', function (err, results, fields) {
        if (err) throw err;
        console.log(results);
      })
    }
  });
} else {
  // Test MySQL Database Connection
  db.query('SELECT * FROM et2g6mv72e6t4f88.mariners AS items', function (err, results, fields) {
  if (err) throw err;
  console.log("Connection successful!");
  console.log("Results:" + JSON.stringify(results));
  // db.release();
});
}



// Set the application to listen on a port for requests
app.listen(PORT, () => {
  console.log(`Listening to requests on http://localhost:${PORT}...`);
});