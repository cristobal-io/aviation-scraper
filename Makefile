SHELL = /bin/bash
MAKEFLAGS += --no-print-directory --silent
export PATH := ./node_modules/.bin:$(PATH):./bin
LINT_DIR = $(wildcard *.js test/*.js scrapers/*.js)

setup:
	npm install

lint:
	echo "Linting started..."
	eslint $(LINT_DIR)
	echo "Linting finished without errors"

destinations: data/destination_pages.json

data/destination_pages.json:
	echo "Generating file for airlines destinations"
	node airline_destinations.js

routes:
	echo "Retrieving routes"
	node airline_routes.js

scrapers: lint
	echo "Setting up scrapers for each type of page..."
	node airline_scraper.js

test: lint
	mocha test

dev:
	mocha test -w

# Continuous Integration Test Runner
ci: lint test
	echo "1. 'make clean'"
	echo "2. Make sure 'git status' is clean."
	echo "3. 'git checkout -b (release-x.x.x || hotfix-x.x.x) master"
	echo "4. 'git merge dev --no-ff --log'"
	echo "5. 'Make release'"

release: lint
	echo "1. 'git checkout master'"
	echo "2. 'git merge (release-x.x.x || hotfix-x.x.x) --no-ff --log'"
	echo "3. 'release-it'"
	echo "4. 'git checkout dev'"
	echo "5. 'git merge (release-x.x.x || hotfix-x.x.x) --no-ff --log'"
	echo "6. 'git tag tag-feature-wxyz feature-wxyz'"
	echo "6. 'git branch -d (release-x.x.x || hotfix-x.x.x)'"

clean:
	test -f data/destination_pages.json && rm -r data/* && echo "data content removed" || echo "no data folder found"
	test -d data/ && echo "data folder exists" || mkdir data || echo "data folder created"
	cp data_backup/destination_pages.json data/
	echo "finished."

.PHONY: data/destination_pages.json test