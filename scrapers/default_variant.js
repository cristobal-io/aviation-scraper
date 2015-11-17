"use strict";

module.exports = function ($) {
  var destinations = {};
  var from;

  $(".mw-content-ltr h3").map(function () {
    var destinations = $(this).next("ul");

    console.log(JSON.stringify(destinations.text(), null, 2));
    return console.log(JSON.stringify($(this).find(".mw-headline").text(), null, 2));
  });

  $(".mw-content-ltr ul li").each(function () {

    if (/toclevel/.test($(this).attr("class"))) {
      return;
    }

    var lines = $(this).text().split("\n");

    if (lines.length > 1) {
      from = lines[0];
      destinations[from] = {};
    } else {
      var links = $(this).find("a");
      var cityName = links[0].attribs.title;

      if (links.length < 2) {
        var airportName = links[0].attribs.title,
          airportUrl = links[0].attribs.href;

        destinations[from][cityName] = {
          airport: {
            name: airportName, //links.get(1).textContent,
            url: airportUrl
          }
        };
      } else {
        var cityUrl = links[0].attribs.href;

        airportName = links[1].attribs.title;
        airportUrl = links[1].attribs.href;

        destinations[from][cityName] = {
          city: {
            name: cityName, //links.get(0).textContent,
            url: cityUrl
          },
          airport: {
            name: airportName, //links.get(1).textContent,
            url: airportUrl
          }
        };
      }
    }
  });

  // console.log(JSON.stringify(destinations, null, 2));
  return destinations;
  // $(".mw-category li a").map(function () {
  //   return {
  //     name: $(this).text().replace(/ destinations$/, ""),
  //     destinationsLink: $(this).attr("href")
  //   };
  // }).get();
};
