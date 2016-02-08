"use strict";

var fs = require("fs");
var _ = require("lodash");

var debug = require("debug")("airlineData:airports");
var cleanDuplicates = require("../src/airline_destinations.js").cleanDuplicates;


var writeJson = function (airlines, fileName, callback) {
  fs.writeFile(fileName,
    JSON.stringify(airlines, null, 2),
    function (err) {
      if (err) {
        throw err;
      }
      callback();
    }
  );
};

function getAirports(airlines, fileName) {
  var airports = [];
  
  function insertAirports(airlineDestinations){
    return _.map(airlineDestinations.routes, function (destination) {
      airports.push(destination.airport);
    });
  }
  _.map(airlines, function (airlineDestinations) {
    if(airlineDestinations.routes.length){
      insertAirports(airlineDestinations);
    }
  });
  airports = cleanDuplicates(airports);
  // airports = _.orderBy(airports, "name");
  // Bermi I've added this "if" so if no filename is passed, doesn't cause
  // problems, I guess that is not the best way of doing it and I should
  // rewrite the getAirports function with a callback.
  // 
  // I think the right thing to do is to write it with a callback.
  // 
  // callback(err, airports);
  // 
  // And when using the callback, apply the writeJson function
  // 
  if (fileName) {
    writeJson(airports, fileName, function() {
      debug("saved %s", fileName);
    });
  }
  // Bermi I've added return so I can test the function.
  // I have some doubts about how to test a function if it doesn't have a 
  // callback or returns something.
  return airports;
}

module.exports.getAirports = getAirports;
module.exports.writeJson = writeJson;
