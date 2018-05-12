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

function displayProducts() {
  connection.query('SELECT * FROM products', (err, results) => {
    if (err) throw err;
	console.log('---------------------');
    console.log(' WELCOME TO BAMAZON!');
	console.log('---------------------');
    results.forEach(product => {
      console.log(`| ID: ${product.item_id} | Name: ${product.product_name} | Price: ${product.price} |`);
	});
  
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
		if (+response.id > 0 && +response.id <= arr.length && parseInt(response.id) !== NaN) {
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
		  getProductUnits(arr);
	  }
	  else {
		  if (arr[+index_id - 1].stock_quantity < +response.units) {
			  console.log('Sorry, insufficient quantity.');
			  console.log('Returning to main page.');
			  setTimeout(() => {
				  displayProducts();
			  }, 1500);
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
		  connection.end(function(err){});
	});
}

displayProducts();




