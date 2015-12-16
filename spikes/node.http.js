"use strict";
var https = require("https");

https.get("https://en.wikipedia.org/wiki/Adria_Airways_destinations", function (res) {
  debugger;
  console.log("Got response: " + res.statusCode);
  // console.log("body?" + JSON.stringify(res));
  res.on("data", function (chunk) {
    console.log("chunk: " + chunk);
  });
}).on("error", function (e) {
  console.log("Got error: " + e.message);
});
