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
    connection.end(function(err){});
  });
}



