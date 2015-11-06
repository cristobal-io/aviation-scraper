var fs = require("fs");

var scraperjs = require('scraperjs');
var router = new scraperjs.Router();

var BASE_PATH = "https://en.wikipedia.org";

var airlines = JSON.parse(fs.readFileSync("./data/destination_pages.json"));
console.log(JSON.stringify(airlines));
//  This returns 
console.log(airlines.length);



  debugger;
  var routesObject = {}

router
  // .create(airlineLink)
    .on('*')
  .createStatic()
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

for (var l = 0; l < airlines.length; l++) {
  var airlineName = airlines[l]["name"];
  var airlineLink = BASE_PATH + airlines[l]["destinationsLink"];
  router.route(airlineLink);
};


// var sjs = require("scraperjs");

// var log = console.log;
// var router = new sjs.Router();

// function create30thLinkError() {
//   var err = new Error("Page doesn't have 30th link");
//   err.code = '30THLINK';
//   return err;
// }

// router
//   .on('*')
//   .createStatic()
//   .onStatusCode(function(code, utils) {
//     // if it's not Ok pause and log.
//     if (code != 200) {
//       log("Page '%s' has status code %d", utils.url, code);
//       utils.stop();
//     }
//   })
//   .catch(function (err, utils) {
//     // deal identify with errors and recover or panic
//     // this has the same problems as js error handling,
//     // it's messy and ugly
//     switch (err.code) {
//     case 'ENOTFOUND':
//       log("Page '%s' not found", err.hostname);
//       break;
//     case '30THLINK':
//       log("Page '%s' doesn't have a 30th link", utils.url);
//       break;
//     default:
//       log('Unknown error found %s', err);
//     }
//   })
//   .scrape(function ($) {
//     var thirty = $('a')[30];
//     if (thirty) {
//       return $(thirty).attr('href');
//     } else {
//       throw create30thLinkError();
//     }
//   })
//   .then(function (thirty, utils) {
//     log("'%s' has '%s' as it's 30th link", utils.url, thirty);
//   });

// // Front page of google doesn't have a 30th link
// router.route('http://google.com');
// // This page doesn't exist
// router.route('http://wouvoogle.com');
// // Hacker new have a 30th link
// router.route('http://news.ycombinator.com');
