const crypto = require("crypto");
const Entities = require("html-entities").AllHtmlEntities;

const Axios = require("axios");
const OfflineApi = require("../api/offlineApi");

const Players = require("./players");
const entities = new Entities();

const defaultScore = 100;
const defaultRoundTime = 10000; // 10 sec

class Match {
  constructor(username) {
    this.matchId = crypto.randomBytes(4).toString("hex");
    this.round = 0;
    this.roundTime = 0;
    this.interval = null;
    this.started = false;
    this.creator = username;
    this.gameOver = false;

    this.questions = [];

    this.sockets = [];
    this.playersScore = [];
    this.answers = [];

    this.joinedMatch(username);
  }

  systemMessage(message) {
    let data = { author: "SYSTEM", message: message };
    this.sockets.forEach(socket => {
      socket.emit("receive_message", data);
    });
  }

  async joinedMatch(username) {
    // Fetch questions so they're ready fast (can't start game until fetched)
    if (this.questions.length <= 0) {
      await this.getQuestions();
    }

    let socket = Players.getSocket(username);

    this.sockets.push(socket);
    socket.emit("joined", "true");

    this.playersScore.push({
      username: String(username),
      score: String(0),
      left: false
    });

    this.systemMessage(username + " joined the game.");
    this.sendPlayersScore();
  }

  leftMatch(username) {
    let socket = Players.getSocket(username);
    this.sockets = this.sockets.filter(sockets => {
      return sockets !== socket;
    });

    this.playersScore.forEach(player => {
      if (player.username === username) {
        player.username += " (left)";
        player.score = 0;
        player.left = true;
      }
    });

    this.systemMessage(username + " left the game.");

    // If creator leaves playersScore left, start the game
    if (username === this.creator && this.sockets.length !== 0) {
      this.start(username);

      this.playersScore.forEach(player => {
        if (!player.left) {
          this.creator = player.username;
          return;
        }
      });
      this.systemMessage(this.creator + " is now in charge of the game.");

      // Just re-send re-match if creator leaves, in case new creator already answered
      if (this.gameOver) {
        this.sockets.forEach(socket => {
          socket.emit("answers", ["Re-Match?"]);
        });
      }
    }

    this.answerListener();
    this.sendPlayersScore();
  }

  fetchQuestions(amount) {
    return Axios.get(
      "https://opentdb.com/api.php?amount=" + amount + "&type=multiple"
    ).catch(error => {
      //console.log(error);

      // Return an offline copy of samples if failed request
      return JSON.parse(JSON.stringify(OfflineApi.offlineApi));
    });
  }

  async getQuestions() {
    let feed = await this.fetchQuestions(10);
    this.questions = feed.data.results;
  }

  async rematch(username) {
    // Only allow creator to rematch
    if (this.creator === username) {
      this.systemMessage("Re-match!");
      this.gameOver = false;

      this.playersScore.forEach(player => {
        player.score = 0;
      });

      await this.getQuestions();
      this.round = 0;
      this.answerListener();

      this.sockets.forEach(socket => {
        socket.emit("info", "");
      });

      this.nextRound();

      // Want re-match
    } else {
      this.systemMessage(username + " wants re-match!");
    }
  }

  start(username) {
    // Only allow creator to start game
    if (this.creator === username) {
      this.started = true;

      this.systemMessage("Game started!");
      this.answerListener();
      this.nextRound();
    }
  }

  nextRound() {
    if (this.interval !== "undefined" || this.interval !== null) {
      clearTimeout(this.interval);
    }

    this.sendPlayersScore();

    if (this.round <= this.questions.length - 1) {
      this.roundTime = Date.now();
      this.answers = [];

      this.sendQuestionAnswers(this.round);

      this.interval = setTimeout(() => {
        this.nextRound();
      }, defaultRoundTime);

      ++this.round;

      // Game is over
    } else {
      this.announceEndOfGame();
    }
  }

  shuffle(array) {
    let currentIndex = array.length,
      temporaryValue,
      randomIndex;

    // While there remains elements to shuffle.
    while (0 !== currentIndex) {
      // Pick remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap with current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  }

  getMatchSockets() {
    return this.sockets;
  }

  sendQuestionAnswers(index) {
    let sendAnswers = this.questions[index].incorrect_answers;
    sendAnswers.push(this.questions[index].correct_answer);

    for (let i = 0; i < sendAnswers.length; ++i) {
      sendAnswers[i] = entities.decode(sendAnswers[i]);
    }

    this.sockets.forEach(socket => {
      socket.emit("question", entities.decode(this.questions[index].question));
      socket.emit("difficulty", this.questions[index].difficulty);
      socket.emit("category", this.questions[index].category);
      socket.emit("answers", this.shuffle(sendAnswers));
    });
  }

  sendPlayersScore() {
    this.sockets.forEach(socket => {
      socket.emit("players_score", this.playersScore);
    });
  }

  answerListener() {
    this.sockets.forEach(socket => {
      // Remove old listeners if new playersScore
      socket.removeAllListeners("answer");

      socket.on("answer", data => {
        if (data === "Re-Match?" && this.gameOver) {
          this.rematch(Players.getUsername(socket.id));
          return;
        }

        let elapsed_time = Date.now() - this.roundTime;

        // Protect websocket from answering more than once
        if (!this.answers.includes(socket.id)) {
          this.answers.push(socket.id);

          if (
            data ===
            entities.decode(this.questions[this.round - 1].correct_answer)
          ) {
            this.playersScore.forEach(player => {
              if (player.username === Players.getUsername(socket.id)) {
                // We don't want time and speed to be extremely important
                // As it would make sense to just answer at random.
                let bonus = 0;
                if (this.questions[this.round - 1].difficulty === "medium") {
                  bonus = 15;
                }
                if (this.questions[this.round - 1].difficulty === "hard") {
                  bonus = 30;
                }

                player.score = Math.round(
                  Number(player.score) +
                    (defaultScore - elapsed_time / 300) +
                    bonus
                );
              }
            });
          }

          if (this.answers.length >= this.sockets.length) {
            this.nextRound();
          }
        }
      });
    });
  }

  announceEndOfGame() {
    this.gameOver = true;

    let highestScorePlayer = this.playersScore[0];
    let info = "";

    // Find highest score
    this.playersScore.forEach(player => {
      if (Number(player.score) > Number(highestScorePlayer.score)) {
        highestScorePlayer = player;
      }
    });

    // See if other playersScore got same score
    this.playersScore.forEach(player => {
      if (
        Number(player.score) === Number(highestScorePlayer.score) &&
        player.username !== highestScorePlayer.username
      ) {
        info += player.username + ", ";
      }
    });

    if (info !== "") {
      info += " and " + highestScorePlayer.username;
    }

    if (Number(highestScorePlayer.score) === 0) {
      info = "There is no real winner!";
    } else if (info === "") {
      info =
        "The winner is " + highestScorePlayer.username + "! Congratulations!";
    } else {
      info = "It's a tie between " + info + "! Well done!";
    }

    this.sockets.forEach(socket => {
      socket.emit("question", "GAME OVER!");
      socket.emit("info", info);
      socket.emit("category", "");
      socket.emit("difficulty", "");
      socket.emit("answers", ["Re-Match?"]);
    });
  }
}

module.exports = Match;
