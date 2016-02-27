# Aviation Scraper
 
This project is going to be composed of few packages that are
going to be scraping from wikipedia the following information:

- World Airports
- World Airlines
- World destinations

This is intended for use of an updated database of information for a map application.

## Testing

Before testing this application you have to run `make update-local-pages`

Then run tests with `make test`

## Usage 

### From the CLI

`aviation-data -h`

displays this help:

```
Retrieve airlines destinations and airports data.

Options:
  -l List of airports with the link to the wikipedia page. (Saved to a single file)
  -d Destinations of all the airlines listed on the wikipedia. (saved each airline with an individual JSON file)
  -a Saves the important data for each airport (saved in a single JSON file for each airport)
```

## Roadmap
- enable with the command to display the information for the desired airport
```
$ aviation-data -s levc

{
  "coordinates": {
    "latitude": "39°29′22″N",
    "longitude": "00°28′54″W"
  },
  "runway": [
    {
      "Direction": "12/30",
      "m": "3,215",
      "ft": "10,548",
      "Surface": "Asphalt"
    }
  ],
  "iata": "VLC",
  "icao": "LEVC",
  "url": "https://en.wikipedia.org/wiki/Valencia_Airport",
  "fileName": "./data/airport_Valencia_Airport.json"
}
```

## Contribute

if you wish to contibute create your branch and create a pull request or you can create an issue.
