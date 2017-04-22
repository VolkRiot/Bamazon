"use strict";

var Bamazon = require("./Bamazon.js");

function BamazonManager() {
  if(!(this instanceof BamazonManager)){
    return new BamazonManager();
  }
  Bamazon.call(this);
}

BamazonManager.prototype = Object.create(Bamazon.prototype);

BamazonManager.prototype.showLowInv = function () {
  var query = "SELECT * FROM products WHERE stock_quantity <= ?";
  this.connection.query(query, [45], function (err, resp) {
    console.log(this.buildTable(resp));
    this.promptChoice(this.prompt);
  }.bind(this));
};

BamazonManager.prototype.addtoInventory = function () {
  var itemLength = this.fullData.length;
  var prompt = [{
    name: 'id',
    type: 'input',
    message: 'Input the number of the ID of the product, for which you wish to update ' +
        'the inventory.',
    validate: function (value) {
      return value >= 1 && value <= itemLength;
    } 
    },
    {
    name:'quantity',
    type: 'input',
    message: 'How much are you adding into the inventory?',
    validate: function(input) {
      return /^[0-9]+/.test(input);
    }
  }];

  this.promptUser(prompt).then(function (response) {
      this.connection.query("SELECT * FROM products", function(err, resp) {
        this.fullData = resp;

        var newQuant = parseInt(response.quantity);

        var query = "UPDATE products SET stock_quantity = stock_quantity + ? WHERE item_id = ?";
        this.connection.query(query, [newQuant, response.id], function (err, resp) {
          try{
            if(err){
              throw new Error("Update failed, couldn't update quantity");
            }
          }catch(e){
            console.log(e);
            this.promptChoice();
          }

          // TODO: Maybe expand this to show details?
          var message = "Update completed successfully";
          console.log(message);
          this.promptChoice(this.prompt);

        }.bind(this))
      }.bind(this));
  }.bind(this))
};

BamazonManager.prototype.addItem = function () {
  this.connection.query("SELECT * FROM products", function(err, resp) {
    if(err) throw new Error("Couldn't retriever SQL Data: " + err);
    this.fullData = resp;


    this.connection.query("SELECT department_name FROM departments", function (err, resp) {
      if(err) throw new Error("Could not check available departments");

      this.departList = [];
      resp.forEach(function(item){
          this.departList.push(item.department_name);
        }, this);

      var buildItemPrompt = [{
        name: 'product_name',
        type: 'input',
        message: 'Input the name of the new product'
      }, {
        name: 'department_name',
        type: 'list',
        message: 'Select the department',
        choices: this.departList
      }, {
        name: 'price',
        type: 'input',
        message: 'What is the price of the new product?',
        validate: function(input) {
          return /^\d+\.?\d{1,2}/.test(input);
        }
      }, {
        name:'stock_quantity',
        type: 'input',
        message: 'What is the initial stock quantity?',
        validate: function(input) {
          return /^\d+$/.test(input);
        }
      }];

      this.promptUser(buildItemPrompt).then(function (response) {
        var query = "INSERT INTO products SET ?";
        this.connection.query(query,{
          product_name: response.product_name,
          department_name: response.department_name,
          price: parseFloat(response.price),
          stock_quantity: response.stock_quantity
        },function (err) {
          if(err) throw new Error("Could not add a new item to the table: " + err);
          console.log("New item added!");
          this.promptChoice();
        }.bind(this));
      }.bind(this))
    }.bind(this));
  }.bind(this));
};

BamazonManager.prototype.promptChoice = function (prompt) {
  if(!this.prompt) this.prompt = prompt;
  this.promptUser(this.prompt).then(function(response){

    this.connection.query("SELECT * FROM products", function(err, resp) {
      this.fullData = resp;

      switch(response.action){
        case "View Products for Sale":
          this.displayAlltoPrompt();

          // TODO: Needs a fix here

          this.promptChoice(this.prompt);
          break;

        case "View Low Inventory":
          this.showLowInv();
          break;

        case "Add to Inventory":
          this.addtoInventory();
          break;

        case "Add New Product":
          this.addItem();
          break;

        case "Quit":
          console.log("GoodBye!");
          this.endSession();
          process.exit();
      }

    }.bind(this));
  }.bind(this))
};

// Run Logic
var manager = new BamazonManager();

manager.prompt = [
  {
    type:'list',
    name: 'action',
    message: 'Select an action from the following options',
    choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Quit"]
  }
];

manager.promptChoice(manager.prompt);