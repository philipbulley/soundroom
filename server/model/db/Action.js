var
  _ = require('lodash'),
  mongoose = require('mongoose-q')(),
  Q = require('q'),
  log = require('./../../util/LogUtil'),
  MongooseUtil = require('./../../util/MongooseUtil'),
  Modified = require('./plugin/Modified'),
  ActionTypeEnum = require('./../../enum/ActionTypeEnum'),
  Schema = mongoose.Schema;


function create() {
  var actionSchema = new Schema({
    type: {type: String, enum: _.values(ActionTypeEnum)},
    foreignId: {type: Schema.Types.ObjectId},
    foreignModel: String,
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    created: {type: Date}
  });

  actionSchema.plugin(Modified);

  _.extend(actionSchema.methods, {});

  _.extend(actionSchema.statics, {});

  return actionSchema;
}


// Export!
MongooseUtil.exportModuleModel('appInstance', 'Action', create, module);
