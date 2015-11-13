SHELL = /bin/bash
MAKEFLAGS += --no-print-directory --silent
export PATH := ./node_modules/.bin:$(PATH):./bin
LINT_DIR = $(wildcard *.js test/*.js scrapers/*.js test/**/*.json)

setup:
	npm install

lint:
	echo "Linting started..."
	eslint $(LINT_DIR)
	echo "Linting finished without errors"

destinations: lint
	echo "Generating file for airlines destinations"
	node airline_destinations.js

routes: lint
	echo "Retrieving routes"
	node airline_routes.js

scrapers: lint
	echo "Setting up scrapers for each type of page..."
	node airline_scraper.js

clean:
	test -d data/ && rm -r data/* && echo "data content removed" || echo "no data folder found"
	cp data_backup/destination_pages.json data/
	echo "finished."