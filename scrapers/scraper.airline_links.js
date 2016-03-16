"use strict";
var _ = require("lodash");

module.exports = function ($) {
  var airline = [];

  $("table.sortable").find("tr").map(function () {
    var $airline = $(this).find("td"),
      airlineData = {
        IATA : $($airline[0]).text(),
        ICAO : $($airline[1]).text(),
        airline:{
          name : $($airline[2]).text(),
          link : $($airline[2]).find("a").attr("href")
        },
        CallSign : $($airline[3]).text(),
        Country : $($airline[4]).text()
        
      };

    if (!/wiki/.test(airlineData.airline.link)) {
      airlineData.airline.link = "";
    }
    airlineData.airline = dropFalseValues(airlineData.airline);
    airlineData = dropFalseValues(airlineData);

    if (Object.keys(airlineData).length) {
      airline.push(airlineData);
    }
  });
  return airline;
};

function dropFalseValues (obj) {
  var result = _.reduce(obj, function(result, value, key) {
    if (value) {
      result[key] = value;
    }
    return result;
  }, {});

  return _.size(result) ? result : false;
}
