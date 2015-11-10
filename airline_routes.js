/**
 * DISCLAIMER
 * This is a relatively simple example, to illustrate some of the
 *   possible functionalities and how to achieve them.
 *   There is no guarantee that this example will provide useful
 *   results.
 *   Use this example with and at your own responsibility.
 *
 * In this example we run through some urls and try to extract their
 *   30th link. It demonstrates how to deal with errors.
 *
 * To run:
 * 'node ErrorHandling.js'
 */
"use strict";

var sjs = require("scraperjs");

var fs = require("fs");

var scrapers = require("./scrapers/");

var BASE_URL = "https://en.wikipedia.org";

var airlines = require("./data/destination_pages.json");

console.log(typeof airlines);


function getRoutes (options, callback) {
  var url = BASE_URL + options.destinationsLink;

  console.log("Getting routes for %s from %s", options.name, url);
  sjs.StaticScraper.create(url)
  .scrape(scrapers["default"])//scrapers[options.scraper] ||
  .then(function (data) {
    // console.log("Results for %s", options.name);
    // console.log(JSON.stringify(data, null, 2));
    callback(null, data, options);
  });
}

var writeJson = function (err, routes, options) {
  if (err) {throw err;}
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
  console.log("finished");
};

getRoutes(airlines[10],writeJson);

airlines.forEach(function  (index) {
  console.log(index);
  getRoutes(index, writeJson);
});
