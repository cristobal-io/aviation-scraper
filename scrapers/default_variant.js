"use strict";

module.exports = function ($) {
  var destinations = {};
  // var from;

  $(".mw-content-ltr h3").map(function () {
    // var to = $(this).next("ul").text().split("\n");

    var from = $(this).find(".mw-headline").text();

    destinations[from] = {};

    var links = $(this).next("ul").find("a");


    // console.log(JSON.stringify(from.text(), null, 2));
    // console.log(JSON.stringify(to, null, 2));
    // console.log(JSON.stringify(links, null, 2));


    if (/toclevel/.test($(this).attr("class"))) {
      return;
    }


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
      for (var i = 0; i < links.length; i+=2) {
        cityName = links[i].attribs.title;
        cityUrl = links[i].attribs.href;

        airportName = links[i+1].attribs.title;
        airportUrl = links[i+1].attribs.href;

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
};
