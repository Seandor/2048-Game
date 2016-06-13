/*
Lightweight testing class inspired by unittest from Pyunit
https://docs.python.org/2/library/unittest.html
Note that code is designed to be much simpler than unittest
and does NOT replicate unittest functionality

A clone of simpletest in Javascript.
*/

function TestSuite() {
	this.totalTests = 0;
	this.failures = 0;
}

// Compare computed and expected,
// if not equal print out computed, expected
TestSuite.prototype.runTest = function (computed, expected, message) {
	this.totalTests += 1;
	message = message || "";
	if (this.compare(computed, expected) === false) {
		var msg = message + ' Computed: ' + computed;
		msg += ' Expected: ' + expected;
		console.log(msg);
		this.failures += 1;
	}
};

// work only for arrays
TestSuite.prototype.compare = function (computed, expected) {
	if (typeof computed !== "object") {
		return computed === expected;
	}
	for (var i = 0; i < computed.length; i++) {
		if (computed[i] !== expected[i]) {
			return false;
		}
	}
	return true;
};

TestSuite.prototype.reportResults = function () {
	var msg = 'Ran ' + this.totalTests + ' tests. ';
	msg += this.failures + ' failures. ';
	console.log(msg);
};