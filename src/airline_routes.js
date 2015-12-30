"use strict";

var sjs = require("scraperjs");
var fs = require("fs");
var scrapers = require("../scrapers/");
var async = require("async");

var BASE_URL = "https://en.wikipedia.org";

var _ = require("lodash");
// var airlines = require("../data/destination_pages.json");

function getRoutes(airline, callback) {
  var url = airline.url || BASE_URL + airline.destinationsLink;

  if (process.env.NODE_ENV !== "test") {
    console.log("Getting routes for %s from %s", airline.name, url); // eslint-disable-line no-console
  }
  sjs.StaticScraper.create(url)
    .catch(function (err, utils) {
      if (err) {
        console.log("error from %s is %s", airline.name, err); // eslint-disable-line no-console
        // callback(err, utils);
        console.log(utils); // eslint-disable-line no-console
      }
    })
    .scrape(scrapers[airline.scraper] || scrapers["default"])
    .then(function (data) {
      airline.routes = data;
      writeJson(null, airline, callback);
    });
}

var writeJson = function (err, airline, callback) {
  if (err) {
    throw err;
  }
  var filename = airline.destinationsFile || "./data/routes_" + airline.name + ".json";

  fs.writeFile(filename,
    JSON.stringify(airline.routes, null, 2),
    function (err) {
      if (err) {
        throw err;
      }
      if (process.env.NODE_ENV !== "test") {
        console.log("Saved %s", filename); // eslint-disable-line no-console
      }
      callback(null, airline);
    }
  );
};

function getAllRoutes(airlines, callback) {
  // console.log(airlines);

  async.map(_.clone(airlines,true), function (airline, callback) {
    // console.log(airline);
    getRoutes(airline, callback);
  }, function (err, airlines) {
    if (err) {
      throw err;
    }
    callback(null, airlines);
  });
}

module.exports.getRoutes = getRoutes;
module.exports.getAllRoutes = getAllRoutes;

// airlines = _.where(airlines, {
//   "isolate": true
// }) || airlines;
// console.trace(airlines);
// process.exit();
// getRoutes(airlines[1], writeJson);

// getAllRoutes(airlines, function () {
//   console.log("callback finished");
// });
