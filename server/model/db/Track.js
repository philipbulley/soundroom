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
  var trackSchema = new Schema( {
    title: { type: String, required: true },
    description: { type: String },
    tracks: [ { type: Schema.Types.ObjectId, ref: 'Track' } ],
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    created: { type: Date }
  } );

  trackSchema.plugin( Modified );

  _.extend( trackSchema.methods, {} );

  _.extend( trackSchema.statics, {} );

  return trackSchema;
}


// Export!
MongooseUtil.exportModuleModel( 'appInstance', 'Track', create, module );
