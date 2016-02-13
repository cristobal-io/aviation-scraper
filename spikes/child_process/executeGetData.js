"use strict";
// export DEBUG=airlineData*

// var executeGetData = require("../../src/airports.js").executeGetData;
var child_process = require("child_process");
// var BASE_URL = "https://en.wikipedia.org";

function executeGetData(airportLink, callback) {
  var url = JSON.stringify(airportLink.url);
  var name = JSON.stringify(airportLink.name);
  // var url = JSON.stringify(airportLink.url);
  // if (airportLink.base_url) {
  //   url = url + " " + JSON.stringify(airportLink.base_url);
  // }



  child_process.exec(["DEBUG=airlineData* bin/airport-data " + name + " " + url],
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
  "url": "/wiki/Amsterdam_Airport_Schiphol"
}, function (data) {
  console.log(data.coordinates);
  console.log(typeof data);
  console.log(data);
  console.log("worked!");
});
