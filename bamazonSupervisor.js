const keys = require('./keys.js');
var mysql = require('mysql');
var inquirer = require('inquirer');
const cTable = require('console.table');

var connection = mysql.createConnection({
host: keys.mysql.host,
port: keys.mysql.port,
user: keys.mysql.user,
password: keys.mysql.password,
database: keys.mysql.database
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

function viewProductSales() {
  const queryWithSales = `
    SELECT departments.*, SUM(products.product_sales) AS sales
    FROM departments
    LEFT JOIN products ON departments.department_name = products.department_name
    GROUP BY departments.department_id, departments.department_name, departments.over_head_costs, products.department_name;
    `;
  connection.query(queryWithSales, (err, res) => {
    if (err) throw err;
    var table = [];
    res.forEach(dep => {
      table.push({
        department_id: dep.department_id,
        department_name: dep.department_name,
        over_head_costs: dep.over_head_costs,
        product_sales: dep.sales || 0.00,
        total_profit: (parseFloat(dep.sales) - parseFloat(dep.over_head_costs)) || 0.00
      });
    });
    console.table(cTable.getTable(table));
    returnToMain();
  });
}

function createDepartment() {
  inquirer.prompt([
    {
      name: 'name',
      message: 'Enter department name: ',
      type: 'input'
    },
    {
      name: 'costs',
      message: 'Enter over-head costs: ',
      type: 'input'
    }
  ]).then(response => {
    if (!Number.isNaN(parseFloat(response.costs))) {
      connection.query(`INSERT INTO departments (department_name, over_head_costs) VALUES (?, ?)`,
      [response.name, response.costs], (err, res) => {
        if (err) throw err;
        console.log(`${response.name} department added to Bamazon.`);
        returnToMain();
      });
    }
    else {
      console.log('Please enter a floating-point number for costs.');
      createDepartment();
    }
  });
}

function returnToMain() {
  setTimeout(() => {
    supervisorMenu();
  }, 2000);
}


supervisorMenu();

