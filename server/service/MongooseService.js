import Q from 'q';
import mongoose from 'mongoose';
import log from './../util/LogUtil';


const MongooseService = {

  db: {
    appInstance: null
  },

  connectToAppInstance (connectionUri) {
    log.debug('MongooseService.connectToAppInstance', connectionUri);
    if (!connectionUri)
      throw new Error('Please specify a connectionUri before attempting to connect to the appInstance DB');

    const deferred = Q.defer();

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
};

export default MongooseService;
