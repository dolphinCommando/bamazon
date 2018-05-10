USE bamazon;

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Nintendo Switch", "Video Games", 299.00, 10);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Legend of Zelda: Breath of the Wild", "Video Games", 54.98, 6);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("The Great Gatsby", "Books", 4.99, 10);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Pride and Prejudice", "Books", 5.99, 10);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Starship Troopers", "Books", 5.99, 15);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Ralph Lauren Polo for Dogs", "Pet Supplies", 49.99, 2);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Iams Dog Food", "Pet Supplies", 28.96, 3);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Amazon Echo with Alexa", "Electronics", 84.99, 2);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Asus Chromebook", "Electronics", 215.85, 5);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Tesla X P90D", "Vehicles", 94625.00, 1);

SELECT * FROM products;


INSERT INTO departments (department_name, over_head_costs)
VALUES 
("Video Games", 20.00),
("Pet Supplies", 10.00),
("Books", 2.00),
("Electronics", 5.00),
("Vehicles", 20000);

SELECT * FROM departments;
