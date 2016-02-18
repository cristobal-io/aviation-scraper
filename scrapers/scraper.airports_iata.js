"use strict";

module.exports = function ($) {

  var airports = [];

  $(".wikitable").find("tr").map(function () {
    // we are looking for airports with wikipedia page active.
    if (/(wiki)/.test($($(this).find("td")[2]).find("a").attr("href"))) {
      airports.push({
        "name": $($(this).find("td")[2]).text(),
        "url": $($(this).find("td")[2]).find("a").attr("href")
      });
    }
  });

  return airports;
};

