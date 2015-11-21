var
  _ = require('lodash'),
  mongoose = require('mongoose-q')(),
  // Q = require('q'),
  // log = require('./../../util/LogUtil'),
  MongooseUtil = require('./../../util/MongooseUtil'),
  DateFields = require('./plugin/DateFields'),
  // UserErrorEnum = require('./../enum/UserErrorEnum'),
  Schema = mongoose.Schema;


function create() {
  const userSchema = new Schema({
    name: {type: String, required: true},
    avatar: {type: String},
    googleId: {type: String},
    spotifyId: {type: String},
    facebookId: {type: String},
    twitterId: {type: String},
    userId: {type: String},
    // firstName: {type: String, required: true},
    // lastName: {type: String, required: true},
    // email: {type: String, unique: true, required: true},
    vetoAvailable: {type: Date},
    created: {type: Date}
  });

  userSchema.plugin(DateFields);

  _.extend(userSchema.methods, {});

  _.extend(userSchema.statics, {});

  return userSchema;
}


// Export!
MongooseUtil.exportModuleModel('appInstance', 'User', create, module);
