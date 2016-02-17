"use strict";
var _ = require("lodash");
var airports = [];
var jsonAirline = require("./airlines.json");

function getAirports(airlines) {
  _.map(airlines, function (value) {
    _.forEach(value.destinations, function (value) {
      airports.push(value.airport);
    });
  });
  airports = _.orderBy(airports, "name");
  writeJson(airports, "spikes/airports/airports.json");
}

var fs = require("fs");

var writeJson = function (airlines, fileName) {
  
  
  fs.writeFile(fileName,
    JSON.stringify(airlines, null, 2),
    function (err) {
      if (err) {
        throw err;
      }
      console.log("saved %s file", fileName);//eslint-disable-line no-console
    }
  );
};

getAirports(jsonAirline);
