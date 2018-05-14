require('dotenv').config();
var mysql = require('mysql');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
host: 'localhost',
port: 3306,
user: 'root',
password: 'password',
database: 'bamazon'
});

var supervisorOptions = ['View Product Sales by Department', 'Create New Department'];

function supervisorMenu() {
  inquirer.prompt([
    {
      name: 'menu',
      message: 'Bamazon Supervisor Menu',
      type: 'list',
      choices: supervisorOptions
    }
  ]).then(response => {
    switch (supervisorOptions.indexOf(response.menu)) {
      case 0:
        viewProductSales();
        break;
      case 1:
        createDepartment();
        break;
    }
  });
}

