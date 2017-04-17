
const yargs = require('yargs');


const argv = yargs
		.options({
			l: {
				demand: true,
				alias: 'lines',
				describe: 'number of lines'
			},
			n: {
				demand: false,
				alias: 'name',
				describe: 'location and name of file',
				default: "./datasample.csv"
			}
		})
		.help()
		.alias('help', 'h')
		.argv;




var fs = require('fs')
var randomstring = require("randomstring");
var numOfLines = argv.lines;


var newFile = fs.createWriteStream(argv.n, {
  flags: 'a' // 'a' means appending (old data will be preserved)
})

for (var i = 0; i < numOfLines; i++) {
	numToWrite1 = randomstring.generate(10);
	numToWrite2 = randomstring.generate(10);
	newFile.write(numToWrite1 + ", " + numToWrite2 + ', {"eligibility" : "' + randomstring.generate(10) + '"}\n') // append string to your file
}

newFile.end()
