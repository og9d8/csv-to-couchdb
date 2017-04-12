var fs = require('fs');
var readline = require('readline');
var stream = require('stream');

var instream = fs.createReadStream('./datasample.csv');
var outstream = new stream;
var rl = readline.createInterface(instream, outstream);

var startTime = Date.now();
var timeItTook = 0;
var linesParsed = 0;

rl.on('line', function(line) {
	//console.log("line is: " + line)
	linesParsed++;
});

rl.on('close', function() {
  	console.log("all done")
  	console.log("Lines parsed: " + linesParsed)
  	timeItTook = Date.now() - startTime;
  	console.log("start time: " + startTime)
  	console.log("time it took [seconds]: " + timeItTook/1000)
  	console.log("Time it would take to parse 1 milion lines [hours]: " + (1000000/1000/3600 * timeItTook/linesParsed))
});