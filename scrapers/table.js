"use strict";

module.exports = function ($) {

  var row = [];

  $(".sortable").map(function () {

    var $headers = $(this).find("th");
    var $rowtable = $(this).find("tr");
    var defaultName = "", defaultLink = "";
    var sharedAirport = 0, numberMissingCells = 0;

    for (var l = 1; l < $rowtable.length; l += 1) {
      var $rowTableContent = $($rowtable[l]).find("td");

      for (var m = 0, lenghtRow = $rowTableContent.length; m < lenghtRow ; m += 1) {
        var textHeader = $($headers[m]).text().toLowerCase();
        var textTableContent = $($rowTableContent[m]).text() || defaultName;
        var linkTableContent = $($rowTableContent[m]).find("a[href^='/']").attr("href") || defaultLink;

        if (textHeader === "destination") {
          textHeader = "city";
        }

        if($($rowTableContent[m]).attr("rowspan")){
          numberMissingCells +=1;
        }

        if (textHeader === "airport" || textHeader === "city") {

          if (sharedAirport > 1 && textHeader === "city") {
            lenghtRow = $rowTableContent.length + numberMissingCells;
            sharedAirport -=1;
          } else if (sharedAirport === 1){
            // cleaning the default values and counters to avoid side-effects.
            defaultName = "", defaultLink = "";
            sharedAirport = 0, numberMissingCells = 0;
          }

          if($($rowTableContent[m]).attr("rowspan")){
            defaultName = textTableContent;
            defaultLink = linkTableContent;
            sharedAirport = $($rowTableContent[m]).attr("rowspan");
          }

          var rowNumber = l-1;

          if (row[rowNumber] === undefined) {
            row.push(rowNumber);
            row[rowNumber] = {};
          }
          row[rowNumber][textHeader] = {
            "name": textTableContent,
            // bermi: here for some citys without links its nor adding the url, so
            // I make it optional instead of required at the schema.
            // do you think it is ok?
            "url": linkTableContent
          };
        }

      }

    }

  });

  return row;
};
