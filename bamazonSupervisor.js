"use strict";

var Bamazon = require("./Bamazon.js");

function BamazonSupervisor() {

  if (!(this instanceof BamazonSupervisor)) {
    return new BamazonSupervisor();
  }
  Bamazon.call(this);
  this.prompt = [{
    name: 'choice',
    type: 'list',
    message: 'What would you like to do',
    choices: ['View Product Sales by Department', 'Create New Department', 'Quit']
  }];

}

BamazonSupervisor.prototype =  Object.create(Bamazon.prototype);

BamazonSupervisor.prototype.viewSalesbyDept = function (){
  var query = "SELECT products.department_name, SUM(product_sales) AS total_sales FROM " +
      "products GROUP BY department_name";
  this.connection.query(query, function(err, resp){
    if(err) throw new Error("Could not get total sales" + err);
    console.log(resp);



  }.bind(this));

  query = "SELECT products.department_name, product_sales " +
      "FROM products INNER JOIN departments WHERE products.department_name = departments.department_name";
  this.connection.query(query, function (err, resp) {
    if(err) throw new Error("Could not get table data" + err);
    console.log(this.buildTable(resp));
    this.promptChoose();
  }.bind(this));
};

BamazonSupervisor.prototype.createnewDepart = function (){

};

BamazonSupervisor.prototype.promptChoose = function () {
  this.promptUser(this.prompt).then(function (response) {
    switch(response.choice){

      case 'View Product Sales by Department':
        this.viewSalesbyDept();
        break;

      case 'Create New Department':
        this.createnewDepart();
        break;

      case 'Quit':
        console.log("GoodBye!");
        this.endSession();
        process.exit();
        break;
    }
  }.bind(this))
};

// Begin run logic

var supervisor = BamazonSupervisor();
supervisor.promptChoose();
