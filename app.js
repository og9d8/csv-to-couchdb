
var nano = require('nano')('http://admin:augmentedmv@localhost:5984');
var alice = nano.use('augmentedmv');
 
var fs = require('fs');
var readline = require('readline');
var stream = require('stream');
var parse = require('csv-parse');


//var instream = fs.createReadStream('./datasample.csv');
//var outstream = new stream;
//var rl = readline.createInterface(instream, outstream);

var startTime = Date.now();
var timeItTook = 0;
var linesParsed = 0;

var docRev = 0;
var docId = 'rabbit5';
var docbody = {crazy : true, time: "right nowish"}

function updateDocOnCouch(docId) {
  alice.get(docId, function(err, body) {
    if (!err) {
      docRev = body._rev
      //console.log("rev is:" + docRev);
      //console.log("crazy is: " + body.crazy)
      console.log("updateing the doc")

      //alice.insert({ _id: docId, _rev: docRev, docbody }, function(err, body) {
        docbody._id = docId;
        docbody._rev = docRev;
      alice.insert(docbody, function(err, body) {
        if (!err){
          console.log("updated the doc");

          //console.log(body);
        } else {
          console.log("error updating doc")
          console.log(err.error);
          console.log(err.reason);

        }
      })
    } else if (err.reason == "missing"){
      console.log("doc doesn't exist, creating it");
      alice.insert(docbody, docId, function(err, body) {
      if (!err){
        //console.log(body);
        console.log("doc created")
      }
      });
    } else {
      //console.log(err);
      console.log("////////////////////")
      console.log(err.error)
      console.log(err.reason)
    }
  });
}



// rl.on('line', function(line) {
//       console.log("line is: " + line)
//       rl.pause();
//       updateDocOnCouch(docId, function(){rl.resume()});
//       console.log("parsing line number: " + linesParsed)
//       console.log("time is: " + Date.now()/1000)
//       linesParsed++;

// });

// rl.on('close', function() {
//     console.log("all done")
//     console.log("Lines parsed: " + linesParsed)
//     timeItTook = Date.now() - startTime;
//     console.log("start time: " + startTime)
//     console.log("time it took [seconds]: " + timeItTook/1000)
//     console.log("Time it would take to parse 1 milion lines [hours]: " + (1000000/1000/3600 * timeItTook/linesParsed))
// });



///////////////////////////////////////
///// USING LINE BY LINE
// var LineByLineReader = require('line-by-line'),
//     lr = new LineByLineReader('./datasample.csv');

// lr.on('error', function (err) {
//   // 'err' contains error object
// });

// lr.on('line', function (line) {
//   // pause emitting of lines...
//   console.log("line I read: " + line)
//   lr.pause();
//   updateDocOnCouch(docId)
//   // ...do your asynchronous line processing..
//   setTimeout(function () {

//     // ...and continue emitting lines.
//     lr.resume();
//   }, 50);
// });

// lr.on('end', function () {
//   // All lines are read, file is closed now.
//   console.log("I'm done here")
// });




/////////////
///// line by line with callback
var LineByLineReader = require('line-by-line'),
    lr = new LineByLineReader('./datasample.csv');

lr.on('error', function (err) {
  // 'err' contains error object
});

lr.on('line', function (line) {
  // pause emitting of lines...
  //console.log("line I read: " + line)
  linesParsed++;
  lr.pause();
  console.log(line)
  var choppedLine = line.split(',')  
  console.log("new ID is: " + choppedLine[0].trim() + "_" + choppedLine[1].trim())
  console.log(choppedLine[1])
  console.log(choppedLine[2])
  docId = choppedLine[0].trim() + "_" + choppedLine[1].trim()
  alice.get(docId, function(err, body) {
    if (!err) {
      docRev = body._rev
      //console.log("rev is:" + docRev);
      //console.log("crazy is: " + body.crazy)
      //console.log("updateing the doc")

      //alice.insert({ _id: docId, _rev: docRev, docbody }, function(err, body) {
        docbody._id = docId;
        docbody._rev = docRev;
      alice.insert(docbody, function(err, body) {
        if (!err){
          //console.log("updated the doc");
          lr.resume();
          //console.log(body);
        } else {
          console.log("error updating doc")
          console.log(err.error);
          console.log(err.reason);

        }
      })
    } else if (err.reason == "missing"){
      console.log("doc doesn't exist, creating it");
      alice.insert(docbody, docId, function(err, body) {
      if (!err){
        //console.log(body);
        console.log("doc created")
        lr.resume();
      }
      });
    } else {
      //console.log(err);
      console.log("////////////////////")
      console.log(err.error)
      console.log(err.reason)
    }
  });

});

lr.on('end', function () {
  // All lines are read, file is closed now.
  console.log("I'm done here")
  console.log("lines parsed: " + linesParsed)
  timeItTook = Date.now() - startTime;
  console.log("start time: " + startTime)
  console.log("time it took [seconds]: " + timeItTook/1000)
  console.log("Time it would take to parse 1 milion lines [hours]: " + (1000000/1000/3600 * timeItTook/linesParsed))



});
