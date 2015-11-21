import _ from 'lodash';
import FunctionUtil from './../util/FunctionUtil';
import Q from 'q';
import log from './../util/LogUtil';
import User from './../model/db/User';
import UserErrorEnum from './../model/enum/UserErrorEnum';
// import Config from './../model/Config';
import socketService from './../service/SocketService';

class UserController {
  constructor () {
    FunctionUtil.bindAllMethods(this);
  }

  /**
   *
   * @param userParams
   * @returns {Q.Promise}
   */
  findOrCreate (userParams) {
    return Q.Promise((resolve, reject) => {
      this.find(userParams)
        .then((user) => {
          if (user && user.length) {
            console.log('FOUND EXISTING USER:', user[0]);
            this.emitUserConnect(user[0]);
            return resolve(user[0]);
          }
          this.create(userParams)
            .then((newUser) => {
              console.log('CREATED NEW USER:', newUser);
              this.emitUserConnect(newUser);
              return resolve(newUser);
            })
            .catch((err) => reject(err));
        });
    });
  }

  /**
   *
   * @param userParams
   * @returns {Q.Promise}
   */
  create (userParams) {
    // Only accept allowable fields to create a new user with
    // userParams = _.pick(userParams, ['email', 'password', 'firstName', 'lastName']);
    userParams = _.pick(userParams, ['name', 'avatar', 'googleId', 'spotifyId', 'facebookId', 'twitterId']);

    log.info('UserController.create: userParams:', userParams);

    const user = new User(userParams);
    return user.saveQ()
      .catch((err) => {
        if (err.name === 'MongoError' && err.code === 11000) {
          // Duplicate key, user with email already exists
          const error = new Error(UserErrorEnum.ALREADY_EXISTS);
          // error.email = userParams.email;
          throw error;
        }

        log.formatError(err, 'UserController.create: save');
      });
  }

  /**
   *
   * @param query
   * @param executingUser
   * @returns {Q.Promise}
   */
  // find: function (query, executingUser) {
  find (query) {
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
  }

  /**
   *
   * @param id
   * @param cb
   */
  findById (id, cb) {
    User.findById(id, cb);
  }

  emitUserConnect (user) {
    socketService.emitUserConnect(user);
  }

}

// export default UserController;
module.exports = UserController;
