var mongoose = require('mongoose');

module.exports = function (done) {
  var testDb = mongoose.connect(process.env.MONGO_CONNECT);

  testDb.connection.on('open', function() {
    testDb.connection.db.dropDatabase(function(err, result) {
      if (err) {
        throw err;
      }
      console.log('Test database dropped =', result);
      // mongoose.disconnect(function() {
      //   console.log('Database connection closed');
      // });
      done();
    });
  });
};
