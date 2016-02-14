const users = Object.create(null);
let ids = [];

const getUserIds = () => {
  return Object.keys(users).map((key) => users[key]);
};

export default {
  add(socketId, userId) {
    users[socketId] = userId.toString();
    ids = getUserIds();
  },
  remove(socketId) {
    delete users[socketId];
    ids = getUserIds();
  },
  contains(userId) {
    return ids.indexOf(userId.toString()) > -1;
  }
};
