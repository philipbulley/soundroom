import _ from 'lodash';
import mongooseQ from 'mongoose-q';
import DateFields from '../plugin/DateFields';


const mongoose = mongooseQ();
const Schema = mongoose.Schema;

export default function create() {
  const userSchema = Schema({
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
