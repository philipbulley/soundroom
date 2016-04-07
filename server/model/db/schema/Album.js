import _ from 'lodash';
import mongooseQ from 'mongoose-q';
import DateFields from '../plugin/DateFields';
import ProviderEnum from '../../enum/ProviderEnum';


const mongoose = mongooseQ();
const Schema = mongoose.Schema;

export default function create() {
  const albumSchema = new Schema({
    name: {type: String, required: true},
    provider: {type: String, enum: _.values(ProviderEnum), index: true, required: true},
    foreignId: {type: String, required: true, unique: true},
    created: {type: Date}
  });

  albumSchema.plugin(DateFields);

  _.extend(albumSchema.methods, {});

  _.extend(albumSchema.statics, {});

  return albumSchema;
}
