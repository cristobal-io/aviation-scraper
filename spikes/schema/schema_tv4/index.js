"use strict";
var tv4 = require("tv4");

var data = require("../schema_jsv/example.json");
var schema = require("../schema_jsv/schema_example.json");

var valid = tv4.validate(data, schema);

console.log(valid);
