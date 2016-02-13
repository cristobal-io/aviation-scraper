"use strict";
// var executeGetData = require("../../src/airports.js").executeGetData;
var child_process = require("child_process");


function executeGetData(airportLink, callback) {
  var name = JSON.stringify(airportLink.name);
  var url = JSON.stringify(airportLink.url);


  child_process.exec(["bin/airport-data " + name + " " + url],

    function (err, stdout) {
      if (err) {
        console.log("child processes failed with error code: " +
          err.code);
      }
      console.log(typeof stdout);
      console.log(stdout);
      callback(stdout);
    });
}

executeGetData({
  "name": "Anaa Airport",
  "url": "/wiki/Anaa_Airport"
}, function (data) {
  console.log(data);
  console.log("worked!");
});
