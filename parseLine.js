const csv = require('csv-streamify')
const fs = require('fs')
 
const parser = csv()
 
// emits each line as a buffer or as a string representing an array of fields 
parser.on('data', function (line) {
  console.log(line)
})
 
// now pipe some data into it 
fs.createReadStream('./datasample.csv').pipe(parser)