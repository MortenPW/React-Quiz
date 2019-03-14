const socketIo = require("socket.io");
const Tokens = require("./tokens");

const Matches = require("../quiz/matches");
const Players = require("../quiz/players");

var io;

const start = server => {
  io = socketIo(server);

  io.on("connection", function(socket) {
    // listen for "error" event so that the whole app doesn't crash
    socket.on("error", function(error) {
      console.log(error);
    });

    let username = Players.getUsername(socket.id);

    socket.on("username", data => {
      Players.removeUser(username);

      let token = Tokens.createToken(data);

      username = Tokens.consumeToken(token);
      Players.registerSocket(username, socket);

      console.log(username + " connected with a websocket.");
    });

    socket.on("disconnect", () => {
      if (Players.hasUsername(username)) {
        console.log(username + " disconnected.");
      }

      Matches.leaveMatch(username);
      Players.removeUser(username);
    });

    // Global chat
    /*
    socket.on("send_message", function(data) {
      io.emit("receive_message", data);
    });
    */

    // Match chat
    socket.on("send_message", function(data) {
      let matchSockets = Matches.getUserMatchSockets(username);
      data.author = username;

      if (matchSockets.length > 0) {
        matchSockets.forEach(socket => {
          socket.emit("receive_message", data);
        });
      }
    });

    // Quiz actions
    socket.on("quiz", function(data) {
      if (data === "create") {
        Matches.createMatch(username);
      }
      if (data === "join") {
        Matches.joinMatch(username);
      }
      if (data === "leave") {
        Matches.leaveMatch(username);
      }
      if (data === "start") {
        Matches.startMatch(username);
      }
    });
  });
};

module.exports = { start, io };
