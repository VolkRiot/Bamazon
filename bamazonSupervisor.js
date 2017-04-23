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
  this.promptChoose();

}

BamazonSupervisor.prototype =  Object.create(Bamazon.prototype);

BamazonSupervisor.prototype.viewSalesbyDept = function (){
  this.clearCLI();
  var query = "SELECT departments.department_id, " +
      "departments.department_name, " +
      "departments.over_head_costs, " +
      "total_sales_by_dept.total_sales, " +
      "total_sales_by_dept.total_sales -  departments.over_head_costs " +
      "AS total_profits " +
      "FROM departments INNER JOIN " +
      "( SELECT department_name, SUM(product_sales) AS total_sales FROM products GROUP BY department_name " +
      ") total_sales_by_dept WHERE " +
      "departments.department_name = total_sales_by_dept.department_name;";

  this.connection.query(query, function(err, resp){
    if(err) throw new Error("Could not get total sales", err);
    if(!this.salesTable) this.salesTable = this.buildTable(resp);
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
