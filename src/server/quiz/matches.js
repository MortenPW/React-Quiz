const Match = require("./match");

// Better to use maps here, as filter requires copy
const usernameInMatch = new Map();
const matches = new Map();

function createMatch(username) {
  const match = new Match(username);

  usernameInMatch.set(username, match);
  matches.set(match.matchId, match);
}

function startMatch(username) {
  if (usernameInMatch.has(username)) {
    usernameInMatch.get(username).start(username);
  }
}

function joinMatch(username) {
  // Join first available match
  if (!usernameInMatch.has(username)) {
    matches.forEach(match => {
      if (match.started === false) {
        usernameInMatch.set(username, match);
        match.joinedMatch(username);
        return;
      }
    });
  }
}

function leaveMatch(username) {
  if (usernameInMatch.has(username)) {
    let match = usernameInMatch.get(username);
    match.leftMatch(username);
    usernameInMatch.delete(username);

    // If last player left, remove match
    if (match.getMatchSockets().length === 0) {
      matches.delete(match.matchId);
    }
  }
}

function getUserMatchSockets(username) {
  if (usernameInMatch.has(username)) {
    return usernameInMatch.get(username).getMatchSockets();
  }
}

module.exports = {
  createMatch,
  joinMatch,
  startMatch,
  leaveMatch,
  getUserMatchSockets
};
