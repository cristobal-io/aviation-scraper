"use strict";

module.exports = function ($) {
  var scraper = "default";

  if ($(".wikitable").hasClass("wikitable")) {
    scraper = "table";
  }
  return scraper;
};
