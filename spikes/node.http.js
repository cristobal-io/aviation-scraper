"use strict";
var https = require("https");

https.get("https://en.wikipedia.org/wiki/Adria_Airways_destinations", function (res) {
  console.log("Got response: " + res.statusCode);//eslint-disable-line no-console
  // console.log("body?" + JSON.stringify(res));
  res.on("data", function (chunk) {
    console.log("chunk: " + chunk);//eslint-disable-line no-console
  });
}).on("error", function (e) {
  console.log("Got error: " + e.message);//eslint-disable-line no-console
});
