/*
 * @Author: flowmar
 * @Date: 2022-07-02 22:56:29
 * @Last Modified by: flowmar
 * @Last Modified time: 2022-07-02 22:56:29
 */

"use strict";

require("dotenv").config();
const express = require("express");
const router = express.Router();
const axios = require("axios"); // HTTP request library
const path = require("path");
const PORT = process.env.PORT;
const db = require("./config");
const mysql = require('mysql2');
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const cors = require('cors');
const multer = require('multer');
const fs = require('fs-extra');

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

// User CORS
app.use(cors());

// Handle storage using Multer
let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const name = file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname);
    cb(null, name);
  }
});

let upload = multer({
  storage: storage,
  dest: 'public/uploads'
});

// Route for uploading newApplication document
app.post('/newAppUpload', upload.single('application'), async (req, res) => {

  // Get the file from the request
  let file = req.file;
  // console.log(file);
  console.log(req.body);

  // Read the file as a buffer
  const file_buffer = fs.readFileSync('public/uploads/' + file.filename);
  console.log(file);
  // console.log(file.filename);

  // Get all the parameters for the new Mariner from the request body
  let requestJSON = JSON.parse(JSON.stringify(req.body));
  // console.log(requestJSON);
  let marinerID = requestJSON.marinerIDNumber;
  let applicationID = requestJSON.applicationIDNumber;
  let processingAgent = requestJSON.processingAgent;
  let firstName = requestJSON.firstName;
  let middleName = requestJSON.middleName;
  let lastName = requestJSON.lastName;
  let birthDate = requestJSON.birthDate;

  // SQL for inserting new Mariner along with application file
  const insertMarinerSQL = 'INSERT INTO Mariners SET MarinerID = ?, FirstName = ?, MiddleName = ?, LastName = ?, BirthDate = ?, ProcessingAgent = ?, ApplicationID = ?';
  const insert_mariner_query = mysql.format(insertMarinerSQL, [marinerID, firstName, middleName, lastName, birthDate, processingAgent, applicationID]);

  await db.query(insert_mariner_query);

  // Query for inserting application into database
  let applicationSql = 'INSERT INTO Applications VALUES (0, ?, ?, ?)';
  let application_query = mysql.format(applicationSql, [file_buffer, file.filename, marinerID]);

  await db.query(application_query);

  // Delete the uploaded file from memory after insertion into the db
  let uploadedFile = "public/uploads/" + file.filename;
  await fs.unlinkSync(uploadedFile);
  console.log("File Uploaded!");

  // Query for setting the ApplicationID in the Mariners table to the corresponding one in the Applications table
  let checkAppIdSQL = "SELECT ApplicationID FROM Applications WHERE MarinerID = ?";
  let check_app_id_query = mysql.format(checkAppIdSQL, [marinerID]);

        let checkAppRows = await db.query(check_app_id_query);
        // console.log(checkAppRows);
        let rJSON = JSON.parse(JSON.stringify(checkAppRows));
        // console.log(rJSON);
        let appId = rJSON[0][0]["ApplicationID"];
        console.log(appId);

  let updateMarinerSQL = "UPDATE Mariners SET ApplicationID = ? WHERE MarinerID = ? ";
  let update_mariner_query = mysql.format(updateMarinerSQL, [appId, marinerID]);
  await db.query(update_mariner_query);

  res.redirect("/search");
});

// Route for uploading application document
app.post('/appUpload', upload.single('application'), async (req, res) => {

  // Error handling
    if (!req.file) {
      return res.status(400).send({ message: 'Please upload a file.' });
    }

  // Get the file from the request
  let file = req.file;

  // Read the file as a buffer
  const file_buffer = fs.readFileSync('public/uploads/' + file.filename);
  console.log(file);
  console.log(file.filename);

  // Parse the request body
  let marinerIDjson = JSON.parse(JSON.stringify(req.body));

  // Get the marinerID from the request body
  let marinerID = marinerIDjson.marinerIDNumber[1];
  console.log(marinerIDjson);

  // Query for inserting application into database
  let applicationSql = 'INSERT INTO Applications VALUES (0, ?, ?, ?)';
  let application_query = mysql.format(applicationSql, [file_buffer, file.filename, marinerID]);

  // Upload application to database
  db.pool.query(application_query, async (err, result) => {
    if (err) throw err;
    // Delete the uploaded file from memory after insertion into the db
    let uploadedFile = "public/uploads/" + file.filename;
    fs.unlinkSync(uploadedFile);
    console.log("File Uploaded!");
    // console.log("RESULT: " + JSON.stringify(result));
  });


  res.send({
    appUploaded: true,
    appFilename: file.filename
  });
});

