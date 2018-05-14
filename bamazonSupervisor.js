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

function viewProductSales() {
  const queryWithSales = `
    SELECT departments.*, SUM(products.product_sales) AS sales
    FROM departments
    LEFT JOIN products ON departments.department_name = products.department_name
    GROUP BY departments.department_id, departments.department_name, departments.over_head_costs, products.department_name;
    `;
  connection.query(queryWithSales, (err, res) => {
    if (err) throw err;
    res.forEach(row => {
      console.log(`${row.department_id} ${row.department_name} ${row.over_head_costs} ${row.sales} ${parseFloat(row.sales)-parseFloat(row.over_head_costs)}`);
    });
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
    if (parseFloat(response.costs) !== NaN) {
      connection.query(`INSERT INTO departments (department_name, over_head_costs) VALUES (?, ?)`,
      [response.name, response.costs], (err, res) => {
        if (err) throw err;
        console.log(`${response.name} department added to Bamazon.`);
      });
    }
    else {
      console.log('Please enter a floating-point number for costs.');
      createDepartment();
    }
  });
}

supervisorMenu();

