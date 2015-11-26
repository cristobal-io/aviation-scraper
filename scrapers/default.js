"use strict";
var md = require("html-md");
var _ = require("lodash");

module.exports = function ($) {

  var makrdown = md($(".mw-content-ltr").html(), {
    inline: true
  });

  return getDestinations(makrdown);
  // console.log(html);

  // $(".mw-content-ltr ul li").each(function () {


  //   // the class name for the table of content changes, so we need 
  //   // a regex instead of css selector.
  //   if (/toclevel/.test($(this).attr("class"))) {
  //     return;
  //   }

  //   var lines = $(this).text().split("\n");

  //   if (lines.length > 1) {
  //     from = lines[0];
  //     destinations[from] = {};
  //   } else {
  //     var links = $(this).find("a");
  //     var cityName = links[0].attribs.title;

  //     if (links.length < 2) {
  //       var airportName = links[0].attribs.title,
  //         airportUrl = links[0].attribs.href;

  //       destinations[from][cityName] = {
  //         airport: {
  //           name: airportName, //links.get(1).textContent,
  //           url: airportUrl
  //         }
  //       };
  //     } else {
  //       var cityUrl = links[0].attribs.href;

  //       airportName = links[1].attribs.title;
  //       airportUrl = links[1].attribs.href;

  //       destinations[from][cityName] = {
  //         city: {
  //           name: cityName, //links.get(0).textContent,
  //           url: cityUrl
  //         },
  //         airport: {
  //           name: airportName, //links.get(1).textContent,
  //           url: airportUrl
  //         }
  //       };
  //     }
  //   }
  // });

  // console.log(JSON.stringify(destinations, null, 2));
  // return destinations;
};
var re = "\\[([^\\[]+)\\]\\(([^\\)]+)\\)";
var linksRe = new RegExp(re, "g");
var linksInfoRe = new RegExp(re);


function getLinkStrings(line) {
  return line.match(linksRe) || [];
}

function getLinkInfo(linkString) {
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

function getDestinations(makrdown) {
  return _.reduce(makrdown.split("\n"), function (destinations, line) {
    var destination = getDestination(line);

    if (destination) {
      destinations.push(destination);
    }
    return destinations;
  }, []);
}

module.exports.getDestination = getDestination;
module.exports.getDestinations = getDestinations;
