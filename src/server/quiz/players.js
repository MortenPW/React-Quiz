// Keep track of sockets and users
const userSocket = new Map();

function registerSocket(username, socket) {
  userSocket.set(username, socket);
}

function getSocket(username) {
  return userSocket.get(username);
}

function getSockets() {
  return userSocket;
}

function hasUsername(username) {
  return userSocket.has(username);
}

function getUsername(socketId) {
  for (const [k, v] of userSocket) {
    if (v.id === socketId) {
      return k;
    }
  }
}

function removeUser(username) {
  if (userSocket.has(username)) {
    userSocket.delete(username);
  }
}

module.exports = {
  registerSocket,
  getSocket,
  getSockets,
  hasUsername,
  getUsername,
  removeUser
};
