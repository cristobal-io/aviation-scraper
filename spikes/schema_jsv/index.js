"use strict";

var JSV = require("JSV").JSV;

var exampleJson = require("./example.json");
var exampleSchema = require("./schema_example.json");
var env = JSV.createEnvironment();

console.log("exampleJson : ", JSON.stringify(exampleJson, null, 2));

console.log("exampleSchema : ", JSON.stringify(exampleSchema, null, 2));
var exampleReport = env.validate(exampleJson, exampleSchema);

if (exampleReport.errors.length === 0) {
  console.log("validation passed");
} else {
  console.log("exampleSchema  errors: ", JSON.stringify(exampleReport.errors, null, 2));

  console.log("property error:", exampleReport.errors[0].uri.split("/").pop());
  // console.log("exampleSchema  errors: ", exampleReport);

}


// var schema = {
//   "type": "object"
// };

// var report = env.validate(json, schema);

// if (report.errors.length === 0) {
//   console.log("validation passed");
// } else {
//   console.log(report.errors[0].message);
// }
// // env = JSV.createEnvironment();

// var example2 = env.validate({
//   a: 1
// }, {
//   type: "object",
//   properties: {
//     a: {
//       type: "string"
//     }
//   }
// });

// console.log("example2 errors: %s", JSON.stringify(example2.errors, null, 2));
// env = JSV.createEnvironment();

