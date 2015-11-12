"use strict";

var sjs = require("scraperjs");
var fs = require("fs");
// var async = require("async");
var scrapers = require("./scrapers/");

var BASE_URL = "https://en.wikipedia.org";

var airlines = require("./data/destination_pages.json");

function getRoutes(options, callback) {
  var url = BASE_URL + options.destinationsLink;


  console.log("Getting routes for %s from %s", options.name, url);
  sjs.StaticScraper.create(url)
    .scrape(scrapers[options.scraper] || scrapers["default"])
    .then(function (data) {
      // console.log("Results for %s", options.name);
      // console.log(JSON.stringify(data, null, 2));
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
      console.log("Saved %s", filename);
    }
  );
};

getRoutes(airlines[5], writeJson);

// async.forEachOf(airlines, function (value) {
//   getRoutes(value, writeJson);
//   // console.log(value);
//   // console.log(key);
//   // console.log(callback);
// }, function (err) {
//   if (err) {
//     throw err;
//   }
// });