/**
 *  Route for downloading an application document
 */

app.get('/appDownload', async (req, res) => {

  // Get the MarinerID from the request body
  let marinerID = req.query.marinerID;
  console.log("MarinerID: " + marinerID);

  // SQL to find Application that matches the mariner ID
  let appSQL = "SELECT * FROM Applications WHERE MarinerID = ?";
  let app_query = mysql.format(appSQL, [marinerID]);

  // Get the Blob object from the database
  db.pool.query(app_query, async (error, response) => {

    if (error) throw error;
    console.log(response[0]);
    console.log(response[0]['ApplicationID']);

    // Create a Buffer from the BLOB object
    let buff = await new Buffer.from(response[0]["ApplicationDocument"], {type: 'application/pdf'});
    console.log(buff);

    const appFileName = "application_for_mariner_" + marinerID + ".pdf";
    // Write the binary buffer data to a file
    let pdf = await fs.writeFileSync(appFileName, response[0]["ApplicationDocument"]);

    // Send the document to the browser for download
    res.download(appFileName);
    });
});

// Route for Deleting an Application Document from the database
app.post("/deleteApp", async (req, res) => {
  console.log(req);
  // Get ID from request parameters
  let marinerID = req.body.marinerID;
  // SQL Statement to Delete Application
  let deleteSQL = "DELETE FROM Applications WHERE MarinerID = ?";
  let delete_query = mysql.format(deleteSQL, [marinerID]);

  // Delete the Application Document
  db.pool.query(delete_query, async (err, res) => {
    if (err) throw err;
    console.log("Application Deleted for MarinerID: " + marinerID);
  });

  // res.render("form");
});

/**
 * Routing
 * */

// Request for root URL
app.get("/", async (_req, res) => {
  const query = await axios.get("https://randomuser.me/api/?results=9");
  res.render("index", {
    users: query.data.results,
  title: "Login"});
});

// Request for '/search' URL
app.get("/search", async (_req, res) => {

  let marinerData = [];
  let mariners = [];
  // Retrieve all records from database
  const searchSQL = "SELECT * FROM Mariners";
  const search_query = mysql.format(searchSQL);

  const employerSQL = "SELECT EmployerName FROM Employers WHERE EmployerID = ?";
  const agentSQL = "SELECT AgentName FROM Agents WHERE AgentID = ?";
  const allEmployersSQL = 'SELECT * FROM Employers';
  const all_employers_query = mysql.format(allEmployersSQL);
  const allEmployersRows = await db.query(all_employers_query);
  const allEmployersJSON = allEmployersRows[0];

  await db.query(search_query).then((result) => {
    // console.log(result[0]);
    marinerData = result[0];
  });

  for (const mariner of marinerData) {
    let formatted = {};
    formatted['marinerID'] = mariner['MarinerID'];
    formatted['firstName'] = mariner['FirstName'];
    formatted['lastName'] = mariner['LastName'];
    formatted['middleName'] = mariner['MiddleName'];

    // Format the Name of the Mariner into a Full Name
    let firstName = mariner['FirstName'];
    let lastName = mariner['LastName'];
    let middleName = mariner['MiddleName'];
    let fullName = firstName + ' ' + middleName + ' ' + lastName;
    formatted['fullName'] = fullName;

    // Get the employerID Number
    let employerIDNumber = mariner['EmployerID'];
    // Place it in the query
    let employer_query = mysql.format(employerSQL, [employerIDNumber]);
    let employerName;
    // Check the employers table for the EmployerID and retrieve the name
    const employerRows = await db.query(employer_query);
    // Parse the result and place the employerName into the object
    let employerJSON = JSON.parse(JSON.stringify(employerRows[0]));
    console.log(employerJSON);
    if (employerJSON[0]) {
      employerName = employerJSON[0]['EmployerName'];
      formatted['employer'] = employerName;
    } else {
      formatted['employer'] = " ";
    }
    // Get the AgentID Number
    let agentIDNumber = mariner['ProcessingAgent'];
    // Place it in the query
    let agent_query = mysql.format(agentSQL, [agentIDNumber]);
    let agentName;
    // Check the Agents table for the AgentID and retrieve the name
    const agentRows = await db.query(agent_query);
    // Parse the result and place the AgentName into the Object
    let agentJSON = JSON.parse(JSON.stringify(agentRows[0]));
    console.log(agentJSON);
    if (agentJSON[0]) {
      agentName = agentJSON[0]['AgentName'];
      formatted['processingAgent'] = agentName;
    }
    else {
      formatted['processingAgent'] = " ";
    }

    // Get the date from the database
    let mySQLbirthDate = mariner['BirthDate'];
    // Convert to a String
    let dateString = mySQLbirthDate.toString();
    // Create an array with the components of the string
    let splitDate = dateString.split(' ');
    // Change the format of the birth date to date-MON-year
    let formattedDate =
      splitDate[2] + '-' + splitDate[1].toUpperCase() + '-' + splitDate[3];
    formatted['birthDate'] = formattedDate;

    formatted['status'] = ' ';

    mariners.push(formatted);
  }

    // Send all records over to the page to be rendered
    res.render('search', {
      title: 'Search',
      searched: false,
      results: mariners,
      employers: allEmployersJSON
    });
  });

