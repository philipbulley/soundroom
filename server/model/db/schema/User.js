import _ from 'lodash';
import mongooseQ from 'mongoose-q';
import DateFields from '../plugin/DateFields';
import * as jwt from 'jwt-simple';

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

  _.extend(userSchema.methods, {

    generateJwt: function () {

      let DAY_IN_SECS = 3600 * 24,
        nowTimeSecs = Math.floor(new Date().getTime() / 1000),
      // expireSecs = nowTimeSecs + 60;   // DEBUG: 1 minute
      // expireSecs = nowTimeSecs + (DAY_IN_SECS * 31);   // 1 month expiry
        expireSecs = nowTimeSecs + (DAY_IN_SECS * 365);   // DEBUG: long expiry for debug

      return jwt.encode({
        iss: this._id,
        exp: expireSecs
      }, process.env.JWT_TOKEN_SECRET);
    }

  });

  _.extend(userSchema.statics, {});

  return userSchema;
}
