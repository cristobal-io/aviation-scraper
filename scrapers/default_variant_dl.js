"use strict";

module.exports = function ($) {
  var destinations = {};
  // var from;

  $(".mw-content-ltr h2").map(function () {
    // var to = $(this).next("ul").text().split("\n");

    if ((/Content/.test($(this).text())) ||
      (/External/.test($(this).text())) ||
      (/Terminate/.test($(this).text())) ||
      (/Referenc/.test($(this).text()))) {
      return;
    }
    var from = $(this).find(".mw-headline").text();

    destinations[from] = {};

    var origin = $(this).next("p").find("a").text();

    destinations[from][origin] = {};

    var links = $(this).next("p").next("ul").find("a");

    // var cityUrl, airportName, airportUrl;

    var cityName = links[0].attribs.title;

    if (links.length < 2) {

      var cityUrl = links[0].attribs.href,
        airportName = links[1].attribs.title,
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
    } else {
      for (var i = 0; i < links.length; i += 2) {
        if (links[i].attribs.title === undefined) {
          i += 1;
        }

        cityName = links[i].attribs.title;
        cityUrl = links[i].attribs.href;

        airportName = links[i + 1].attribs.title;
        airportUrl = links[i + 1].attribs.href;

        destinations[from][origin][cityName] = {
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
  console.log(JSON.stringify(destinations, null, 2));
  return destinations;
};
