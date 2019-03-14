const crypto = require("crypto");
const Players = require("../quiz/players");

const tokens = new Map();

const randomId = () => {
  return crypto.randomBytes(4).toString("hex");
};

const createToken = username => {
  const token = randomId();
  while (
    Players.getSocket(username) ||
    username === null ||
    username === "undefined"
  ) {
    username = "Anon-" + crypto.randomBytes(1).toString("hex");
  }
  tokens.set(token, username);
  return token;
};

const consumeToken = token => {
  const username = tokens.get(token);
  tokens.delete(token);
  return username;
};

module.exports = { createToken, consumeToken };
