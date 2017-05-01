
var env = process.env.NODE_ENV || 'local';
var config = require('../config')[env];

var dbToUse = 'http://' + config.dbuser + ':' + config.dbpass + '@' + config.dburl + ':' + config.dbport

var nano = require('nano')(dbToUse);


var alice = nano.use('augmentedmv');
 
var fs = require('fs');
var readline = require('readline');
var stream = require('stream');
var parse = require('csv-parse');

var startTime = Date.now();
var timeItTook = 0;
var linesParsed = 0;
var docsCreated = 0;
var docsUpdated = 0;

var docRev = 0;
var docId = 'rabbit5';
var docAtHand = {}

var fileToRead = "./datasample.csv"

var keys = []


/////////////
///// line by line 
console.log("Note: I assume that every csv line is: <lpid>, <memberId>, value1, value2 ...")
var LineByLineReader = require('line-by-line'),
    lr = new LineByLineReader(fileToRead);
var logFile = fs.createWriteStream(fileToRead + '.log.txt', {  flags: 'a'   })

lr.on('error', function (err) {
  console.log(err)
});

lr.on('line', function (line) {
  linesParsed++;
  //show some movement in case it's long
  if (linesParsed%1000==0) {logFile.write("Lines parsed so far: " + linesParsed + ". seconds from last checkpoint: " + (Date.now()-startTime)/1000)}
  
  
  lr.pause();

   //parse lines
  var choppedLine = line.split('|')    


  docId = choppedLine[0].trim() + "_" + choppedLine[1].trim();

  //Header line
  if (linesParsed == 1){

    for (var i = 0; i<choppedLine.length-2; i++) {
      keys[i] = choppedLine[i+2]
    }
    logFile.write("started on  file: " + fileToRead + "\n")
    logFile.write("keys are: " + keys)

  }
  

  //docBody = choppedLine[2]
  //docBody = {"purchased" : "Y"}
  //var jsonedBody = JSON.parse(docBody)
  //docAtHand = jsonedBody;
  docAtHand = {}
  docAtHand["augmented_data"] = {}
  for (var i = 0; i<=keys.length-1;  i++) {
    docAtHand["augmented_data"][keys[i]] = choppedLine[i+2]
  }


  //see if doc exist
  alice.get(docId, function(err, body) {

    if (!err) {
        docAtHand._id = docId;
        docAtHand._rev = body._rev;
        
        //update the doc
        alice.insert(docAtHand, function(err, body) {
          if (!err){
            docsUpdated++;
            lr.resume();
            //console.log(body);
          } else {
            console.log("error updating doc")
            console.log(err.error);
            console.log(err.reason);

          }
      })
    } else if (err.reason == "missing" || err.reason == "deleted" ){

      alice.insert(docAtHand, docId, function(err, body) {
      if (!err){
        docsCreated++;
        lr.resume();
      }
      });
    } else {
      //console.log(err);
      console.log("////////////////////")
      console.log("error: " + err.error)
      console.log("error reason: " + err.reason)
    }
  })

});




lr.on('end', function () {
  // All lines are read, file is closed now.
  console.log("I'm done here")
  console.log("lines parsed: " + linesParsed)
  console.log("docsCreated: " + docsCreated)
  console.log("docsUpdated: " + docsUpdated)
  timeItTook = Date.now() - startTime;
  console.log("time it took [seconds]: " + timeItTook/1000)
  console.log("Time it would take to parse 1 milion lines [hours]: " + (1000000/1000/3600 * timeItTook/linesParsed))

});



