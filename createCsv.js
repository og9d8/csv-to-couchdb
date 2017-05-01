
const yargs = require('yargs');


const argv = yargs
		.options({
			l: {
				demand: true,
				alias: 'lines',
				describe: 'number of lines, default is 10',
				default: 10
			},
			n: {
				demand: false,
				alias: 'name',
				describe: 'location and name of file',
				default: "./datasample.csv"
			},
			k: {
				demand: false,
				alias: 'keys',
				describe: 'how many keys to include',
				default: 2
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

var keys = []
var keysHeader = "";
for (var i = 0; i < argv.keys; i++) {
	keys[i] = "key"+ (i+1)
	keysHeader = keysHeader + "|" + keys[i]
}


//write headers line
newFile.write("guid1" + "|guid2" + keysHeader   + '\n') // append string to your file

for (var i = 0; i < numOfLines; i++) {
	var values = "";
	for (var j = 0; j < argv.keys; j++) {
		values = values + "|" + randomstring.generate(4)
	}
	console.log(values)
	newFile.write(randomstring.generate(10) + "|" + "33eba759-7f77-4930-926c-472bd52b7497" + values +'\n') // append string to your file
}

newFile.end()
