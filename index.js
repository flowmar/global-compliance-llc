const express = require("express");
const axios = require("axios");

// Use Express to create the application
const app = express();

// Set the view engine to use Pug
app.set("view engine", "pug");

// Request for root URL
app.get("/", async (req, res) => {
  const query = await axios.get("https://randomuser.me/api/?results=9");
  res.render("index", { users: query.data.results });
});

// Set the Port number and display confirmation in console
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});