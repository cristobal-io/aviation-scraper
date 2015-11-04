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
        if (err) { throw err; }
        console.log("Saved %s", filename);
      }
    );
  });

// this is intended for the destinations page
// Only has the code to be run on the browser directly

  $("#mw-content-text").map(function() {
    return {
      origin: $(".mw-headline").map(function() {
        return {
          origin: $(this).text().replace(/Scheduled destinations from /, ""),
          destinations: $("table tbody td").text()
        }
      }).get()
      
    };
  })

  $("h2").next(".wikitable")

    $("#mw-content-text").map(function() {
    return {
      origin: $(".mw-headline").map(function() {
        return {
          origin: $(this).text().replace(/Scheduled destinations from /, ""),
          destinations: $("h2").next(".wikitable").innerText
        }
      }).get()
      
    };
  })


//  This returns 

      $("#mw-content-text").map(function() {
    return {
      origin: $("h2").map(function() {
        return {
          origin: $(this).text().replace(/Scheduled destinations from /, ""),
          destinations: $(this).next(".wikitable").map(function(index, elem) {
            var destinations = [];
            var tableContent = $(this).find("tr");
            for (var i = 0; i < tableContent.length; i++) {
              var destination = {};
              for (var i = 0; i < Things.length; i++) {
                Things[i]
              };
              tableContent[i]
            };
            console.log(JSON.stringify(tableContent));
            return {
              valueOfThis: $(this).find("td")
              // City: $(this).
              // Country:
              // IATA:
              // ICAO:
              // Airport;
            };
          })
        }
      }).get()
    };
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
var $rows = $(".wikitable tr").each(function(index) {
  $cells = $(this).find("td");
  myRows[index] = {};

  $cells.each(function(cellIndex) {
    // Set the header text
    if(headersText[cellIndex] === undefined) {
      headersText[cellIndex] = $($headers[cellIndex]).text();
    }
    // Update the row object with the header/cell combo
    myRows[index][headersText[cellIndex]] = $(this).text();
  });    
});