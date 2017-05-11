"use strict";
var airlines = require("../tmp/airlines_links.json");
var fs = require("fs");
/* eslint-disable */
var airlinesLinksStats = airlines.reduce(function(result, airline) {
  result.counter += 1;
  if (airline.airline.link){
    result.link += 1;
  } 
  if (airline.ICAO) {
    result.ICAO += 1;
  }
  if (airline.IATA) {
    result.IATA += 1;
  }
  if (airline.CallSign) {
    result.CallSign += 1;
  }
  if (airline.Country) {
    result.Country += 1;
  }
  if (airline.airline.name) {
    result.name += 1;
  }

  return result;
}, {
  counter: 0,
  link: 0,
  ICAO: 0,
  IATA: 0,
  CallSign: 0,
  Country: 0,
  name: 0

});
var fileName = "./tmp/airlines_links_stats.json";

fs.writeFile(fileName, JSON.stringify(airlinesLinksStats,null, 2), function() {
  console.log( "we have", airlinesLinksStats.counter, "airlines listed");
  console.log("Here the numbers", JSON.stringify(airlinesLinksStats, null, 2));
  console.log("the file", fileName, "has been saved");
});
