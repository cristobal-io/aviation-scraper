"use strict";

module.exports = function ($) {

  var routesObject = {};

  $("#mw-content-text h2").map(function () {

    var from = $(this).find(".mw-headline").text();

    $(this).next(".wikitable").map(function () {
      var destinations = [];
      var $headers = $(this).find("th");
      var $tableContent = $(this).find("tr td");
      var row = [];

      for (var i = 0, j = 0, k = 0; i < $tableContent.length; i += 1, j += 1) {
        var textHeader = $($headers[j]).text();
        var textTableContent = $($tableContent[i]).text();

        if (row[k] === undefined) {
          row.push(k);
          row[k] = {};
        }
        row[k][textHeader] = (textTableContent);
        if (j > $headers.length - 2) {
          j = -1;
          k += 1;
        }
      }
      destinations.push(row);
      routesObject[from] = row;
      return destinations;
    });
  });
  return routesObject;
};
