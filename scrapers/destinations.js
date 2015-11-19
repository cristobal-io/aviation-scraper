"use strict";

module.exports = function ($) {
  $(".mw-category li a").map(function () {
    return {
      name: $(this).text().replace(/ destinations$/, ""),
      destinationsLink: $(this).attr("href")
    };
  });
};
