SHELL = /bin/bash
MAKEFLAGS += --no-print-directory --silent
export PATH := ./node_modules/.bin:$(PATH):./bin
LINT_DIR = $(wildcard *.js src/*.js test/*.js scrapers/*.js spikes/*.js test/*/*.js scrapers/*/*.js spikes/*/*.js)
DIST_DIR= $(wildcard src/*.js)

# export NODE_ENV=production

default: setup test

setup:
	npm install

# lint
lint:
	echo "Linting started..."
	eslint $(LINT_DIR)
	echo "Linting finished without errors"

# local_pages update needed at least once before runing tests.
test/spec/local_pages/:
	mkdir test/spec/local_pages/
	cp test/fixtures/index.html $@

update-local-pages: test/spec/local_pages/
	DEBUG=aviation-scraper* node test/spec/update_local_pages.js

check-local-pages:
	test -d test/spec/local_pages/ && echo -e "\nLocal pages folder found, no need to update" || make update-local-pages

# test commands

test: lint check-local-pages
	test -f test/spec/local_pages/index.html && NODE_ENV=test mocha test || echo "Please run 'make update-local-pages' before tests"

dev:
	test -f test/spec/local_pages/index.html && NODE_ENV=test mocha test -w || echo "Please run 'make update-local-pages' before tests"

node-inspector:
	node-inspector

debug-test:
	test -f test/spec/local_pages/index.html && NODE_ENV=test mocha --debug-brk test || echo "Please run 'make update-local-pages' before tests"
# Coverage reporters

# For coveralls integration on Travis-ci
test-coveralls:
	npm install nyc
	nyc npm test && nyc report --reporter=text-lcov | coveralls

test-coverage-report:
	echo "Generating coverage report, please stand by"
	test -d node_modules/nyc/ || npm install nyc
	NODE_ENV=test nyc mocha && nyc report --reporter=html
	open coverage/index.html

test-coverage-windows:
	test -d node_modules/istanbul/ || npm install istanbul
	NODE_ENV=test istanbul cover ./node_modules/mocha/bin/_mocha
	start coverage\lcov-report\index.html

find-missing-coords:
	node utils/find_missing_coordinates.js

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
	echo "5. 'git merge master --no-ff --log'"
	echo "6. 'git tag tag-feature-wxyz feature-wxyz'"
	echo "6. 'git branch -d (release-x.x.x || hotfix-x.x.x)'"

clean:	clean-coverage
	test -d data/ && rm -r data/ && echo "data content removed" || echo "no data folder found"
	test -d tmp/ && rm -r tmp/ && echo "tmp content removed" || echo "no tmp folder found"
	echo "finished."

clean-local-pages:
	test -d test/spec/local_pages/ && rm -r test/spec/local_pages/ && echo "local pages removed" || echo "no local pages folder found"
	echo "finished."

clean-coverage:
	test -d coverage/ && rm -r coverage/ && echo "coverage content removed" || echo "no coverage folder found"
	test -d .nyc_output && rm -r .nyc_output && echo "nyc_output content removed" || echo "no nyc_output folder found"

# use the app.
airports:
	./aviation-scraper -l
	./aviation-scraper -a

destinations:
	./aviation-scraper -d

companies:
	./aviation-scraper -c

scraper: airports destinations companies

# Stats section
stats: stats-airlines stats-airports

stats-airlines:
	DEBUG=aviation-scraper* node ./utils/get_airlines_stats.js

stats-airports:
	DEBUG=aviation-scraper* node ./utils/get_airports_stats.js

.PHONY: test scraper
