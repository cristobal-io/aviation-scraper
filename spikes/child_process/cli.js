"use strict";
// var executeGetData = require("../../src/airports.js").executeGetData;
var child_process = require("child_process");
var BASE_URL = "https://en.wikipedia.org";
debugger;

function executeGetData(airportLink, callback) {
  var base = airportLink.base_url || BASE_URL;
  var url = JSON.stringify(base + airportLink.url);
  var name = JSON.stringify(airportLink.name);
  // var url = JSON.stringify(airportLink.url);
  // if (airportLink.base_url) {
  //   url = url + " " + JSON.stringify(airportLink.base_url);
  // }



  child_process.exec(["bin/airport-data " + name + " " + url],

    function (err, stdout) {
      if (err) {
        console.log("child processes failed with error code: " +
          err.code);
      }
      var result = JSON.parse(stdout);

      callback(result);
    });
}

executeGetData({
  "name": "Amsterdam Airport Schiphol",
  "base_url": "http://localhost:3000/",
  "url": "Amsterdam_Airport_Schiphol"
}, function (data) {
  console.log(data.coordinates);
  console.log(typeof data);
  console.log(data);
  console.log("worked!");
});