// Request for '/add' URL
app.get("/add", async (_req, res) => {
  res.render("add", {
    title: "Add"
  });
});

// Request for '/new' URL
app.get("/new", async (_req, res) => {

  // Obtain next AppID number
  let lastAppID;
  let nextAppID;
  // AppID Query
  let appIDSQL = 'SELECT MAX(ApplicationID) FROM Applications';
  let appID_query = mysql.format(appIDSQL);
  let appIDRows = await db.query(appID_query);
  lastAppID = appIDRows[0][0]['MAX(ApplicationID)'];
  if (lastAppID != null) {
    nextAppID = parseInt(lastAppID) + 1;
  } else {
    nextAppID = 1;
  }
  // Agents Query
  let agentsSQL = 'SELECT AgentName FROM Agents';
  let agents_query = mysql.format(agentsSQL);

  // Get all agent names from the database
  let processingAgents = [];
  let processingAgentsRows = await db.query(agents_query);
  let agentJSON = JSON.parse(JSON.stringify(processingAgentsRows));
  let agentObjects = agentJSON[0];
  for (let agentObject of agentObjects) {
    processingAgents.push(agentObject['AgentName']);
  }
  console.log(processingAgents);

  // Obtain Mariner ID number
  let lastMarinerID;
  let nextMarinerID;
  // ID Query
  let sqlSearch = 'SELECT MAX(MarinerID) FROM Mariners';
  let id_query = mysql.format(sqlSearch);

  // Sets the MarinerID to the next number
  db.query(id_query).then((result) => {
    console.log(result[0]);
    lastMarinerID = result[0][0]['MAX(MarinerID)'];
    console.log(lastMarinerID);
    if (lastMarinerID != null) {
      nextMarinerID = parseInt(lastMarinerID) + 1;
    } else {
      nextMarinerID = 10001;
    }
    res.render('new', {
      title: 'New',
      next: nextMarinerID,
      nextAppID: nextAppID,
      agents: processingAgents
    });
  });
});

// Request for '/reports' URL
app.get("/reports", async (_req, res) => {
  res.render("reports", {
    title: "Reports"
  });
});

// Request for '/maintenance' URL
app.get("/maintenance", async (_req, res) => {
  res.render("maintenance", {
    title: "Maintenance"
  });
});

// Request for '/licenses' URL
app.get("/licenses/", async (_req, res) => {
  res.render("licenses", {
    title: "Licenses"
  });
});

/**
 * User Creation and Authentication
 */

