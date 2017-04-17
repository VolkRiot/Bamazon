CREATE DATABASE Bamazon;

USE Bamazon;
CREATE TABLE products(
item_id INTEGER(11) AUTO_INCREMENT NOT NULL,
product_name VARCHAR(100) NOT NULL,
department_name VARCHAR(100) NOT NULL,
price DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
stock_quantity INTEGER(12) NOT NULL DEFAULT 0,
PRIMARY KEY(item_id)
);

INSERT INTO products(product_name, department_name, price,  stock_quantity)
VALUES
("Truck Boat Truck", "Personal Transportation", 10000.99, 5),
("Plumbus", "Alien Goods", 39.65, 130),
("EyeHoles Cereal", "Foods", 19.99, 1035),
("Corn Baller", "Home Appliances", 199.99, 10),
("Slurm", "Foods", 2.65, 12000),
("Sex Panther Cologne", "Health and Beauty", 58.90, 57),
("Brawndo", "Garden Supplies", 6.99, 1200),
("Dunder Mifflin Copy Paper", "Office Supplies", 10.50, 3500),
("Serenity", "Personal Transportation", 150000.00, 1),
("Sabor De Soledad Chips", "Foods", 3.50, 250)