#!/bin/bash

MOCHA=/usr/local/bin/mocha
ISTANBUL=/usr/local/bin/istanbul

# test files must end with ".test.js"
TESTS=$(shell find test/ -name "*.test.js")

coverage:
	# check if reports folder exists, if not create it
	@test -d reports || mkdir reports
	$(ISTANBUL) instrument --output lib-cov lib
	# move original lib code and replace it by the instrumented one
	mv lib lib-orig && mv lib-cov lib
	# tell istanbul to only generate the lcov file
	ISTANBUL_REPORTERS=lcovonly $(MOCHA) -R mocha-istanbul $(TESTS)
	# place the lcov report in the report folder,
	# remove instrumented code and put back lib at its place
	mv lcov.info reports/
	rm -rf lib
	mv lib-orig lib
	genhtml reports/lcov.info --output-directory reports/

clean:
	rm -rf reports

test:
	$(MOCHA) -R spec $(TESTS)
