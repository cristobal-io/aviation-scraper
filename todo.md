# IMPORTANT

- I am worried about the integrity of the default values returned. Example:
  + apply the default scraper to Air_Austral, the returned value is valid but it is not in reality.
- The table_center and the table_toccolours have risk of letting city without link outside the results with the error.
- updated to lodash v4 break the code and everything.

# ISSUES

- the default scraper doesn't get the links of the cities if they don't have link.

# Engineering Tasks

* Download all the airports, they have to include:
  + ICAO
  + IATA
  + RWY 36/18
  + RWY length.
  + COORD
  + freq if available?
- Downland all the destinations
  + make all the scrapers meet the default schema. (only 13 errors now)

# Current Taks
* saving airports name and links into a single file (from returned value)
- save airports name and links from files into data folder
  + we can use fs.readdir to get the names and then require them.
  + ¿How can we combine into one var all the file content of routes?
- scrape icao and iata codes of airports
- scrape coordinates
- scrape rwy number, lenght and type.
- freq?

# TODO

- require all the files inside data that have the "routes" prefix 
- add comments to all the code to explain why I am doing everything.
- Uncomment type of scraper test
- eliminate should be a function basic test
- rename files, we are not getting routes, we are getting destinations
- Add a check so the destinations on routes are not duplicated.
- Eliminate Scraper fase and join it with the routes to avoid extra connections.
- cleanup makefile for the NODE_ENV=test variable that thanks to debug package we are not using anymore.
- incorporate again default variant if needed or erase the default variant scraper
  +  {
  "name": "default_variant",
  "destinationsLink": "/Air_Nippon_destinations",
  "url": "http://localhost:3000/Air_Nippon_destinations.html",
  "destinationsFile": "./test/spec/Air_Nippon_destinations.json",
  "scraper": "default_variant"
},

- ~~use node-progress to show a bar and only display on screen the errors.~~

# Next Features


