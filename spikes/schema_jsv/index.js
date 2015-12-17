"use strict";

var JSV = require("JSV").JSV;

var json = "hello";
var schema = {
  "type": "object"
};
var exampleJSON = require("./schema_example.json");
var env = JSV.createEnvironment();
var report = env.validate(json, schema);

if (report.errors.length === 0) {
  console.log("validation passed");
} else {
  console.log(report.errors[0].message);
}
env = JSV.createEnvironment();

var example2 = env.validate({
  a: 1
}, {
  type: "object",
  properties: {
    a: {
      type: "string"
    }
  }
});

console.log("example2 errors: %s", JSON.stringify(example2.errors, null, 2));
env = JSV.createEnvironment();

console.log(exampleJSON);
var exampleReport = env.validate(json, exampleJSON);

if (exampleReport.errors.length === 0) {
  console.log("validation passed");
} else {
  console.log(exampleReport.errors[0]);
}
