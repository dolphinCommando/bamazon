const keys = require('./keys.js');
var mysql = require('mysql');
var inquirer = require('inquirer');
const cTable = require('console.table');

var managerOptions = ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Products'];

var connection = mysql.createConnection({
host: keys.mysql.host,
port: keys.mysql.port,
user: keys.mysql.user,
password: keys.mysql.password,
database: keys.mysql.database
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
        connection.query('SELECT DISTINCT department_name FROM departments', (err, results) => {
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
    var table = [];
    results.forEach(product => {
      table.push({
        id: product.item_id,
        name: product.product_name,
        price: product.price,
        quantity: product.stock_quantity
      });
    });
    console.table(cTable.getTable(table));
    returnToMain();
	});
}

function viewLowInventory() {
  connection.query('SELECT * FROM products WHERE stock_quantity < 5', (err, results) => {
    if (err) throw err;
    console.log('\nLOW INVENTORY');
    var table = [];
    results.forEach(product => {
      table.push({
        name: product.product_name,
        in_stock: product.stock_quantity
      });
    });
    console.table(cTable.getTable(table));
    returnToMain();
  });
}

function addInventory() {
  connection.query('SELECT item_id, product_name, stock_quantity FROM products', (err, results) => {
    if (err) throw err;
    results.forEach(product => console.log(`${product.item_id}. ${product.product_name}`));
    inquirer.prompt([
      {
        name: 'id',
        message: 'Enter ID of product to add inventory to.',
        type: 'input'
      }
    ]).then(response => {
      if(+response.id > 0 && +response.id <= results.length && Number.isInteger(parseFloat(response.id))) {
        inquirer.prompt([
          {
            name: 'number',
            type: 'input',
            message: `Enter amount of product to order`
          }
        ]).then(response2 => {
          if (Number.isInteger(parseFloat(response2.number))) {
            connection.query('UPDATE products SET stock_quantity = ? WHERE item_id = ?', [response2.number, response.id], (err, results) => {
              if (err) throw err;
              console.log('Inventory updated.');
              returnToMain();
            });
          }
          else {
            addInventory();
          }
        });
      }
      else {
        addInventory();
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
      returnToMain();
      });
    }
    else {
      addNewProduct(departmentsArr);
    }
  });
}

function testNewProduct(response, departmentsArr) {
    var depCorrect = departmentsArr.indexOf(response.department) > -1;
    if (!depCorrect) {console.log('Department not available: ' + departmentsArr.join());}
    var priceCorrect = !Number.isNaN(parseFloat(response.price));
    if (!priceCorrect) {console.log('Enter floating point number for price');}
    var stockCorrect = Number.isInteger(parseFloat(response.quantity));
    if (!stockCorrect) {console.log('Enter integer value for stock quantity');}
    
    return depCorrect && priceCorrect && stockCorrect;
}

function returnToMain() {
  setTimeout(() => {
    managerMenu();
  }, 2000);
}

managerMenu();