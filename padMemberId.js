
var env = process.env.NODE_ENV || 'local';
var config = require('../config')[env];
var jsonQuery = require('json-query')

 
var fs = require('fs');
var readline = require('readline');
var stream = require('stream');
var linesParsed = 0;
var startTime = Date.now()
var pad = require('pad-left');
// pad(  '4', 4, '0') // 0004
// pad( '35', 4, '0') // 0035
// pad('459', 4, '0') // 0459


function HowToPad(lpid){
if (lpid == "33eba759-7f77-4930-926c-472bd52b7497" )      //FB
  return 12
else if (lpid == "22d99b9a-c0ef-4aba-8667-4e41b2c1dbdb" ) //Hilton
  return 9
else if (lpid == "83836c7c-40d9-4995-941d-d8093efbc392" ) // Alitalia
  return 10
else if (lpid == "e1a57783-0796-45c3-b388-a77cb38748c5" ) //
  return 11
else
  return 0

}

// var lpInstructions = {
//   lps: [
//     {name: 'FlyingBlue',      totalDigits: 12,  'lpid': "33eba759-7f77-4930-926c-472bd52b7497"},
//     {name: 'Hilton',          totalDigits: 9,   'lpid': "22d99b9a-c0ef-4aba-8667-4e41b2c1dbdb"},
//     {name: 'Alitalia',        totalDigits: 10,  'lpid': "83836c7c-40d9-4995-941d-d8093efbc392"},
//     {name: 'Virgin Atlantic', totalDigits: 11,  'lpid': "e1a57783-0796-45c3-b388-a77cb38748c5"}

//   ]
// }
 



/////////////
///// line by line 
var inputFile = './1Mlines_Flyingblue.csv'

console.log("Note: I assume that every csv line is: <memberId>, <lpid>, {some data}")
var LineByLineReader = require('line-by-line'),
    lr = new LineByLineReader(inputFile);

var newFile = fs.createWriteStream(inputFile + ".output.csv", {  flags: 'a'   })
var logFile = fs.createWriteStream(inputFile + ".log.txt", {  flags: 'a'   })
logFile.write("/////////// Starting over ///////////\n")

lr.on('error', function (err) {
});

lr.on('line', function (line) {
  linesParsed++;
  
  lr.pause();
  if (linesParsed%100000==0) {logFile.write("Lines parsed so far: " + linesParsed + ". seconds so far: " + (Date.now()-startTime)/1000 + '\n')}


  //////////////////write to file

   //parse line
  var choppedLine = line.split(',');  
  var currentLpid = choppedLine[1].trim();
  var memberId = pad(choppedLine[0].trim(), HowToPad(currentLpid), '0')
  var newLine = memberId + "," + currentLpid + "," + choppedLine[2].trim() ;
  newFile.write(newLine + '\n'); // append string to your file
  lr.resume();
})



lr.on('end', function () {
  // All lines are read, file is closed now.
  newFile.end()

  console.log("I'm done here")
  console.log("lines parsed: " + linesParsed)
  timeItTook = Date.now() - startTime;
  console.log("time it took [seconds]: " + timeItTook/1000)
  logFile.write("lines parsed: " + linesParsed + "\n")
  logFile.write("time it took [seconds]: " + timeItTook/1000 + '\n')

  logFile.end();

});



