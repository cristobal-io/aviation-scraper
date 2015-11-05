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

// this is intended for the destinations page
// Only has the code to be run on the browser directly

$("#mw-content-text").map(function () {
  return {
    origin: $(".mw-headline").map(function () {
      return {
        origin: $(this).text().replace(/Scheduled destinations from /, ""),
        destinations: $("table tbody td").text()
      }
    }).get()

  };
})

$("h2").next(".wikitable")

$("#mw-content-text").map(function () {
  return {
    origin: $(".mw-headline").map(function () {
      return {
        origin: $(this).text().replace(/Scheduled destinations from /, ""),
        destinations: $("h2").next(".wikitable").innerText
      }
    }).get()

  };
})


//  This returns 

$("#mw-content-text h2").map(function () {
  // return {
    // origin: $("h2").map(function () {
      return {
        origin: $(this).find(".mw-headline").text().replace(/Scheduled destinations from /, ""),
        destinations: $(this).next(".wikitable").map(function (index, elem) {
          var destinations = [];
          var $headers = $(this).find("th");
          // var $rows = $(this).find("tbody tr");
          var $tableContent = $(this).find("tr td");
          // for (var l = 0; l < $originFrom.length; l++) {
          // console.log("from : " + $($originFrom[l]).text());
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
          // console.log(row);
          destinations.push(row);
          // };
          return destinations;
        })
      }
    // }).get()
  // };
})



// This returns the first city of the table, with a for loop we can iterate over all 
// 
$(".wikitable").find("td")[0]


// this returns objects of each Airport
// 
var myRows = [];
var headersText = [];
var $headers = $("th");

// Loop through grabbing everything
// var $rows = $(".wikitable tr").each(function (index) {
  $cells = $(this).find("td");
  myRows[index] = {};

  $cells.each(function (cellIndex) {
    // Set the header text
    if (headersText[cellIndex] === undefined) {
      headersText[cellIndex] = $($headers[cellIndex]).text();
    }
    // Update the row object with the header/cell combo
    myRows[index][headersText[cellIndex]] = $(this).text();
  });
});
