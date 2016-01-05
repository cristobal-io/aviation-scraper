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
var debug = require("debug")("airlineData:links");

var errors = 0,
  routesSaved = 0;

function getRoutes(airline, callback) {
  var url = airline.url || BASE_URL + airline.destinationsLink;

  debug("Getting routes for %s from %s", airline.name, url); // eslint-disable-line no-console
  sjs.StaticScraper.create(url)
    .catch(function (err, utils) {
      if (err) {
        debug(chalk.red("\nerror from %s is %s, %s \n"), airline.name, err, url); // eslint-disable-line no-console
        callback(err, utils);
      }
    })
    .scrape(scrapers[airline.scraper] || scrapers["default"])
    .then(function (data) {
      airline.routes = data;
      writeJson(null, airline, callback);
    });
}

// todo: test this function
function getFilename(airline) {
  var defaultRoute = require("../schema/scraper.default.schema.json");
  var validateDefaultRoute = ajv.compile(defaultRoute);
  var validDefaultRoute = validateDefaultRoute(airline.routes);

  if (validDefaultRoute) {
    routesSaved += 1;
    airline.fileName = "./data/routes_" + airline.name + ".json";
  } else {
    debug("Airline %s got the error %s", airline.name, _.get(validateDefaultRoute, "errors[0].message"));
    errors += 1;
    airline.fileName = "./data/error_" + airline.name + ".json";
    airline.errorMessage = "Airline " + airline.name + " got the error " + _.get(validateDefaultRoute, "errors[0].message");
  }
  return airline;
}

var writeJson = function (err, airline, callback) {
  if (err) {
    throw err;
  }
  airline = getFilename(airline);
  var errorRegEx = /error/;

  fs.writeFile(airline.fileName,
    JSON.stringify(airline.routes, null, 2),
    function (err) {
      if (err) {
        throw err;
      }
      if (errorRegEx.test(airline.fileName)) {
        debug(chalk.red("Saved %s"), airline.fileName); // eslint-disable-line no-console
      } else {
        debug(chalk.green("Saved %s"), airline.fileName); // eslint-disable-line no-console
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
      console.log(chalk.red.bgWhite("\ngetAllRoutes found an error %s"), err); // eslint-disable-line no-console
    }
    airlines.routesSaved = routesSaved;
    airlines.errors = errors;
    debug("You got %s routes and %s errors", routesSaved, errors);
    callback(err, airlines);

  });
}

module.exports.getRoutes = getRoutes;
module.exports.getAllRoutes = getAllRoutes;

// getAllRoutes([{
//   "name": "Arik Air",
//   "destinationsLink": "/wiki/Arik_Air_destinations",
//   "scraper": "table"
// }, {
//   "name": "Air Austral",
//   "destinationsLink": "/wiki/Air_Austral_destinations",
//   "scraper": "table_center"
// }
// , {
//   "name": "Bulgaria Air charter",
//   "destinationsLink": "/wiki/Bulgaria_Air_charter_destinations",
//   "scraper": "default"
// }, {
//   "name": "Cape Air",
//   "destinationsLink": "/wiki/Cape_Air_destinations",
//   "scraper": "default"
// }, {
//   "name": "Cargolux",
//   "destinationsLink": "/wiki/Cargolux_destinations",
//   "scraper": "default"
// }, {
//   "name": "Caribair",
//   "destinationsLink": "/wiki/Caribair_destinations",
//   "scraper": "default"
// }, {
//   "name": "Cayman Airways",
//   "destinationsLink": "/wiki/Cayman_Airways_destinations",
//   "scraper": "table"
// }, {
//   "name": "Eastern Air Lines",
//   "destinationsLink": "/wiki/Eastern_Air_Lines_destinations",
//   "scraper": "default"
// }, {
//   "name": "Fiji Airways",
//   "destinationsLink": "/wiki/Fiji_Airways_destinations",
//   "scraper": "default"
// }, {
//   "name": "Flybe",
//   "destinationsLink": "/wiki/Flybe_destinations",
//   "scraper": "default"
// }
// ], function (err) {
//   if (err) {
//     throw err;
//   }
//   console.log("files saved");
// });
