"use strict";

module.exports = function ($) {
  var airportData = {
    "iata": "abj",
    "icao": "diap",
    "coordinates": {
      "lat": "5º15'41.1\"N",
      "lon": "003º55'32.8\"W"
    },
    "runway": {
      "direction": "03/21",
      "length": {
        "ft": 9842,
        "m": 3000
      },
      "surface": "macadam"
    }
  };

  $(".vcard tr").map(function () {
    // console.log($(this).text());
  });

  return airportData;
};
