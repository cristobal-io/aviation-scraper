"use strict";

module.exports = function ($) {
  var destinations = {};

  $(".mw-content-ltr ul li").each(function () {
    var lines = $(this).text().split("\n");

    var from;

    if (lines.length > 1) {
      from = lines[0];
    } else {
      var links = $(this).find("a");

      destinations[from] = {
        city: {
          name: links.get(0).textContent,
          url: links.get(0).href
        },
        airport: {
          name: links.get(1).textContent,
          url: links.get(1).href
        }
      };
    }
    // });
    console.log(JSON.stringify(destinations, null, 2));
    return destinations;
    // $(".mw-category li a").map(function () {
    //   return {
    //     name: $(this).text().replace(/ destinations$/, ""),
    //     destinationsLink: $(this).attr("href")
    //   };
  }).get();
};
