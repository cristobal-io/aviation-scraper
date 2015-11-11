  // to check wich scraper to use we can do it by checking 
  // if there are wikitables
  // $(".wikitable").hasClass("wikitable")
"use strict";

var sjs = require("scraperjs");
// var fs = require("fs");
var async = require("async");
var scrapers = require("./scrapers/");

var BASE_URL = "https://en.wikipedia.org";

var airlines = require("./data/destination_pages.json");

function getRoutes(options, callback) {
  var url = BASE_URL + options.destinationsLink;


  console.log("Getting scraper for %s from %s", options.name, url);
  sjs.StaticScraper.create(url)
    .scrape(scrapers["type_of_scrapper"]) //scrapers[options.scraper] ||
    .then(function (data) {
      // console.log("Results for %s", options.name);
      // console.log(JSON.stringify(data, null, 2));
      callback(null, data, options);
    });
}

var writeJson = function (err, scraper, options) {
  if (err) {
    throw err;
  }
  console.log("scraper : %s", scraper);
  console.log("options name : %s", options.name);
  // var filename = "./data/routes_" + options.name + ".json";

  // fs.writeFile(filename,
  //   JSON.stringify(routes, null, 2),
  //   function (err) {
  //     if (err) {
  //       throw err;
  //     }
  //     console.log("Saved %s", filename);
  //   }
  // );
};

// getRoutes(airlines[0], writeJson);

async.forEachOf(airlines, function (value) {
  getRoutes(value, writeJson);
  // console.log(value);
  // console.log(key);
  // console.log(callback);
}, function (err) {
  if (err) {
    throw err;
  }
});
