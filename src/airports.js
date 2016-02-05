"use strict";

var fs = require("fs");
var _ = require("lodash");

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

function getAirports(airlines, fileName) {
  var airports = [];

  _.map(airlines, function (value) {
    _.forEach(value.routes, function (value) {
      airports.push(value.airport);
    });
  });
  // airports = _.orderBy(airports, "name");
  writeJson(airports, fileName);
}

module.exports.getAirports = getAirports;
module.exports.writeJson = writeJson;
