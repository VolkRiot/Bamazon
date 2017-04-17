'use strict';

function BamazonCustomer(){
  this.initDependencies();
  this.establishConn();
}

BamazonCustomer.prototype.initDependencies = function () {
  this.inquirer = require('inquirer');
  this.mysql = require('mysql');
};

BamazonCustomer.prototype.establishConn = function () {
  this.connection = this.mysql.createConnection({
    host: "localhost",
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "",
    database: "Bamazon"
  });
  this.connection.connect(function(err){
    if(err) throw new Error("Could not establish connection: " + err);
    this.displayAll();
  }.bind(this))
};

BamazonCustomer.prototype.displayAll = function () {
  var query = "SELECT * FROM products";
  this.connection.query(query, function(err, resp) {
    console.log(this.buildTable(resp));
  }.bind(this))
};

BamazonCustomer.prototype.buildTable = function (data) {
  var tableString = "| Prod ID | Product Name | Department | Price | Quantity |\n";
  data.forEach(function (item) {
    tableString += "| " + item.item_id + " | " + item.product_name + " | " + item.department_name + " | " +
            item.price.toFixed(2) + " | " + item.stock_quantity + " |\n";
  });
  return tableString;
};

BamazonCustomer.prototype.endSession = function () {
  this.connection.end();
};

// Begin Run
new BamazonCustomer();