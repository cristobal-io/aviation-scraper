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

  markdownSplit.shift();
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
      });
    }
    return destinations;
  }, []);


  for (var i = 0; i < destinationsMarkdown.length; i += 2) {
    var city = destinationsMarkdown[i].split("\(");
    var cityName = city[0].slice(1, city[0].length - 1);
    var cityLink = city[1].split(",");

    cityLink = cityLink[0].split(" ");
    cityLink = cityLink[0];

    var airport = destinationsMarkdown[i+1].split("\(");
    var airportName = airport[0].slice(1, airport[0].length - 1);
    var airportLink = airport[1].split(",");

    airportLink = airportLink[0].split(" ");
    airportLink = airportLink[0];

    row.push({
      city: {name: cityName, url: cityLink},
      airport: {name: airportName, url: airportLink}
    });

  }

  return row;
};

function generateHeaders(headers, options, $) {
  headers.each(function (index, value) {
    options.rowHeaders.push($(value).text());
    if ($(value).attr("colspan")) {
      options.rowHeaders.push($(value).text());
    }
  });
  return options;
}
