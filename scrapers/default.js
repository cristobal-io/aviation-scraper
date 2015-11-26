"use strict";
var md = require("html-md");
var _ = require("lodash");

module.exports = function ($) {

  var makrdown = md($(".mw-content-ltr").html(), {
    inline: true
  });

  return getDestinations(makrdown);
};

var re = "\\[([^\\[]+)\\]\\(([^\\)]+)\\)";


function getLinkStrings(line) {
  var linksRe = new RegExp(re, "g");

  return line.match(linksRe) || [];
}

function getLinkInfo(linkString) {
  console.log(linkString);
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
module.exports.hasValidLinks = hasValidLinks;
module.exports.getLinkInfo = getLinkInfo;
module.exports.getLinkStrings = getLinkStrings;
