"use strict";
var async = require("async");
var _ = require("lodash");

var scrapers = require("../scrapers/");
var src = require("./index.js");
var writeJson = src.writeJson;

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

function getAllAirportsByIata(iataList, callback) {

  async.mapLimit(iataList, 10, function (iataLink, callback) {

    async.retry(5, function (callback) {
      getAirportsByIata(iataLink, callback);
    }, callback);

  }, function (err, airportsData) {

    callback(err, _.flatten(airportsData));
  });

}

module.exports.getAllAirportsByIata = getAllAirportsByIata;

getAllAirportsByIata(iataList, function(err, airportsData) {
  writeJson(airportsData, "./data/airports_list.json", function() {
    console.log("airports_list saved");
  });
});
