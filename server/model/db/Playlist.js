var
    _            = require( 'lodash' ),
    mongoose     = require( 'mongoose-q' )(),
    Q            = require( 'q' ),
    log          = require( './../../util/LogUtil' ),
    MongooseUtil = require( './../../util/MongooseUtil' ),
    Modified     = require( './plugin/Modified' ),
    Schema       = mongoose.Schema;


function create()
{
  var playlistTrackSchema = new Schema( {
    track: { type: Schema.Types.ObjectId, ref: 'Track' },
    upVotes: [ { type: Schema.Types.ObjectId, ref: 'User' } ]
  } );

  var playlistSchema = new Schema( {
    title: { type: String, required: true },
    description: { type: String },
    tracks: [ playlistTrackSchema ],
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    created: { type: Date }
  } );

  playlistSchema.plugin( Modified );

  _.extend( playlistSchema.methods, {} );

  _.extend( playlistSchema.statics, {} );

  return playlistSchema;
}


// Export!
MongooseUtil.exportModuleModel( 'appInstance', 'Playlist', create, module );
