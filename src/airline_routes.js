"use strict";

var sjs = require("scraperjs");
var fs = require("fs");
var scrapers = require("../scrapers/");
var async = require("async");

var BASE_URL = "https://en.wikipedia.org";

var _ = require("lodash");

var Ajv = require("ajv");
var ajv = Ajv();

var chalk = require("chalk");

function getRoutes(airline, callback) {
  var url = airline.url || BASE_URL + airline.destinationsLink;

  if (process.env.NODE_ENV !== "test") {
    console.log("Getting routes for %s from %s", airline.name, url); // eslint-disable-line no-console
  }
  sjs.StaticScraper.create(url)
    .catch(function (err, utils) {
      if (err) {
        if (process.env.NODE_ENV !== "test") {
          console.log(chalk.red("\nerror from %s is %s, %s \n"), airline.name, err, url); // eslint-disable-line no-console
        }
        callback(err, utils);
      }
    })
    .scrape(scrapers[airline.scraper] || scrapers["default"])
    .then(function (data) {
      airline.routes = data;
      writeJson(null, airline, callback);
    });
}

function getFilename(airline) {
  var defaultRoute = require("../schema/scraper.default.schema.json");
  var validateDefaultRoute = ajv.compile(defaultRoute);
  var validDefaultRoute = validateDefaultRoute(airline.routes);

  if (validDefaultRoute) {
    return airline.destinationsFile || "./data/routes_" + airline.name + ".json";
  } else {
    return "./data/error_" + airline.name + ".json";
  }
}
var writeJson = function (err, airline, callback) {
  if (err) {
    throw err;
  }
  var filename = getFilename(airline);
  var errorRegEx = /error/;

  fs.writeFile(filename,
    JSON.stringify(airline.routes, null, 2),
    function (err) {
      if (err) {
        throw err;
      }
      if (process.env.NODE_ENV !== "test") {
        if (errorRegEx.test(filename)) {
          console.log(chalk.red("Saved %s"), filename); // eslint-disable-line no-console
        } else {
          console.log(chalk.green("Saved %s"), filename); // eslint-disable-line no-console
        }
      }
      callback(null, airline);
    }
  );
};

function getAllRoutes(airlines, callback) {

  async.mapLimit(_.clone(airlines, true), 20, function (airline, callback) {
    async.retry(5, function (callback) {
      getRoutes(airline, callback);
    }, callback);

  }, function (err, airlines) {
    if (err) {
      console.log(chalk.red.bgWhite("\ngetAllRoutes found an error %s"), err);// eslint-disable-line no-console
    }
    callback(err, airlines);

  });
}

module.exports.getRoutes = getRoutes;
module.exports.getAllRoutes = getAllRoutes;

// getAllRoutes([{
//   "name": "Aegean Airlines",
//   "destinationsLink": "/wiki/Aegean_Airlines_destinations",
//   "scraper": "table"
// }, {
//   "name": "Aer Lingus",
//   "destinationsLink": "/wiki/Aer_Lingus_destinations",
//   "scraper": "table"
// }], function (err) {
//   if (err) {throw err;}
//   console.log("files saved");
// });

