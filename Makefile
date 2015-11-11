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
