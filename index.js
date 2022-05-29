const express = require("express");
const axios = require("axios"); // HTTP request library
const path = require("path");
const PORT = process.env.PORT || 8000;
const db = require("./config");
// const logger = require('morgan'); // Logger


/* Express Setup */
// Use Express to create the application
const app = express();

// Set up Logger
// app.use(logger('dev'));

// Set views
app.set("views", path.join(__dirname, "views"));

// Set the view engine to use Pug
app.set("view engine", "pug");

// Set the stylesheets as static
app.use(express.static(path.join(__dirname, 'public')));


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

// Error Handling
app.use((req, res) => { 
  res.statusCode = 404;
  res.end("404 Error... Page cannot be found! Please contact an administrator.");
})


// Database connection
// db.getConnection(function (err, connection) {
//   if (err) {
//     console.log("Error: Something went wrong! " + err.stack);
//    }
  // Test MySQL Database Connection
  db.query('SELECT * FROM et2g6mv72e6t4f88.mariners', function (err, results, fields) {
    if (err) throw err;
    console.log("Connection successful!");
    console.log(results);
    console.log(fields);
    db.release();
  })
// });

// Set the application to listen on a port for requests
app.listen(PORT, () => {
  console.log(`Listening to requests on http://localhost:${PORT}...`);
});