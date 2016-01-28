var _ = require('lodash'),
  Q = require('q'),
  mongoose = require('mongoose'),
  log = require('./../util/LogUtil'),
  FunctionUtil = require('./../util/FunctionUtil');

function MongooseService() {
  FunctionUtil.bindAllMethods(this);
}

_.extend(MongooseService, {

  db: {
    appInstance: null
  },

  connectToAppInstance (connectionUri) {
    log.debug('MongooseService.connectToAppInstance', connectionUri);
    if (!connectionUri)
      throw new Error('Please specify a connectionUri before attempting to connect to the appInstance DB');

    const deferred = Q.defer();

    //mongoose.connect();
    this.db.appInstance = mongoose.createConnection(connectionUri);
    this.db.appInstance.on('error', () => {
      deferred.reject('MongooseService: db.appInstance connection error');
    });
    this.db.appInstance.once('open', () => {

      log.info('Connected to AppInstance DB: ', connectionUri.split('@')[1]);    // Not logging DB credentials

      deferred.resolve(this.db.appInstance);
    });

    return deferred.promise;
  }


});

MongooseService.prototype = {};

module.exports = MongooseService;
