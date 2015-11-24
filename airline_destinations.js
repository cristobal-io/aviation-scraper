"use strict";

var fs = require("fs");

var scraperjs = require("scraperjs");

// scraperjs.StaticScraper.create("https://en.wikipedia.org/w/index.php?title=Category:Lists_of_airline_destinations&from=B")
//   .scrape(function ($) {
//     return $(".mw-category li a").map(function () {
//       return {
//         name: $(this).text().replace(/ destinations$/, ""),
//         destinationsLink: $(this).attr("href")
//       };
//     }).get();
//   })
//   .then(function (destinationPages) {
//     var filename = "./data/destination_pages.json";

//     fs.writeFile(filename,
//       JSON.stringify(destinationPages, null, 2),
//       function (err) {
//         if (err) {
//           throw err;
//         }
//         console.log("Saved %s", filename);
//       }
//     );
//   });

// refactoring destinations to include the hole alphabet

var destinationsFile = "./data/destination_pages.json";
var destinationPages = {};
// generate the array with all the links

var BASE_URL = "https://en.wikipedia.org/w/index.php?title=Category:Lists_of_airline_destinations&from=";
var url = [];

for (var i = 65; i <= 90; i += 1) {
  console.log(String.fromCharCode(i));
  url.push(BASE_URL + String.fromCharCode(i));
}

// Array with urls generated.

var scrapers = require("./scrapers/");
var _ = require("lodash");

function getDestinations(options, callback) {
  // var url = options.url;
  var letter = options.charAt(options.length-1);

  console.log("Getting scraper for %s from %s", letter, options);
  scraperjs.StaticScraper.create(options)
    .scrape(scrapers["destinations"])
    .then(function (destinations) {
      // console.log(JSON.stringify(destinations,null, 2));
      callback(null, destinations);
    });
}

var async = require("async");

async.map(url, function (options, callback) {
  getDestinations(options, callback);
}, function (err, results) {
  if (err) {
    throw err;
  }
  console.log(JSON.stringify(results, null, 2));
  // airlines = _.reduce(results, function (airlines, result) {
  //   var index = _.findIndex(airlines, {
  //     name: result.name
  //   });

  //   airlines[index].scraper = result.type;
  //   return airlines;
  // }, airlines);
  // fs.writeFileSync(destinationsFile, JSON.stringify(airlines, null, 2));
  console.log("Saved %s", destinationsFile);
});
