var
  _ = require('lodash'),
  mongoose = require('mongoose-q')(),
  Q = require('q'),
  log = require('./../../util/LogUtil'),
  MongooseUtil = require('./../../util/MongooseUtil'),
  DateFields = require('./plugin/DateFields'),
  ProviderEnum = require('./../enum/ProviderEnum'),
  Schema = mongoose.Schema;


function create() {
  var albumSchema = new Schema({
    name: {type: String, required: true},
    provider: {type: String, enum: _.values(ProviderEnum), index: true, required: true},
    foreignId: {type: String, required: true, unique: true}
  });

  albumSchema.plugin(DateFields);

  _.extend(albumSchema.methods, {});

  _.extend(albumSchema.statics, {});

  return albumSchema;
}


// Export!
MongooseUtil.exportModuleModel('appInstance', 'Album', create, module);
