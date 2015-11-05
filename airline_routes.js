var fs = require("fs");

var scraperjs = require('scraperjs');

//  This returns 
var routesObject = {}



scraperjs.StaticScraper.create("https://en.wikipedia.org/wiki/Adria_Airways_destinations")
  .scrape(function ($) {
    return $("#mw-content-text h2").map(function () {
      // return {
      // origin: $("h2").map(function () {
      var from = $(this).find(".mw-headline").text();
      return {
        routes: $(this).next(".wikitable").map(function (index, elem) {
          var destinations = [];
          var $headers = $(this).find("th");
          var $tableContent = $(this).find("tr td");
          var row = [];
          for (var i = 0, j = 0, k = 0; i < $tableContent.length; i++, j++) {
            var textHeader = $($headers[j]).text();
            var textTableContent = $($tableContent[i]).text()
            if (row[k] === undefined) {
              row.push(k);
              row[k] = {};
            };
            row[k][textHeader] = (textTableContent);
            if (j > $headers.length - 2) {
              j = -1;
              k++
            };
          };
          destinations.push(row);
          routesObject[from] = destinations;
          return destinations;
        })
      }
    })
  })
  .then(function () {
    console.log(routesObject);
    var filename = "./data/routes_pages.json";
    fs.writeFile(filename,
      JSON.stringify(routesObject, null, 2),
      function (err) {
        if (err) {
          throw err;
        }
        console.log("Saved %s", filename);
      }
    );
  });