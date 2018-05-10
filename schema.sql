DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
	item_id INT NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(100) NULL,
    department_name VARCHAR(50) NULL,
    price FLOAT(10, 2) NULL,
    stock_quantity INTEGER(12) NULL,
    product_sales FLOAT(14,2) NULL,
	PRIMARY KEY (item_id)
);

CREATE TABLE departments (
	department_id INT NOT NULL AUTO_INCREMENT,
    department_name VARCHAR(50) NULL,
    over_head_costs FLOAT(12,2) NULL,
    PRIMARY KEY (department_id)
);

SELECT * FROM products;

SELECT * FROM departments;
