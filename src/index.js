"use strict";

module.exports = {
  "getRoutes": require("./airline_routes.js").getRoutes,
  "getAllRoutes": require("./airline_routes.js").getAllRoutes,
  "getScraperType" : require("./airline_scraper.js").getScraperType,
  "getScraperTypeForAll" : require("./airline_scraper.js").getScraperTypeForAll,
  "getAllDestinations" : require("./airline_destinations.js").getAllDestinations,
  "getDestinations" : require("./airline_destinations.js").getDestinations
};
