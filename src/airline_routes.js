"use strict";

var sjs = require("scraperjs");
var fs = require("fs");
var scrapers = require("../scrapers/");
var _ = require("lodash");
var async = require("async");

var BASE_URL = "https://en.wikipedia.org";

var airlines = require("../data/destination_pages.json");

function getRoutes(options, callback) {
  console.log("options: ", options);
  var url = options.url || BASE_URL + options.destinationsLink;

  if (process.env.NODE_ENV !== "test") {
    console.log("Getting routes for %s from %s", options.name, url); // eslint-disable-line no-console
  }
  sjs.StaticScraper.create(url)
    .scrape(scrapers[options.scraper] || scrapers["default"])
    .then(function (data) {
      console.log("Results for %s", options.name);
      console.log(JSON.stringify(data, null, 2));
      callback(null, data, options);
    });
}

var writeJson = function (err, routes, options) {
  if (err) {
    throw err;
  }
  var filename = "./data/routes_" + options.name + ".json";

  fs.writeFile(filename,
    JSON.stringify(routes, null, 2),
    function (err) {
      if (err) {
        throw err;
      }
      console.log("Saved %s", filename); // eslint-disable-line no-console
    }
  );
};

airlines = _.where(airlines, {
  "isolate": true
}) || airlines;
// console.trace(airlines);
// process.exit();
// getRoutes(airlines[1], writeJson);

getAllRoutes(airlines, function () {
  console.log("callback finished");
});


// changed to use the function inside the test, not sure if the callback will 
// work properly

function getAllRoutes(airlines, callback) {
  console.log(airlines);
  async.forEachOf(airlines, function (value, key, callback) {
    getRoutes(value, writeJson);
    callback();
  }, function (err) {
    if (err) {
      throw err;
    }
  });
  // todo: this callback is not really working when called among process.
  callback();
}

module.exports.getRoutes = getRoutes;
module.exports.getAllRoutes = getAllRoutes;
