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
      callback(null, airports);
    });
}

function getAllAirportsByIata(list, callback) {
  iataList = list || iataList;
  async.mapLimit(iataList, 10, function (iataLink, callback) {

    async.retry(5, function (callback) {
      getAirportsByIata(iataLink, callback);
    }, callback);

  }, function (err, airportsData) {
    airportsData = _.flatten(airportsData);
    callback(err, airportsData);
  });

}
module.exports = {
  getAllAirportsByIata : getAllAirportsByIata,
  getAirportsByIata : getAirportsByIata
};

