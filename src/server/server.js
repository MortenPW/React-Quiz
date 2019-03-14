const app = require("./app");
const WsHandler = require("./websocket/wsHandler");

const port = 8080;
const server = require("http").Server(app);

// Socket.io with server
WsHandler.start(server);

server.listen(port, () => {
  console.log("Starting NodeJS server on port " + port);
});
