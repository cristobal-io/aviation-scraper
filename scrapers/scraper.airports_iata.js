"use strict";

module.exports = function ($) {

  var airports = [];

  $(".wikitable").find("tr").map(function () {
    var link = $($(this).find("td")[2]).find("a").attr("href");

    // we are looking for airports with wikipedia page active.
    if (/(wiki)/.test(link)) {
      airports.push({
        "name": $($(this).find("td")[2]).text(),
        "url": link
      });
    }
  });

  return airports;
};

