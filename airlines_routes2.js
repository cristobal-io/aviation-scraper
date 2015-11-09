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

// var fs = require("fs");

var scrapers = require("./scrapers/");

var BASE_URL = "https://en.wikipedia.org";

var airlines = require("./data/destination_pages.json");


function getRoutes (options, callback) {
  var url = BASE_URL + options.destinationsLink;

  console.log("Getting routes for %s from %s", options.name, url);
  sjs.StaticScraper.create(url)
  .scrape(scrapers[options.scraper] || scrapers["default"])
  .then(function (data) {
    callback(null, data);
  });
}
getRoutes(airlines[10],function (err, routes) {
  if (err) {throw err;}
  console.log(routes);
});

