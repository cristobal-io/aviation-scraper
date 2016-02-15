/*eslint-disable no-console*/

"use strict";
var source = require("../../src/");
var splitGetAirportsData = source.splitGetAirportsData;
var airportslistComplete = require("../../data/airports_list.json");
// var airportLinks = require("../../test/fixtures/airport_links.json");

splitGetAirportsData(airportslistComplete, function(err, stdout) {
  if (err) {console.log(err);}
  var result = stdout.toString();

  console.log(result.split("\n"));
  console.log("completed process!!");
});
