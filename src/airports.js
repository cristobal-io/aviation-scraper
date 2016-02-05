"use strict";

var fs = require("fs");
var _ = require("lodash");

var debug = require("debug")("airlineData:airports");


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

  _.map(airlines, function (value) {
    _.forEach(value.routes, function (value) {
      airports.push(value.airport);
    });
  });
  // airports = _.orderBy(airports, "name");
  // Bermi I've added this "if" so if no filename is passed, doesn't cause
  // problems, I guess that is not the best way of doing it and I should
  // rewrite the getAirports function with a callback.
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
