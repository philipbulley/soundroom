var
  _ = require('lodash'),
  mongoose = require('mongoose-q')(),
  Q = require('q'),
  log = require('./../../util/LogUtil'),
  MongooseUtil = require('./../../util/MongooseUtil'),
  DateFields = require('./plugin/DateFields'),
  UserErrorEnum = require('./../enum/UserErrorEnum'),
  Schema = mongoose.Schema;


function create() {
  var userSchema = new Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    email: {type: String, unique: true, required: true},
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
