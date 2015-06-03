var
    _            = require( 'lodash' ),
    mongoose     = require( 'mongoose-q' )(),
    Q            = require( 'q' ),
    log          = require( './../../util/LogUtil' ),
    MongooseUtil = require( './../../util/MongooseUtil' ),
    Modified     = require( './plugin/Modified' ),
    ProviderEnum = require( './../enum/ProviderEnum' ),
    Schema       = mongoose.Schema;


function create()
{
  var trackSchema = new Schema( {
    name: { type: String, required: true },
    duration: { type: Number, required: true },
    provider: { type: String, enum: _.values( ProviderEnum ), index: true, required: true },
    foreignId: { type: String, required: true, unique: true },
    album: { type: Schema.Types.ObjectId, ref: 'Album' },
    artists: [ { type: Schema.Types.ObjectId, ref: 'Artist' } ],
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    created: { type: Date }
  } );

  trackSchema.plugin( Modified );

  _.extend( trackSchema.methods, {} );

  _.extend( trackSchema.statics, {

    /**
     * These fields need to be populated by a document from another database model. String of fields names, separated by spaces.
     */
    POPULATE_FIELDS: 'createdBy album artists',

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
      // TODO: Implement and test invalid id
      //if( !Track.isValidId( id ) )
      //  return Q.reject( new Error( TrackErrorEnum.INVALID_ID ) );

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
      log.debug( 'Episode.findPopulateQ:', conditions, fields, options );

      return this.find( conditions, fields, options )
          .populate( this.POPULATE_FIELDS )
          .execQ();
    },

    setAlbum: function( name, provider, foreignId )
    {
      var album = new albumSchema();
      album.name = name;
      album.provider = provider;
      album.foreignId = foreignId;

      return album;
    },

    addArtist: function( name, provider, foreignId )
    {
      var artist = new artistSchema();
      artist.name = name;
      artist.provider = provider;
      artist.foreignId = foreignId;

      this.artist = this.artist || [];
      this.artist.push( artist );

      return artist;
    }

  } );

  return trackSchema;
}


// Export!
MongooseUtil.exportModuleModel( 'appInstance', 'Track', create, module );
