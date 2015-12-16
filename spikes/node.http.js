"use strict";
var http = require("http");

http.get("http://www.sitepoint.com", function (res) {
  debugger;
  console.log("Got response: " + res.statusCode);
  // console.log("body?" + JSON.stringify(res));
  res.on("data", function (chunk) {
    console.log("chunk: " + chunk);
  });
}).on("error", function (e) {
  console.log("Got error: " + e.message);
});
