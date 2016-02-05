"use strict";
var _ = require("lodash");
var airports = [];
var jsonAirline = require("./airlines.json");

function getAirports() {
  _.map(jsonAirline, function (value) {
    _.forEach(value.routes, function (value) {
      airports.push(value.airport);
    });
  });
}

getAirports();