// Route for user creation
app.post("/createUser", async (req, res) => {
  // Salt rounds for bcrypt
  const salt = 10;
  // Get username and password that was submitted
  const user = req.body.username;
  const password = req.body.password;
  // Create a hashed password
  const hashedPassword = await bcrypt.hash(password, salt);

  // Prepare the SQL statement for searching
  const sqlSearch = "SELECT * FROM `users` WHERE user = ?";
  const search_query = mysql.format(sqlSearch, [user]);
  // Prepare the SQL statement for inserting
  const sqlInsert = "INSERT INTO `users` VALUES (0, ?, ?)";
  const insert_query = mysql.format(sqlInsert, [user, hashedPassword]);

  // Make the call to the database
  db.pool.query(search_query, async (err, result) => {
    // Show error if it fails
    if (err) throw err;

    console.log("--------> Search Results");
    console.log(result.length);

    // If the result exists, the user exists
    if (result.length != 0) {
      console.log("------> User already exists!");
      res.sendStatus(409);
    }
    else {
      // Otherwise insert the new user into the database
      db.pool.query(insert_query, async (_err, _result) => {
        if (_err) throw _err;
        console.log("------> Created new User!");
        console.log(_result.insertId);
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
        // res.send(`${user}` + " has successfully logged in!");
        res.redirect('/search');
      }
      else {
        console.log("Password Incorrect!");
        res.send("Your password was incorrect.");
      }
    }
  });
});

// Route for logging out
app.get("/logout", async (_req, res) => {
  res.render("index", {
    title: "Login"
  })
});



/**
 * Data Routes
*/
// Route for /form
app.get("/form", async (_req, res) => {

  // Variables for holding ID numbers
  let lastMarinerID;
  let nextMarinerID;
  let lastAppID;
  let nextAppID;

  // ID Query
  let marinerIDSQL = 'SELECT MAX(MarinerID) FROM Mariners';
  let id_query = mysql.format(marinerIDSQL);
  // ApplicationID Query
  let applicationIDSQL = 'SELECT MAX(ApplicationID) FROM Applications';
  let applicationID_query = mysql.format(applicationIDSQL);
  // Country Query
  let countrySearch = 'SELECT * FROM Countries';
  let country_query = mysql.format(countrySearch);
  // Employer Query
  let employerSearch = 'SELECT * FROM Employers';
  let employer_query = mysql.format(employerSearch);
  // Agent Query
  let agentSearch = 'SELECT * FROM Agents';
  let agent_query = mysql.format(agentSearch);

  // DB Access
  // Sets the MarinerID to the next number
  db.query(id_query).then((result) => {
    console.log(result[0]);
    lastMarinerID = result[0][0]['MAX(MarinerID)'];
    console.log(lastMarinerID);
    nextMarinerID = parseInt(lastMarinerID) + 1;
  });
  // Sets the ApplicationID to the next number
  db.query(applicationID_query).then((result) => {
    console.log(result[0]);
    lastAppID = result[0][0]['MAX(ApplicationID)'];
    console.log(lastAppID);
    nextAppID = parseInt(lastAppID) + 1;
  })
  // Gets the country list from the database
  db.query(country_query).then(countryResult => {
    let countriesArray = [];
    let countries = countryResult[0];
    for (const element of countries) {
      countriesArray.push(element["CountryName"])
    }

    // Gets the agent list from the database
    db.query(agent_query).then(agentResult => {
      console.log(agentResult[0]);
      let agents = agentResult[0];
    // Gets the employer list from the database
    db.query(employer_query).then(employerResult => {
      console.log(employerResult[0]);
      let employers = employerResult[0];
      // Pass the variables to the page to be rendered
      res.render('add', {
        title: "Add",
        next: nextMarinerID,
        nextAppID: nextAppID,
        countries: countriesArray,
        employers: employers,
        agents: agents
      })
    });
    });
  });
});


// Route for adding a Mariner
app.post("/add", async (req, res) => {
  console.log(req.body);
  let marinerId = req.body.marinerId;
  let firstName = req.body.firstName;
  let middleName = req.body.middleName;
  let lastName = req.body.lastName;
  let address = req.body.address;
  let phone = req.body.phone;
  let email = req.body.email;
  let employer = req.body.employer;
  let vessel = req.body.vessel;
  let marinerRefNum = req.body.marinerRefNum;
  let passportNumber = req.body.passportNumber;
  let citizenship = req.body.citizenship;
  let birthCity = req.body.birthCity;
  let birthState = req.body.birthState;
  let birthCountry = req.body.birthCountry;
  let birthDate = req.body.birthDate;
  let processingAgent = req.body.processingAgent;
  let marinerStatus = req.body.status;
  let applicationID = req.body.applicationID;
  let application = req.body.application;
  console.log(application);
  let notes = req.body.notes;

  let sqlInsert = 'INSERT INTO `mariners` VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
  let insert_query = mysql.format(sqlInsert, [
    marinerId,
    lastName,
    firstName,
    middleName,
    address,
    phone,
    email,
    employer,
    vessel,
    marinerRefNum,
    passportNumber,
    citizenship,
    birthCity,
    birthState,
    birthCountry,
    birthDate,
    processingAgent,
    notes,
    applicationID,
    marinerStatus]);

  // Insert Mariner into database
  db.pool.query(insert_query, async (err, result) => {
    if (err) throw err;
    console.log("New Mariner Added!");
    console.log(result);
    console.log(result.insertId);

    // Render the Search page after insertion
    res.render("search", {
      title: "Search"
    });
  });
});

// Check if Application exists for a Mariner
app.get("/getApp", async (req, res) => {
  console.log(req.query);
  let marinerID = req.query.marinerID;

  // Check database to see if an application for the mariner exists
  let appSQL = "SELECT ApplicationFileName FROM Applications WHERE marinerID = ?";
  let app_query = mysql.format(appSQL, [marinerID]);

  // Check the database for an application with the matching MarinerID
  db.pool.query(app_query, async (err, result) => {
    if (err) throw err;
    // Stringify and parse the result as JSON
    let resultJSON = JSON.parse(JSON.stringify(result));
    if (resultJSON[0]) {
      console.log(resultJSON[0]["ApplicationFileName"]);
      // Send result back to frontend
      res.send({
        appExists: true,
        appFilename: resultJSON[0]["ApplicationFileName"]
      });
    }
    else {
      res.send({
        appExists: false,
        appFilename: "No Application Has Been Uploaded"
      });
    }
  });
});

// Search the database
app.post('/search', async (_req, res) => {
  console.log(_req.body);
  let category = _req.body.searchBy;
  console.log(category);
  let sqlStatement;
  let parameterArray = [];
  let searchText = _req.body.searchText || _req.body.date;


  switch (category) {
    case 'Mariner ID':
      sqlStatement =
        'SELECT MarinerID, FirstName, MiddleName, LastName, BirthDate, EmployerID, ProcessingAgent, Status FROM Mariners WHERE MarinerID = ?';
      break;

    case 'Processing Agent':
      sqlStatement =
        'SELECT MarinerID, FirstName, MiddleName, LastName, BirthDate, EmployerID, ProcessingAgent, Status FROM Mariners WHERE ProcessingAgent = ?';
      break;

    case 'Birth Date':
      sqlStatement =
        'SELECT MarinerID, FirstName, MiddleName, LastName, BirthDate, EmployerID, ProcessingAgent, Status FROM Mariners WHERE BirthDate = ?';
      break;

    case 'First Name':
      sqlStatement =
        'SELECT MarinerID, FirstName, MiddleName, LastName, BirthDate, EmployerID, ProcessingAgent, Status FROM Mariners WHERE FirstName = ?';
      break;

    case 'Last Name':
      sqlStatement =
        'SELECT MarinerID, FirstName, MiddleName, LastName, BirthDate, EmployerID, ProcessingAgent, Status FROM Mariners WHERE LastName = ?';
      break;

    case 'Employer':
      sqlStatement =
        'SELECT MarinerID, FirstName, MiddleName, LastName, BirthDate, EmployerID, ProcessingAgent, Status FROM Mariners WHERE EmployerID = ?';
      break;

    default:
      sqlStatement = 'SELECT * FROM Mariners';
  }
  const allEmployersSQL = 'SELECT * FROM Employers';
  const all_employers_query = mysql.format(allEmployersSQL);
  const allEmployersRows = await db.query(all_employers_query);
  const allEmployersJSON = allEmployersRows[0];

  // Place the Searched Text into the parameterArray
  parameterArray.push(searchText);
  console.log(parameterArray);

  // Format SQL Query
  let search_query = mysql.format(sqlStatement, parameterArray);
  // console.log(search_query);
  // Perform SQL query
  let searchResultsRows = await db.query(search_query);
  // console.log(searchResultsRows);
  // Format result
  // let searchJSON = JSON.parse(JSON.stringify(searchResultsRows));
  // console.log(searchJSON[0]);
  let results = searchResultsRows[0];

  const employerSQL = 'SELECT EmployerName FROM Employers WHERE EmployerID = ?';
  const agentSQL = 'SELECT AgentName FROM Agents WHERE AgentID = ?';
  let mariners = [];

  for (let mariner of results) {
    let formatted = {};
    formatted['marinerID'] = mariner['MarinerID'];
    formatted['firstName'] = mariner['FirstName'];
    formatted['lastName'] = mariner['LastName'];
    formatted['middleName'] = mariner['MiddleName'];

    // Format the Name of the Mariner into a Full Name
    let firstName = mariner['FirstName'];
    let lastName = mariner['LastName'];
    let middleName = mariner['MiddleName'];
    let fullName = firstName + ' ' + middleName + ' ' + lastName;
    formatted['fullName'] = fullName;

    if (mariner['EmployerID'] != null) {

      // Get the employerID Number
      let employerIDNumber = mariner['EmployerID'];
      console.log(employerIDNumber);
      // Place it in the query
      let employer_query = mysql.format(employerSQL, [employerIDNumber]);
      let employerName;
      // Check the employers table for the EmployerID and retrieve the name
      const employerRows = await db.query(employer_query);
      // Parse the result and place the employerName into the object
      let employerJSON = JSON.parse(JSON.stringify(employerRows[0]));
      console.log(employerJSON);
      if (employerJSON[0]) {
        employerName = employerJSON[0]['EmployerName'];
        formatted['employer'] = employerName;
      } else {
        formatted['employer'] = " ";
      }
    }
    else {
      formatted['employer'] = ' ';
    }


    // Get the AgentID Number
    let agentIDNumber = mariner['ProcessingAgent'];
    console.log(agentIDNumber);
    // Place it in the query
    let agent_query = mysql.format(agentSQL, [agentIDNumber]);
    let agentName;
    // Check the Agents table for the AgentID and retrieve the name
    const agentRows = await db.query(agent_query);
    // Parse the result and place the AgentName into the Object
    let agentJSON = JSON.parse(JSON.stringify(agentRows[0]));
    console.log(agentJSON);
    agentName = agentJSON[0]['AgentName'];
    if (agentName) {
      formatted['processingAgent'] = agentName;
    }

    // Get the date from the database
    let mySQLbirthDate = mariner['BirthDate'];
    console.log(mySQLbirthDate);
    let jsDate = Date.parse(mySQLbirthDate);
    console.log(jsDate);
    // Convert to a String
    let dateString = mySQLbirthDate.toString();
    console.log(dateString);
    // Create an array with the components of the string
    let splitDate = dateString.split(' ');
    // Change the format of the birth date to date-MON-year
    let formattedDate =
      splitDate[2] + '-' + splitDate[1].toUpperCase() + '-' + splitDate[3];
    formatted['birthDate'] = formattedDate;

    formatted['status'] = ' ';

    mariners.push(formatted);
  }
  console.log(searchText);
  res.render('search',
    {
      title: 'Search',
      results: mariners,
      employers: allEmployersJSON,
      searched: true,
      searchText: searchText,
      searchCategory: category
    }
  );

});

// Error Handling
app.use(async (_req, res) => {
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
      db.query('SELECT * FROM global_compliance.Agents', function (err, results) {
        if (err) throw err;
        console.log(results);
      });
    }
  });
} else {
      // Test MySQL Database Connection
  db.query('SELECT * FROM et2g6mv72e6t4f88.mariners AS items').then(result =>
    console.log(JSON.stringify(result[0])));
      }

// Set the application to listen on a port for requests
app.listen(PORT, () => {
  console.log(`Listening to requests on http://localhost:${PORT}...`);
});
