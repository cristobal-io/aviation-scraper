# Aviation Scraper
 
This project is going to be composed of few packages that are
going to be scraping from wikipedia the following information:

- World Airports
- World Airlines
- World destinations

This is intended for use of an updated database of information for a map application.


## Testing

Before testing this application you have to run `make update-local-pages` to download a local copy of the html pages required for tests.

Then run tests with `make test`

## Usage 

### From the CLI

`aviation-scraper -h`

displays this help:

```
  Usage: aviation-scrapper [options]

  Retrieve airlines destinations and airports data.
  Multiple options are not allowed, only '-b' and '-s' options can be combined with the rest.

  Options:

  -h, --help            output usage information
  -V, --version         output the version number
  -l, --list            List of airports with the link to the wikipedia page. (Saved to a single file)
  -d, --destinations    Destinations of all the airlines listed on the wikipedia. (saved each airline with an individual JSON file)
  -a, --airports        Saves the important data for each airport (saved in a single JSON file and optional for each airport)
  -c, --companies       Saves all the airline links and all the important information for each airline.
  -b, --base <basedir>  the base directory where to save the files generated (default: tmp)
  -s, --save <save>     this options allows you to save individual files for each airline, airport or destination (default:false)
```


## Contribute

if you wish to contibute create your branch and create a pull request on the dev branch or you can create an issue.
