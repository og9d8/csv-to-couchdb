
var nano = require('nano')('http://admin:augmentedmv@localhost:5984');
var alice = nano.use('augmentedmv');
 
var docRev = 0;
var docId = 'rabbit5';
var docbody = {crazy : true, time: "right nowish"}

function updateDocOnCouch(docId) {
  alice.get(docId, function(err, body) {
    if (!err) {
      docRev = body._rev
      console.log("rev is:" + docRev);
      console.log("crazy is: " + body.crazy)
      console.log("updateing the doc")

      //alice.insert({ _id: docId, _rev: docRev, docbody }, function(err, body) {
        docbody._id = docId;
        docbody._rev = docRev;
      alice.insert(docbody, function(err, body) {
        if (!err){
          console.log("updated the doc");

          //console.log(body);
        } else {
          console.log(err);
        }
      })
    } else if (err.reason == "missing"){
      console.log("doc doesn't exist, creating it");
      alice.insert(docbody, docId, function(err, body) {
      if (!err)
        console.log(body);
      });
    } else {
      console.log(err);
      console.log("////////////////////")
      console.log(err.error)
      console.log(err.reason)
    }
  });
}

updateDocOnCouch(docId)

