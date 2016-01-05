"use strict";
var md = require("html-md");
var _ = require("lodash");
var re = "\\[([^\\[]+)\\]\\(([^\\)]+)\\)";

module.exports = function ($) {

  var options = {};
  var row = [];
  var markdown = md($("center .wikitable").html(), {
    inline: true
  });
  var markdownSplit = markdown.split("\n\n");
  var $headers = $("center .wikitable").find("tr").first().find("th");

  options.rowHeaders = [];
  generateHeaders($headers, options, $);

  var destinationsMarkdown = _.reduce(markdownSplit, function (destinations, block) {
    var lines = block.split("\n");
    var linksRe = new RegExp(re);

    if (lines.length === options.rowHeaders.length) {
      _.map(lines, function (line) {
        if (/#/.test(line)) {
          return;
        }
        if (linksRe.test(line)) {
          destinations.push(line);
        }
        getLinkStrings(line);
      });
    }
    return destinations;
  }, []);
  console.log("destinationsMarkdown: %o",destinationsMarkdown);
  // possible use match method stringmd.match(\[(\w*\s*\w*)*\])
  // $("center .wikitable").map(function () {

  //   var $headers = $(this).find("th");
  //   var $rowtable = $(this).find("tr");
  //   var options = {
  //     "defaultName": "",
  //     "defaultLink": "",
  //     "sharedAirport": 0,
  //     "numberMissingCells": 0,
  //     "rowSpanAttribute": 0,
  //     "lenghtRow": 0
  //   };

  //   for (var l = 1; l < $rowtable.length; l += 1) {
  //     var $rowTableContent = $($rowtable[l]).find("td");

  //     options.lenghtRow = $rowTableContent.length;
  //     if (options.lenghtRow < 2) {continue;}
  //     for (var m = 0; m < options.lenghtRow; m += 1) {
  //       options.textHeader = $($headers[m]).text().toLowerCase();

  //       options.textTableContent = $($rowTableContent[m]).text() || options.defaultName;
  //       options.linkTableContent = $($rowTableContent[m]).find("a[href^='/']").attr("href") || options.defaultLink;

  //       options.textHeader = filterTextHeader(options);
  //       options.rowSpanAttribute = $($rowTableContent[m]).attr("rowspan");

  //       options.rowNumber = row.length;

  //       checkRowSpan(options);

  //       addAirport(options, row);
  //     }
  //   }
  // });
  return row;
};
function getLinkStrings(line) {
  var linksRe = new RegExp(re, "g");

  return line.match(linksRe) || [];
}

function generateHeaders(headers, options, $) {
  headers.each(function (index, value) {
    options.rowHeaders.push($(value).text());
    if ($(value).attr("colspan")) {
      options.rowHeaders.push($(value).text());
    }
  });
  return options;
}

function getLinkInfo(linkString) {
  var linksInfoRe = new RegExp(re);
  var info = linkString.match(linksInfoRe) || [];

  if (info[2]) {
    info[2] = info[2].substring(0, info[2].indexOf(" "));
  }

  return info;
}

function hasValidLinks(links) {
  return links.length === 2 && links[0][1] && links[0][2] && links[1][1] && links[1][2];
}

function getDestination(line) {
  var links = getLinkStrings(line).map(getLinkInfo);

  if (hasValidLinks(links)) {
    return {
      city: {
        name: links[0][1],
        url: links[0][2]
      },
      airport: {
        name: links[1][1],
        url: links[1][2]
      }
    };
  }
}

function filterTextHeader(options) {
  options.textTableContent = options.textHeader.toLowerCase();
  if (/destination/.test(options.textHeader)) {
    return "city";
  } else if (/city/.test(options.textHeader)) {
    return "city";
  } else if (/airport/.test(options.textHeader)) {
    return "airport";
  } else if (/airport/.test(options.textTableContent)) {
    return "airport";
  } else {
    return options.textHeader;
  }
}

function checkRowSpan(options) {
  if (options.rowSpanAttribute) {
    options.numberMissingCells += 1;
  }
  return options;
}

function addAirport(options, row) {
  if (options.textHeader === "airport" || options.textHeader === "city") {
    addMissingHeader(options);
    assignDefaultValues(options);

    assignRow(row, options);
  }
}

function addMissingHeader(options) {
  if (options.sharedAirport > 1 && options.textHeader === "city") {
    options.lenghtRow = options.lenghtRow + options.numberMissingCells;
    options.sharedAirport -= 1;
  } else if (options.sharedAirport === 1) {
    // cleaning the default values and counters to avoid side-effects.
    options.defaultName = "", options.defaultLink = "";
    options.sharedAirport = 0, options.numberMissingCells = 0;
  }
  return options;
}

function assignDefaultValues(options) {
  if (options.rowSpanAttribute) {
    options.defaultName = options.textTableContent;
    options.defaultLink = options.linkTableContent;
    options.sharedAirport = options.rowSpanAttribute;
  }
  return options;
}

function assignRow(row, options) {
  if (row[options.rowNumber] === undefined) {
    row.push(options.rowNumber);
    row[options.rowNumber] = {};
  }
  row[options.rowNumber][options.textHeader] = {
    "name": options.textTableContent,
    "url": options.linkTableContent
  };
  return row;
}
