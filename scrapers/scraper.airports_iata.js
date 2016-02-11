"use strict";

module.exports = function ($) {

  var airports = [];

  $(".wikitable").find("tr").map(function () {
    if (!($($(this).find("td")[2]).find("a").hasClass("new")) &&
      $($(this).find("td")[2]).text() &&
      /(wiki)/.test($($(this).find("td")[2]).find("a").attr("href"))) {
      airports.push({
        "name": $($(this).find("td")[2]).text(),
        "url": $($(this).find("td")[2]).find("a").attr("href")
      });
    }
  });

  return airports;
};
