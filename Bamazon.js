"use strict";

module.exports = Bamazon;

function Bamazon(){
  this.inquirer = require('inquirer');
  this.mysql = require('mysql');
  this.connection = this.mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "Bamazon"
  });
  this.establishConn();
}

Bamazon.prototype.establishConn = function () {
  this.connection.connect(function(err){
    if(err) throw new Error("Could not establish connection: " + err);
  }.bind(this))
};

Bamazon.prototype.displayAlltoPrompt = function (prompt, callback) {
  var query = "SELECT * FROM products";
  this.connection.query(query, function(err, resp) {
    console.log(this.buildTable(resp));
    this.response = resp;
    if (prompt){
      this.promptUser(prompt).then(function (response) {
        callback(response);
      });
    }
  }.bind(this))
};

Bamazon.prototype.promptUser = function (prompt){
  return this.inquirer.prompt(prompt);
};

Bamazon.prototype.buildTable = function (data) {
  // Discover the greatest length of each cell by row
  if(!this.cellLen){
    this.cellLen = {
      item_id: 0,
      product_name: 0,
      department_name: 0,
      price: 0,
      stock_quantity: 0
    };
  }

  data.forEach(function(item){
    for (var prop in this.cellLen){
      if(this.cellLen.hasOwnProperty(prop)){
        this.cellLen[prop] = Math.max(parseInt(this.cellLen[prop]), (String(item[prop]).length + 3));
      }
    }
  }.bind(this));

  var tableString = "\n" + this.stringPad("| ID", "item_id")
      + this.stringPad("| Product Name", "product_name")
      + this.stringPad("| Department", "department_name")
      + this.stringPad("| Price", "price")
      + this.stringPad("| Quantity", "stock_quantity") + " |\n";

  data.forEach(function (item) {
    for(var prop in item){
      if(item.hasOwnProperty(prop)){
        tableString += this.stringPad("| " + item[prop], prop);
      }else{
        tableString += this.stringPad("| N/A", prop);
      }
    }
    tableString += " |\n";
  }.bind(this));
  return tableString;
};

Bamazon.prototype.stringPad = function (str, key) {
  var string = String(str);
  var stringLength = string.length;
  var totalLength = parseInt(this.cellLen[key]);

  if (stringLength > totalLength){
    this.cellLen[key] = stringLength;
    totalLength = parseInt(this.cellLen[key]);
  }
  return string + " ".repeat(parseInt(totalLength) - stringLength);
};

Bamazon.prototype.endSession = function () {
  this.connection.end();
};
