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

function displayProducts() {
  connection.query('SELECT * FROM products', (err, results) => {
    if (err) throw err;
	  console.log('---------------------');
    console.log(' WELCOME TO BAMAZON!');
	  console.log('---------------------');
    var table = [];
    results.forEach(product => {
      table.push({
        id: product.item_id,
        name: product.product_name,
				price: '$' + product.price
      });
    });
    console.table(cTable.getTable(table));
    
	  getProductID(results);
  });
}

function getProductID(arr) {
	inquirer.prompt([
		{
			name: 'id',
			message: 'Choose the ID of the product you wish to buy.',
			type: 'input'
		}
	]).then(response => {
		if (+response.id > 0 && +response.id <= arr.length && Number.isInteger(+response.id)) {
			getProductUnits(arr, response.id);
		}
		else {
			getProductID(arr);
		}

	});
}

function getProductUnits(arr, index_id) {
	inquirer.prompt([
		{
			name: 'units',
			message: 'How many do you want to order?',
			type: 'input'
		}
	]).then(response => {
      if (!Number.isInteger(+response.units)) {
		  getProductUnits(arr, index_id);
	  }
	  else {
		  if (arr[+index_id - 1].stock_quantity < +response.units) {
			  console.log('Sorry, insufficient quantity.');
			  console.log('Returning to main page.');
			  returnToMain();
		  }
		  else {
			  placeOrder(arr, index_id, response.units);
		  }
	  }
	});
}

function placeOrder(arr, id, quantity) {
	var someMath = +arr[+id-1].price * +quantity;
	var stockNow = +arr[+id-1].stock_quantity - +quantity;
	connection.query('UPDATE products SET stock_quantity = ?, product_sales = ? WHERE item_id = ?', [stockNow, someMath, id], (err, results) => {
		if (err) throw err;
		console.log(`Your bank account has been billed $${someMath}.\nThank you for ordering through BAMAZON.`);
		returnToMain();
	});
}

function returnToMain() {
  setTimeout(() => {
    displayProducts();
  }, 2000);
}
displayProducts();




