import React from "react";
import openSocket from "socket.io-client";

import { connect } from "react-redux";

import Quizzer from "../quiz/quizzer";
import Chat from "./chat";
import PlayersScore from "./playersScore";

const socket = openSocket(window.location.origin);

class Quiz extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      creator: false,
      inQuiz: false,
      players: [],
      noQuizzes: ""
    };

    this.createQuiz = this.createQuiz.bind(this);
    this.joinQuiz = this.joinQuiz.bind(this);
    this.leaveQuiz = this.leaveQuiz.bind(this);
  }

  componentDidMount() {
    socket.connect();

    socket.on("joined", () => {
      this.setState({ inQuiz: true });
    });

    socket.on("players_score", data => {
      this.setState({ players: data });
    });

    socket.emit("username", this.props.username);
  }

  componentWillUnmount() {
    this.leaveQuiz();
    socket.disconnect();
  }

  createQuiz() {
    socket.emit("quiz", "create");
    this.setState({ inQuiz: true, creator: true, noQuizzes: "" });
  }

  joinQuiz() {
    socket.emit("quiz", "join");
    this.setState({
      noQuizzes: "No quizzes available- start your own or try again!"
    });
  }

  leaveQuiz() {
    socket.emit("quiz", "leave");
    this.setState({
      creator: false,
      inQuiz: false,
      players: [],
      noQuizzes: ""
    });
  }

  getInQuiz() {
    if (this.state.inQuiz) {
      return (
        <div className="row">
          <div className="players z-depth-1 blue col s3">
            <PlayersScore
              players={this.state.players}
              triggerParentUpdate={this.leaveQuiz}
            />
          </div>
          <div className="quiz z-depth-1 green col s6">
            <Quizzer
              socket={socket}
              creator={this.state.creator}
              players={this.state.players}
            />
          </div>
          <div className="chat z-depth-1 blue col s3">
            <Chat socket={socket} />
          </div>
        </div>
      );
    } else {
      return (
        <div className="row">
          <button className="btn answer" onClick={this.createQuiz}>
            Create Quiz
          </button>
          <h6 className="center-align">{this.state.noQuizzes}</h6>
          <button className="btn answer" onClick={this.joinQuiz}>
            Join Quiz
          </button>
        </div>
      );
    }
  }

  render() {
    return (
      <div>
        <h4>Quiz</h4>
        {this.getInQuiz()}
        <p className="opentdb center-align">Trivia supported by opentdb.com</p>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    username: state.username
  };
};

export default connect(mapStateToProps)(Quiz);
