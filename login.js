const db = require('./config')


let loginButton = document.getElementById('loginButton');
let usernameInput;
let passwordInput;

loginButton.onclick(event => {
  usernameInput = document.getElementById('typeUsername').innerText;
  passwordInput = document.getElementById('typePassword').innerText;

  // db.query("", )
});