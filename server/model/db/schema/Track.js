import _ from 'lodash';
import mongooseQ from 'mongoose-q';
import log from '../../../util/LogUtil';
import DateFields from '../plugin/DateFields';
import ProviderEnum from '../../enum/ProviderEnum';


const mongoose = mongooseQ();
const Schema = mongoose.Schema;

export default function create() {
  const trackSchema = new Schema({
    name: {type: String, required: true},
    duration: {type: Number, required: true},
    provider: {type: String, enum: _.values(ProviderEnum), index: true, required: true},
    foreignId: {type: String, required: true, unique: true},
    album: {type: Schema.Types.ObjectId, ref: 'Album'},
    artists: [{type: Schema.Types.ObjectId, ref: 'Artist'}],
    createdBy: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    created: {type: Date}
  });

  trackSchema.plugin(DateFields);

  _.extend(trackSchema.methods, {});

  _.extend(trackSchema.statics, {

    /**
     * These fields need to be populated by a document from another database model. String of fields names, separated by spaces.
     */
    POPULATE_FIELDS: 'createdBy album artists',

    /**
     * Checks if the format of the ID is valid
     *
     * @param id
     */
    isValidId (id) {
      return mongoose.Types.ObjectId.isValid(id);
    },

    /**
     * Use this find method instead of `Playlist.findById()` if you need the returned playlist to be populated
     * with external documents.
     *
     * @param id
     * @param fields
     * @param options
     * @returns {Q.Promise}     Promised resolved with a single Track or null
     */
    findByIdPopulateQ (id, fields, options) {
      // TODO: Implement and test invalid id
      //if( !Track.isValidId( id ) )
      //  return Q.reject( new Error( TrackErrorEnum.INVALID_ID ) );

      return this.findById(id, fields, options)
        .populate(this.POPULATE_FIELDS)
        .execQ();
    },

    /**
     * Use this find method instead of `Playlist.find()` if you need the returned track to be populated
     * with external documents.
     *
     * @param id
     * @param fields
     * @param options
     * @returns {Q.Promise}     Promised resolved with an array of Tracks or an empty array if no matches.
     */
    findPopulateQ (conditions, fields, options) {
      log.debug('Track.findPopulateQ:', conditions, fields, options);

      return this.find(conditions, fields, options)
        .populate(this.POPULATE_FIELDS)
        .execQ();
    },

    setAlbum (name, provider, foreignId) {
      const album = new albumSchema();
      album.name = name;
      album.provider = provider;
      album.foreignId = foreignId;

      return album;
    },

    addArtist (name, provider, foreignId) {
      const artist = new artistSchema();
      artist.name = name;
      artist.provider = provider;
      artist.foreignId = foreignId;

      this.artist = this.artist || [];
      this.artist.push(artist);

      return artist;
    }

  });

  return trackSchema;
}
