var Bamazon = require("./Bamazon.js");

function BamazonCustomer() {
  Bamazon.call(this);
}

BamazonCustomer.prototype = Object.create(Bamazon.prototype);


// Run
BamazonCustomer();