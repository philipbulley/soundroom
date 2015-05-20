var _ = require( 'lodash' );

function Config()
{

}

var template = {
  BASE_URL_API:    'http://:env.api.spotidrop.fm'
};

_.extend( Config, {

  /** This will contain the config object for the current environment */
  data: null,

  /** Config across enviornments. Keys are based on the possible values of `process.env.APP_ENV` */
  env: {
    'dev':            {
      //baseUrlApi:    template.BASE_URL_API.replace( ':env', 'dev' ),
    },
    'sdldn':           {
      //baseUrlApi:    template.BASE_URL_API.replace( ':env', 'sdldn' ),
    }
  }

} );

// Assign the current environment's config object to Config.data
Config.data = Config.env[process.env.APP_ENV];

module.exports = Config;
