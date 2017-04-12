var nano = require('nano')('http://admin:augmentedmv@localhost:5984');
 
// clean up the database we created previously 
nano.db.destroy('alice', function() {
	console.log("destroyed")
  // create a new database 
  nano.db.create('alice', function() {
  		console.log("created")

    // specify the database we are going to use 
    var alice = nano.use('alice');
    // and insert a document in it 
    alice.insert({ crazy: true }, 'rabbiti', function(err, body, header) {
      if (err) {
        console.log('[alice.insert] ', err.message);
        return;
      }
      console.log('you have inserted the rabbit.')
      console.log(body);
    });
  });
});