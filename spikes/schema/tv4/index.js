"use strict";

var data = require("../example.json");
var schema = require("../schema_example.json");

console.log("data: ", JSON.stringify(data, null, 2));
console.log("schema: ", JSON.stringify(schema, null, 2));


var tv4 = require("tv4");


console.log(tv4.validate(data, schema));
if (tv4.error) {
  console.log("data 2 error: " + JSON.stringify(tv4.error, null, 2));
}
