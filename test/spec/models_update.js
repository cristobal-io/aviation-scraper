"use strict";

var sjs = require("scraperjs");
var fs = require("fs");

function getRoutes() {
  var url = "https://en.wikipedia.org/wiki/AeroSur_destinations";


  console.log("Getting routes for %s from %s", "Aerosur", url);
  sjs.StaticScraper.create(url)
    .scrape(function ($) {
      return $("body");
    })
    .then(function (data) {
      // console.log("Results for %s", options.name);
      // console.log(JSON.stringify(data, null, 2));
      var filename = "./models/aerosur_html.json";

      fs.writeFile(filename,
        JSON.stringify(data, null, 2),
        function (err) {
          if (err) {
            throw err;
          }
          console.log("Saved %s", filename);
        }
      );
    });
}

getRoutes();
