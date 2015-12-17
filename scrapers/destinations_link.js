"use strict";

module.exports = function ($) {
  var destinations = [];

  $("#toc").find("a").map(function () {
    var destinationLink = $(this).attr("href");

    destinations.push(destinationLink);
  });
  destinations.shift();
  return destinations;
};
