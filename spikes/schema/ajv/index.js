"use strict";
var Ajv = require("ajv");
var ajv = Ajv(); 

var data = require("../example.json");
var schema = require("../schema_example.json");

console.log("data: ", JSON.stringify(data, null, 2));
console.log("schema: ", JSON.stringify(schema, null, 2));

var validate = ajv.compile(schema);
var valid = validate(data);

if (!valid) {console.log(validate.errors);}

console.log(valid);
