var fs = require('fs')
var randomstring = require("randomstring");
var numOfLines = 100;

var newFile = fs.createWriteStream('./datasample2.csv', {
  flags: 'a' // 'a' means appending (old data will be preserved)
})

for (var i = 0; i <= numOfLines; i++) {
	//console.log(i)
	numToWrite1 = randomstring.generate(10);
	numToWrite2 = randomstring.generate(10);
	//console.log(numToWrite)
	newFile.write(numToWrite1 + ", " + numToWrite2 + ', {some data}\n') // append string to your file
}

newFile.end()
//setTimeout(()=> {newFile.end()}, 3000)
