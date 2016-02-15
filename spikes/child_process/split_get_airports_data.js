"use strict";
var source = require("../../src/");
var splitGetAirportsData = source.splitGetAirportsData;
var airportLinks = require("../../test/fixtures/airport_links.json");

splitGetAirportsData(airportLinks, function(err, stdout) {
  if (err) {console.log(err);}
  var result = stdout.toString();
  console.log(result.split("\n"));
  console.log("completed process!!");
});
