"use strict";
var tv4 = require("tv4");

var data = require("../example.json");
var schema = require("../schema_example.json");

console.log(data);
console.log(schema);


var valid = tv4.validate(data, schema);

console.log(valid);
