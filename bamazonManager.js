require('dotenv').config();
var mysql = require('mysql');
var inquirer = require('inquirer');

var managerOptions = ['View Products for Sale', 'View Low Products', 'Add to Inventory', 'Add New Products'];

var connection = mysql.createConnection({
host: 'localhost',
port: 3306,
user: 'root',
password: 'password',
database: 'bamazon'
});

function managerMenu() {
  inquirer.prompt([
    {
      name: 'menu',
      message: 'Bamazon Manager Menu',
      type: 'list',
      choices: managerOptions
    }
  ]).then(response => {
    switch (managerOptions.indexOf(response.menu)) {
      case 0:
        viewTotalInventory();
        break;
      case 1:
        viewLowInventory();
        break;
      case 2:
        addInventory();
        break;
      case 3:
        connection.query('SELECT department_name FROM products', (err, results) => {
          if (err) throw err;
          addNewProduct(results.map(product => product.department_name));
        });
        break;
    }

  });
}

function viewTotalInventory() {
  connection.query('SELECT * FROM products', (err, results) => {
    if (err) throw err;
	  console.log('\n---------------------');
    console.log(' WELCOME TO BAMAZON!');
	  console.log('---------------------');
    results.forEach(product => {
      console.log(`| ID: ${product.item_id} | Name: ${product.product_name} | Price: ${product.price} |`);
    });  
	});
}

function viewLowInventory() {
  connection.query('SELECT * FROM products WHERE stock_quantity < 5', (err, results) => {
    if (err) throw err;
    console.log('LOW INVENTORY');
    results.forEach(product => console.log(`${product.product_name}  ${product.stock_quantity}`));
  });
}

function addInventory() {
  connection.query('SELECT item_id, product_name, stock_quantity FROM products', (err, results) => {
    if (err) throw err;
    results.forEach(product => console.log(`${product.item_id}, ${product.product_name}, ${product.stock_quantity}`));
    inquirer.prompt([
      {
        name: 'id',
        message: 'Enter ID of product to add inventory to.',
        type: 'input'
      }
    ]).then(response => {
      if(+response.id > 0 && +response.id <= results.length && parseInt(response.id) !== NaN) {
        inquirer.prompt([
          {
            name: 'number',
            type: 'input',
            message: `Enter amount of product to order`
          }
        ]).then(response2 => {
          if (parseInt(response2.number) !== NaN) {
            connection.query('UPDATE products SET stock_quantity = ? WHERE item_id = ?', [response2.number, response.id], (err, results) => {
              if (err) throw err;
              console.log('Inventory updated.');
            });
          }
        });
      }
    });
  });
}

function addNewProduct(departmentsArr) {
  inquirer.prompt([
    {
      name: 'name',
      type: 'input',
      message: 'Enter the new product name: '
    },
    {
      name: 'department',
      type: 'input',
      message: 'Enter department: '
    },
    {
      name: 'price',
      type: 'input',
      message: 'Enter price: '
    },
    {
      name: 'quantity',
      type: 'input',
      message: 'Enter stock quantity: '
    }
  ]).then(response => {
    if (testNewProduct(response, departmentsArr)) {
      console.log('Input OK');
      connection.query(`
        INSERT INTO products (product_name, department_name, price, stock_quantity)
        VALUES (?, ?, ?, ?)`, 
        [response.name, response.department, response.price, response.quantity], (err, results) => {
      if (err) throw err;
      console.log(response.name + ' is now available on Bamazon');
      });
    }
  });
}

function getDepartments() {
  connection.query('SELECT department_name FROM products', (err, results) => {
    if (err) throw err;
    return results.map(department => department.department_name);
  });
}

function testNewProduct(response, departmentsArr) {
    var depCorrect = departmentsArr.indexOf(response.department) > -1;
    if (!depCorrect) {console.log('That department does no exist. View Total Inventory to see existing departments.');}
    var priceCorrect = parseFloat(response.price) !== NaN;
    if (!priceCorrect) {console.log('Enter floating point number for price');}
    var stockCorrect = parseInt(response.quantity) !== NaN;
    if (!stockCorrect) {console.log('Enter integer value for stock quantity');}
    
    return depCorrect && priceCorrect && stockCorrect;
}

managerMenu();