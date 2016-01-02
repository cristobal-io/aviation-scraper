"use strict";

module.exports = function ($) {

  var row = [];

  $(".toccolours").map(function () {

    var $headers = $(this).find("th");
    var $rowtable = $(this).find("tr");

    for (var l = 1; l < $rowtable.length; l += 1) {
      var $rowTableContent = $($rowtable[l]).find("td");

      for (var m = 0; m < $rowTableContent.length; m += 1) {
        var textHeader = $($headers[m]).text().toLowerCase();
        var textTableContent = $($rowTableContent[m]).text();
        var linkTableContent = $($rowTableContent[m]).find("a[href^='/']").attr("href");

        if (textHeader === "airport" || textHeader === "city") {
          var rowNumber = l-1;

          if (row[rowNumber] === undefined) {
            row.push(rowNumber);
            row[rowNumber] = {};
          }
          row[rowNumber][textHeader] = {
            "name": (textTableContent),
            "url": (linkTableContent)
          };
        }

      }

    }
  });

  return row;
};
