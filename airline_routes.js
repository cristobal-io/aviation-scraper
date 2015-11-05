var fs = require("fs");

var scraperjs = require('scraperjs');

var BASE_PATH = "https://en.wikipedia.org";

var airlines = JSON.parse(fs.readFileSync("./data/destination_pages.json"));
console.log(JSON.stringify(airlines));
//  This returns 
console.log(airlines.length);

for (var l = 0; l < airlines.length; l++) {
  var airlineName = airlines[l]["name"];
  var airlineLink = BASE_PATH + airlines[l]["destinationsLink"];

  debugger;
  var routesObject = {}

  scraperjs.StaticScraper.create(airlineLink)
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
            routesObject[from] = row;
            return destinations;
          })
        }
      })
    })
    .then(function () {
      var filename = "./data/routes_" + airlineName + ".json";
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
};
