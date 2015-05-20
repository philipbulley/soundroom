var
    _             = require( 'lodash' ),
    mongoose      = require( 'mongoose-q' )(),
    Q             = require( 'q' ),
    log           = require( './../../util/LogUtil' ),
    MongooseUtil  = require( './../../util/MongooseUtil' ),
    Modified      = require( './plugin/Modified' ),
    UserErrorEnum = require( './../enum/UserErrorEnum' ),
    Schema        = mongoose.Schema;


function create()
{
  var userSchema = new Schema( {
    firstName:                { type: String, required: true },
    lastName:                 { type: String, required: true },
    email:                    { type: String, unique: true, required: true },
    created:                  { type: Date }
  } );

  userSchema.plugin( Modified );

  _.extend( userSchema.methods, {

    /**
     * Transform the properties when converting to JSON
     * @returns {user}
     */
    toJSON: function()
            {
              var obj = this.toObject();
              delete obj.password;
              delete obj.__v;
              return obj;
            }


  } );

  _.extend( userSchema.statics, {} );

  return userSchema;
}


// Export!
MongooseUtil.exportModuleModel( 'appInstance', 'User', create, module );
