import _ from 'lodash';
import mongooseQ from 'mongoose-q';
import DateFields from '../plugin/DateFields';
import ActionTypeEnum from '../../enum/ActionTypeEnum';


const mongoose = mongooseQ();
const Schema = mongoose.Schema;

export default function create() {
  const actionSchema = Schema({
    type: {type: String, enum: _.values(ActionTypeEnum)},
    foreignId: {type: Schema.Types.ObjectId},
    foreignModel: String,
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    created: {type: Date}
  });

  actionSchema.plugin(DateFields);

  _.extend(actionSchema.methods, {});

  _.extend(actionSchema.statics, {});

  return actionSchema;
}
