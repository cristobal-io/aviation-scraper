SHELL = /bin/bash
MAKEFLAGS += --no-print-directory --silent
export PATH := ./node_modules/.bin:$(PATH):./bin
LINT_DIR = $(wildcard *.js src/*.js test/*.js scrapers/*.js spikes/*.js test/*/*.js scrapers/*/*.js spikes/*/*.js)
export NODE_ENV=production

default: setup test

setup:
	npm install

lint:
	echo "Linting started..."
	eslint $(LINT_DIR)
	echo "Linting finished without errors"

destinations: data/destination_pages.json

data/destination_pages.json:
	echo "Generating file for airlines destinations"
	node src/airline_destinations.js

routes:
	echo "Retrieving routes"
	node src/airline_routes.js

scrapers:
	echo "Setting up scrapers for each type of page..."
	node src/airline_scraper.js

# test commands

update-models:
	node test/spec/models_update.js

test: lint
	NODE_ENV=test mocha test

dev:
	NODE_ENV=test mocha test -w

# Coverage reporters

test-coveralls:
	test -d node_modules/nyc/ || npm install nyc
	nyc mocha && nyc report --reporter=text-lcov | coveralls

test-coverage-report:
	echo "Generating coverage report, please stand by"
	test -d node_modules/nyc/ || npm install nyc
	nyc mocha && nyc report --reporter=html

test-coverage-windows:
	test -d node_modules/istanbul/ || npm install istanbul
	node_modules\.bin\istanbul cover node_modules\mocha\bin\_mocha
	start coverage\lcov-report\index.html


clean-coverage:
	rm -r coverage
	rm -r .nyc_output

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
	cp spikes/data_backup/destination_pages.json data/
	echo "finished."

.PHONY: data/destination_pages.json test scrapers