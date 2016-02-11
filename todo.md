# IMPORTANT

- I am worried about the integrity of the default values returned. Example:
  + apply the default scraper to Air_Austral, the returned value is valid but it is not in reality.
- The table_center and the table_toccolours have risk of letting city without link outside the results with the error.
- updated to lodash v4 break the code and everything.

# ISSUES

- the default scraper doesn't get the links of the cities if they don't have link.

# Engineering Tasks

* Save all the airports in individual files.
- Downland all the destinations
  + make all the scrapers meet the default schema. (only 13 errors now)

# Current Taks
* fixing undefined link for airport.
* test airports_iata (not tested) I should have done it TDD like airports.js
- check the integrity AJV of the file saves, there are some empty values that give errors. I can add that at the scraper for the airports_iata.
- give alternative to save the airport data with iata or icao code, some of them doesn't have available one of those indicators. Maybe we should save it with the name that is accesible and all of them have it.
- check that all the IATA airports are saved into individual files.
  + we can check the number of airports at the list and how many files meet the criteria.
- save airports name and links from files into data folder
  + we can use fs.readdir to get the names and then require them.
  + ¿How can we combine into one var all the file content of routes?
- add validation to saving process like the routes or error we have for destinations.
- geting out of memory
```
<--- Last few GCs --->

  516813 ms: Scavenge 1390.8 (1456.4) -> 1390.8 (1456.4) MB, 0.8 / 0 ms (+ 3.3 ms in 1 steps since last GC) [allocation failure] [incremental marking delaying mark-sweep].
  517642 ms: Mark-sweep 1390.8 (1456.4) -> 1332.9 (1456.4) MB, 828.7 / 0 ms (+ 4.5 ms in 2 steps since start of marking, biggest step 3.3 ms) [last resort gc].
  518779 ms: Mark-sweep 1332.9 (1456.4) -> 1332.9 (1456.4) MB, 1136.4 / 0 ms [last resort gc].


  <--- JS stacktrace --->
  
  ==== JS stack trace =========================================
  
  Security context: 0x2a69e0244a49 <JS Object>
      1: /* anonymous */ [/Users/cristobalgomezmoreno/Code/scraper-aviation/  scrapers/scraper.airports.js:~3] [pc=0x9d41e223603] (this=0x2a69e0204111 <  null>,$=0x25cf4cf1149 <JS Function initialize (SharedFunctionInfo   0x122b57b70ea9)>)
      3: scrape [/Users/cristobalgomezmoreno/Code/scraper-aviation/node_modules/  scraperjs/src/StaticScraper.js:50] [pc=0x9d41e2cbb51] (this=0x25cf4cf11d9 < JS Object>,s...
  
  FATAL ERROR: CALL_AND_RETRY_LAST Allocation failed - process out of memory
  make: *** [data] Abort trap: 6
```


# TODO
- unify get filename methods. 
- incorporate the package [commander](https://github.com/tj/commander.js)
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


