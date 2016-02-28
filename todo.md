# IMPORTANT

- I am worried about the integrity of the default values returned. Example:
  + apply the default scraper to Air_Austral, the returned value is valid but it is not in reality.
- The table_center and the table_toccolours have risk of letting city without link outside the results with the error.
- updated to lodash v4 break the code and everything.

# ISSUES

- the default scraper doesn't get the links of the cities if they don't have link.

---

# Engineering Tasks

* get all the airlines data.
- Downland all the destinations
  + make all the scrapers meet the default schema. (only 13 errors now)

# Current Taks
* update the test so it uses the localhost page
- create the automatic calling for all the airports passed that uses the previously created function.


---

# TODO

- refactor airline schema
- refactor getxxxxdata functions to use a general function with a callback that subsitutes sjs.StaticScraper.create(url).
- unify get gefilename methods. 
- check that all the IATA airports are saved into individual files.
  + we can check the number of airports at the list and how many files meet the criteria.
- save airports name and links from files into data folder
  + we can use fs.readdir to get the names and then require them.
  + ¿How can we combine into one var all the file content of destinations?
- check special cases:
  + { 
    "name": "Air Nippon",
    "destinationsLink": "/wiki/Air_Nippon_destinations",
    "scraper": "default"
    }
  + {
    "name": "Air Chathams",
    "destinationsLink": "/wiki/Air_Chathams_destinations",
    "scraper": "table"
    },
- add special case were the airports scraper were frozen because of no headers.
- require all the files inside data that have the "destinations" prefix 
- add comments to all the code to explain why I am doing everything.
- Eliminate Scraper fase and join it with the destinations to avoid extra connections.
- cleanup makefile for the NODE_ENV=test variable that thanks to debug package we are not using anymore.

# Next Features

# Publish

- incorporate badges when publish
- contribute guide
- travis

# Naming

- airlinedata.io
- airdata.io
- aviationdata.io

# Notes:

- A good way to set the defaults for test would be `var BASE_URL = process.env.NODE_ENV === "test" ? "local..." : "wikipedia";`

