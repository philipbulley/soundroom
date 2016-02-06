import _ from 'lodash';
import db from './../model/db';
import log from './../util/LogUtil';
import Q from 'q';
import socketService from './../service/SocketService';
import UserErrorEnum from './../model/enum/UserErrorEnum';


/**
 *
 * @param userParams
 * @returns {Q.Promise}
 */
function create(userParams) {
  // Only accept allowable fields to create a new user with
  // userParams = _.pick(userParams, ['email', 'password', 'firstName', 'lastName']);
  userParams = _.pick(userParams, [
    'name',
    'avatar',
    'googleId',
    'spotifyId',
    'facebookId',
    'twitterId',
    'userId'
  ]);

  log.info('UserController.create: userParams:', userParams);

  const user = db.User(userParams);

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
function find(query = null) {
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

  // return db.User.findQ(query, select)
  return db.User.findQ(query)
    .then((users) => {
      log.info('UserController.find: then:', users);
      return users;
    });
}


function updateUserList() {
  find()
    .then((users) => socketService.updateConnectedUsers(users));
}

/**
 *
 * @param userParams
 * @returns {Q.Promise}
 */
function findOrCreate(userParams) {
  return Q.Promise((resolve, reject) => {
    find(userParams)
      .then((user) => {
        if (user && user.length) {
          console.log('FOUND EXISTING USER:', user[0].id);
          updateUserList();
          return resolve(user[0]);
        }
        create(userParams)
          .then((newUser) => {
            console.log('CREATED NEW USER:', newUser.id);
            updateUserList();
            return resolve(newUser);
          })
          .catch((err) => reject(err));
      });
  });
}

/**
 *
 * @param id
 * @returns {Q.Promise}
 */
function findById(id) {
  return db.User.findByIdQ(id);
}


socketService
  .on('client:connect', updateUserList)
  .on('client:disconnect', updateUserList);


export { find, findOrCreate, findById, updateUserList };
