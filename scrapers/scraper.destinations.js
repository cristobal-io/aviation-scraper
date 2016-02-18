"use strict";

module.exports = function ($) {
  var destinations = [];

  $(".mw-category li a").map(function () {
    destinations.push({
      name: $(this).text().replace(/ destinations$/, ""),
      destinationsLink: $(this).attr("href")
    });
  });
  return destinations;
};
