"use strict";

module.exports = function ($) {
  var destinations = [];

  $("#toc").find("a").map(function () {
    destinations.push("https:" + $(this).attr("href"));
  });
  destinations.shift();
  return destinations;
};
