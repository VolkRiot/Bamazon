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
  var query = "SELECT product_sales FROM products  ";
  this.connection.query()
};

BamazonSupervisor.prototype.promptChoose = function () {
  this.promptUser(this.prompt).then(function (response) {
    switch(response.choice){

      case 'View Product Sales by Department':

        break;

      case 'Create New Department':

        break;

      case 'Quit':
        console.log("GoodBye!");
        this.endSession();
        process.exit();
        break;
    }
  })
};

// Begin run logic

var supervisor = BamazonSupervisor();
//supervisor.promptUser(supervisor.prompt)
