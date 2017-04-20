var Bamazon = require("./Bamazon.js");

function BamazonCustomer() {

  if(!(this instanceof BamazonCustomer)){
    return new BamazonCustomer();
  }
  Bamazon.call(this);
}

BamazonCustomer.prototype = Object.create(Bamazon.prototype);



// Begin Run Logic
var customer = new BamazonCustomer();

// displayAlltoPrompt (inquirerPromptArray, responseCallback)
customer.displayAlltoPrompt([
  {
    type: 'input',
    name: 'numSelect',
    message: 'Input the number for the ID of the product you wish ' +
    'to order',
    validate: function (value) {
      return value >= 1 && value <= customer.response.length;
    }
  },
  {
    type: 'input',
    name: 'units',
    message: "How many units would you like to order?"
  }
], console.log);
