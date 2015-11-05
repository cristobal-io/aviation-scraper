var fs = require("fs");

var scraperjs = require('scraperjs');

scraperjs.StaticScraper.create('https://en.wikipedia.org/wiki/Category:Lists_of_airline_destinations')
  .scrape(function ($) {
    return $(".mw-category li a").map(function () {
      return {
        name: $(this).text().replace(/ destinations$/, ""),
        destinationsLink: $(this).attr("href")
      };
    }).get();
  })
  .then(function (destinationPages) {
    var filename = "./data/destination_pages.json";
    fs.writeFile(filename,
      JSON.stringify(destinationPages, null, 2),
      function (err) {
        if (err) {
          throw err;
        }
        console.log("Saved %s", filename);
      }
    );
  });
