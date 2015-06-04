var
    _                 = require( 'lodash' ),
    mongoose          = require( 'mongoose-q' )(),
    Q                 = require( 'q' ),
    log               = require( './../../util/LogUtil' ),
    MongooseUtil      = require( './../../util/MongooseUtil' ),
    Modified          = require( './plugin/Modified' ),
    Schema            = mongoose.Schema,
    PlaylistErrorEnum = require( './../enum/PlaylistErrorEnum' );


function create()
{
  var playlistTrackSchema = new Schema( {
    track: { type: Schema.Types.ObjectId, ref: 'Track' },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    upVotes: [ { type: Schema.Types.ObjectId, ref: 'User' } ]
  } );

  var playlistSchema = new Schema( {
    name: { type: String, required: true },
    description: { type: String },
    tracks: [ playlistTrackSchema ],
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },    // TODO: required: true when implemented users
    created: { type: Date }
  } );

  playlistSchema.plugin( Modified );

  _.extend( playlistSchema.methods, {

    /**
     * Use this save method instead of `episode.saveQ()` if you need the returned episode to be populated
     * @returns {Q.Promise}
     */
    savePopulateQ: function()
    {
      return this.saveQ()
          .then( function( playlist )
          {
            return playlist.populateQ( playlistSchema.statics.POPULATE_FIELDS )
          } );
    }

  } );

  _.extend( playlistSchema.statics, {

    /**
     * These fields need to be populated by a document from another database model. String of fields names, separated by spaces.
     */
    POPULATE_FIELDS: 'createdBy',

    /**
     * Checks if the format of the ID is valid
     *
     * @param id
     */
    isValidId: function( id )
    {
      return mongoose.Types.ObjectId.isValid( id );
    },

    /**
     * Use this find method instead of `Playlist.findById()` if you need the returned playlist to be populated
     * with external documents.
     *
     * @param id
     * @param fields
     * @param options
     * @returns {Q.Promise}     Promised resolved with a single Episode or null
     */
    findByIdPopulateQ: function( id, fields, options )
    {
      if( !this.isValidId( id ) )
        return Q.reject( new Error( PlaylistErrorEnum.INVALID_ID ) );

      return this.findById( id, fields, options )
          .populate( this.POPULATE_FIELDS )
          .execQ();
    },

    /**
     * Use this find method instead of `Playlist.find()` if you need the returned episode to be populated
     * with external documents.
     *
     * @param id
     * @param fields
     * @param options
     * @returns {Q.Promise}     Promised resolved with an array of Episodes or an empty array if no matches.
     */
    findPopulateQ: function( conditions, fields, options )
    {
      //log.debug( 'Playlist.findPopulateQ:', conditions, fields, options );

      return this.find( conditions, fields, options )
          .populate( this.POPULATE_FIELDS )
          .execQ();
    }

  } );

  return playlistSchema;
}


// Export!
MongooseUtil.exportModuleModel( 'appInstance', 'Playlist', create, module );
