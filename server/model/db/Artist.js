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
  var artistSchema = new Schema( {
    name: { type: String, required: true },
    provider: { type: String, enum: _.values( ProviderEnum ), index: true, required: true },
    foreignId: { type: String, required: true, unique: true }
  } );


  artistSchema.plugin( Modified );

  _.extend( artistSchema.methods, {} );

  _.extend( artistSchema.statics, {} );

  return artistSchema;
}


// Export!
MongooseUtil.exportModuleModel( 'appInstance', 'Artist', create, module );
