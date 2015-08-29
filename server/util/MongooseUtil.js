var _ = require('lodash'),
  MongooseService = require('./../service/MongooseService');

function MongooseUtil() {

}

_.extend(MongooseUtil, {

  /**
   * Simplifies the process of `module.exports` of a connection-specific mongoose model.
   *
   * NOTE: This can only be called (ie. a Mongoose Model can only be exported) once the db connection has been opened.
   *
   * @param connectionName      Should be the name of a connection object on `MongooseService.db`
   * @param modelName           What do you want to call the mongoose model?
   * @param createFn            Ensure we only create the model once, this method reference should do the creation of the schema
   * @param module              The require module to export onto
   */
  exportModuleModel: function (connectionName, modelName, createFn, module) {
    try {
      // Return existing model instance, if exists
      module.exports = MongooseService.db[connectionName].model(modelName);
    } catch (error) {
      // Otherwise create it
      if (!MongooseService.db[connectionName])
        throw new Error('Please ensure the "' + connectionName + '" DB connection is opened before exporting the "' + modelName + '" model');

      module.exports = MongooseService.db[connectionName].model(modelName, createFn());
    }
  }
});


module.exports = MongooseUtil;
