"use strict";

module.exports = function ($) {
  var destinations = [];

  $(".mw-category li a").map(function () {
    var airline = {
      name: $(this).text().replace(/ destinations$/, ""),
      destinationsLink: $(this).attr("href")
    };

    destinations.push(airline);
  });
  return destinations;
};
