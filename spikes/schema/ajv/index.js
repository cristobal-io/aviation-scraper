"use strict";

var data = require("../example.json");
var schema = require("../schema_example.json");

console.log("data: ", JSON.stringify(data, null, 2));
console.log("schema: ", JSON.stringify(schema, null, 2));

var Ajv = require("ajv");
var ajv = Ajv(); 

console.log("schema compiling...");
var validate = ajv.compile(schema);

console.log("shcema compiled.");
var valid = validate(data);

if (!valid) {console.log(validate.errors);}

console.log(valid);

// starting validation of second schema with different json values.

var schemaOrg = require("../schema_example.org.json");

console.log("schemaOrg: ", schemaOrg);
var exampleName = require("../example_name.json");

console.log("exampleName: ", exampleName);

var nameSchema = ajv.compile(schemaOrg);

var validExampleName = nameSchema(exampleName);

if (!validExampleName) {console.log(nameSchema.errors);}

console.log(validExampleName);
