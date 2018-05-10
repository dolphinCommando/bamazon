require('dotenv').config();
var mysql = require('mysql');
var inquirer = require('inquirer');
var keys = require('./keys.js');

var connection = mysql.createConnection({
  host: keys.host,
  port: keys.port,
  user: keys.user,
  password: keys.password,
  database: keys.database
});
