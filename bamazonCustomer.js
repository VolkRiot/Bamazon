"use strict";

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
  var itemID = userInput.item_id;
  var query = "SELECT * FROM products WHERE ?";
  this.connection.query(query, {item_id: itemID} ,function(err, resp) {
    try{
      if(err){
        throw new Error("Select all did not work: ", err);
      }
    }catch(e){
      console.log(e);
      this.displayAlltoPrompt(this.prompt, this.placeOrder.bind(this));
    }

    if((resp[0].stock_quantity < userInput.units) || (resp[0].stock_quantity < 1)){
      console.log('Insufficient quantity!');
      this.displayAlltoPrompt(this.prompt, this.placeOrder.bind(this));
    }else if(resp[0].stock_quantity >= userInput.units){

      var new_stock = resp[0].stock_quantity - userInput.units;
      var update = "UPDATE products SET stock_quantity = ? WHERE item_id = ?";
      var cost = parseFloat(resp[0].price, 2) * parseInt(userInput.units);

      this.connection.query(update, [new_stock ,resp[0].item_id], function (err) {

        try{
          if(err){
            throw new Error("Update failed, couldn't purchase", err);
          }
        }catch(e){
          console.log(e);
          this.displayAlltoPrompt(this.prompt, this.placeOrder.bind(this));
        }

        var query = "SELECT product_sales, department_name FROM products WHERE item_id = ?";
        this.connection.query(query, [resp[0].item_id], function (err, resp) {
          var currentSales = parseFloat(resp[0].product_sales);
          var department = resp[0].department_name;
          var newTotal = currentSales + cost;

          query = "UPDATE products SET product_sales = ? WHERE item_id = ?";
          this.connection.query(query, [newTotal, itemID], function (err) {
            if(err) throw new Error("Could not update the total sales!", err);
            var string = "Purchase completed\nTotal: $" + cost.toFixed(2);
            console.log(string);
            query = "UPDATE departments SET total_sales = ? WHERE department_name = ?";
            this.connection.query(query, [newTotal, department], function (err) {
              if(err) throw new Error("Could not update the department table ", err);
              this.displayAlltoPrompt(this.prompt, this.placeOrder.bind(this));
            }.bind(this));
          }.bind(this))

        }.bind(this));
      }.bind(this))
    }

  }.bind(this));

};

// Begin Run Logic
var customer = new BamazonCustomer();
customer.displayAlltoPrompt(customer.prompt, customer.placeOrder.bind(customer));

