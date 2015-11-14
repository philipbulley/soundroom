var _ = require('lodash'),
  Q = require('q'),
  FunctionUtil = require('./../util/FunctionUtil'),
  log = require('./../util/LogUtil'),
  User = require('./../model/db/User'),
  UserErrorEnum = require('./../model/enum/UserErrorEnum'),
//PermissionErrorEnum = require( './../model/enum/PermissionErrorEnum' ),
  Config = require('./../model/Config');

function UserController() {
  FunctionUtil.bindAllMethods(this);
}

_.extend(UserController, {});

UserController.prototype = {

  /**
   *
   * @param userParams
   * @returns {Q.Promise}
   */
  findOrCreate: function(userParams) {
    return Q.Promise((resolve, reject) => {
      this.find(userParams)
        .then((user) => {
          if (user && user.length) {
            console.log('FOUND EXISTING USER:', user[0]);
            return resolve(user[0]);
          }
          this.create(userParams)
            .then((newUser) => {
              console.log('CREATED NEW USER:', newUser);
              return resolve(newUser);
            })
            .catch((err) => reject(err));
        });
    });
  },

  /**
   *
   * @param userParams
   * @returns {Q.Promise}
   */
  create: function (userParams) {
    // Only accept allowable fields to create a new user with
    // userParams = _.pick(userParams, ['email', 'password', 'firstName', 'lastName']);
    userParams = _.pick(userParams, ['name', 'avatar', 'googleId', 'spotifyId', 'facebookId', 'twitterId']);

    log.info('UserController.create: userParams:', userParams);

    const user = new User(userParams);
    return user.saveQ()
      .catch((err) => {
        if (err.name === 'MongoError' && err.code === 11000) {
          // Duplicate key, user with email already exists
          const err = new Error(UserErrorEnum.ALREADY_EXISTS);
          // err.email = userParams.email;
          throw err;
        }

        log.formatError(err, 'UserController.create: save');
      });
  },

  /**
   *
   * @param query
   * @param executingUser
   * @returns {Q.Promise}
   */
  // find: function (query, executingUser) {
  find: function (query) {
    // log.info('UserController.find()', query, executingUser);

    // Only accept allowable fields to query by
    // query = executingUser
    //   ? _.pick(query, ['_id', 'email', 'accessToken', 'nda'])
    //   : _.pick(query, ['_id', 'email']);

    // const select = executingUser
    //   ? null  // No restrictions on selected fields, as we have an executing user
    //   : 'email';

    // Anon access requires a query as we don't want to dump out all users
    // if (!executingUser && !_.keys(query).length)
    //   return Q.reject(new Error(PermissionErrorEnum.UNAUTHORIZED));

    // return User.findQ(query, select)
    return User.findQ(query)
      .then((users) => {
        log.info('UserController.find: then:', users);
        return users;
      });
  },

  /**
   *
   * @param id
   * @param cb
   */
  findById: function(id, cb) {
    User.findById(id, cb);
  }

};

module.exports = UserController;
