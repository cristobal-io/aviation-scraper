"use strict";
var async = require("async");
var _ = require("lodash");

var scrapers = require("../scrapers/");

var letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
var iataList = [];

for (var i = 0; i < letters.length; i += 1) {
  iataList.push("https://en.wikipedia.org/wiki/List_of_airports_by_IATA_code:_" + letters[i]);
}

var scraperjs = require("scraperjs");


function getAirportsByIata(iataLink, callback) {
  scraperjs.StaticScraper.create(iataLink)
    .scrape(scrapers["airportsIata"])
    .then(function (airports) {
      console.log(JSON.stringify(airports, null, 2)); // eslint-disable-line no-console
      callback(null, airports);
    });
}

function getAllAirportsByIata(options, callback) {
  iataList = options.iataList || iataList;
  async.mapLimit(iataList, 10, function (iataLink, callback) {

    async.retry(5, function (callback) {
      getAirportsByIata(iataLink, callback);
    }, callback);

  }, function (err, airportsData) {
    airportsData = _.flatten(airportsData);
    callback(err, airportsData);
  });

}

module.exports.getAllAirportsByIata = getAllAirportsByIata;
module.exports.getAirportsByIata = getAirportsByIata;

