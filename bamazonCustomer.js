var Bamazon = require("./Bamazon.js");

function BamazonCustomer() {

  if(!(this instanceof BamazonCustomer)){
    return new BamazonCustomer();
  }
  Bamazon.call(this);
}

BamazonCustomer.prototype = Bamazon();

BamazonCustomer.prototype.promptUser = function (){

  this.inquirer.prompt([
    {
      type: 'input',
      name: 'numSelect',
      message: 'Input the number for the ID of the product you wish ' +
      'to order',
      validate: function (value) {
        return table.length >= value >= 0;
      }
    },
    {
      type: 'input',
      name: 'units',
      message: "How many units would you like to order?"
    }
    ]).then(function (result) {
      console.log(result);
  });
};


// Begin Run Logic
var customer = new BamazonCustomer();

customer.displayAll();
console.log(customer);
setTimeout(customer.promptUser.bind(customer), 1000);
