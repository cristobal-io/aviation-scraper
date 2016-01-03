SHELL = /bin/bash
MAKEFLAGS += --no-print-directory --silent
export PATH := ./node_modules/.bin:$(PATH):./bin
LINT_DIR = $(wildcard *.js src/*.js test/*.js scrapers/*.js spikes/*.js test/*/*.js scrapers/*/*.js spikes/*/*.js)
# export NODE_ENV=production

default: setup test

setup:
	npm install

lint:
	echo "Linting started..."
	eslint $(LINT_DIR)
	echo "Linting finished without errors"

data:
	DEBUG=airlineData* node src/cli.js

# Models update needed at least once before runing tests.
test/spec/models/:
	mkdir test/spec/models/
	cp test/fixtures/index.html $@

update-models: test/spec/models/
	node test/spec/models_update.js

# test commands

# todo: create some sort of registry that advises when running our test that our files are too old
# maybe we can use "tldr find"
test: lint
	test -f test/spec/models/index.html && NODE_ENV=test mocha test || echo "Please run 'make update-models' before tests"

dev:
	test -f test/spec/models/index.html && NODE_ENV=test mocha test -w || echo "Please run 'make update-models' before tests"

# Coverage reporters

test-coveralls:
	test -d node_modules/nyc/ || npm install nyc
	nyc mocha && nyc report --reporter=text-lcov | coveralls

test-coverage-report:
	echo "Generating coverage report, please stand by"
	test -d node_modules/nyc/ || npm install nyc
	NODE_ENV=test nyc mocha && nyc report --reporter=html
	open coverage/index.html

test-coverage-windows:
	test -d node_modules/istanbul/ || npm install istanbul
	NODE_ENV=test istanbul cover ./node_modules/mocha/bin/_mocha
	start coverage\lcov-report\index.html


clean-coverage:
	test -d coverage/ && rm -r coverage/ && echo "coverage content removed" || echo "no coverage folder found"
	test -d .nyc_output && rm -r .nyc_output && echo "nyc_output content removed" || echo "no nyc_output folder found"


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

clean:	clean-coverage
	test -d data/ && rm -r data/ && echo "data content removed" || echo "no data folder found"
	echo "finished."

.PHONY: test scrapers