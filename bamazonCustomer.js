'use strict';

var Bamazon = require("./Bamazon.js");

function BamazonCustomer() {

  if(!(this instanceof BamazonCustomer)){
    return new BamazonCustomer();
  }
  Bamazon.call(this);
  this.prompt = [
    {
      type: 'input',
      name: 'item_id',
      message: 'Input the number for the ID of the product you wish ' +
      'to order',
      validate: function (value) {
        return value >= 1 && value <= customer.response.length;
      }
    },
    {
      type: 'input',
      name: 'units',
      message: "How many units would you like to order?",
      validate: function (value){
        return value > 0;
      }
    }
  ]
}

BamazonCustomer.prototype = Object.create(Bamazon.prototype);

BamazonCustomer.prototype.placeOrder = function (userInput) {
  var query = "SELECT * FROM products WHERE ?";
  this.connection.query(query, {item_id: userInput.item_id} ,function(err, resp) {
    try{
      if(err){
        throw new Error("Select all did not work: " + err);
      }
    }catch(e){
      console.log(e);
      this.displayAlltoPrompt(this.prompt, this.placeOrder.bind(this));
    }

    if(resp[0].stock_quantity < userInput.units){
      console.log('Insufficient quantity!');

    }else if(resp[0].stock_quantity >= userInput.units){

      var new_stock = resp[0].stock_quantity - userInput.units;
      var update = "UPDATE products SET stock_quantity = ? WHERE item_id = ?";

      this.connection.query(update, [new_stock ,resp[0].item_id], function (err) {

        try{
          if(err){
            throw new Error("Update failed, couldn't purchase");
          }
        }catch(e){
          console.log(e);
          this.displayAlltoPrompt(this.prompt, this.placeOrder.bind(this));
        }

        var string = "Purchase completed\nTotal: $" + parseFloat(resp[0].price, 2) * parseInt(userInput.units);
        console.log(string);
      }.bind(this))
    }

  }.bind(this));

};

// Begin Run Logic
var customer = new BamazonCustomer();
customer.displayAlltoPrompt(customer.prompt, customer.placeOrder.bind(customer));

