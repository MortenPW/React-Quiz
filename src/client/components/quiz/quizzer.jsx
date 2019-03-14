import React from "react";

class Quizzer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      question: "Awaiting players...",
      answers: [],
      answersList: [],
      info: "",
      category: "",
      difficulty: "",
      buttonsEnabled: true,
      startedQuiz: false,
      interval: 0,
      timer: ""
    };

    this.startQuiz = this.startQuiz.bind(this);
    this.handleAnswer = this.handleAnswer.bind(this);
  }

  componentDidMount() {
    const { socket } = this.props;

    socket.on("question", data => {
      this.handleIntervalTimer();

      this.setState({
        question: data,
        buttonsEnabled: true,
        startedQuiz: true
      });
    });

    socket.on("category", data => {
      this.setState({
        category: data
      });
    });

    socket.on("difficulty", data => {
      this.setState({
        difficulty: data
      });
    });

    socket.on("answers", data => {
      this.setState({ answers: data });

      if (data.length < 2) {
        clearInterval(this.interval);
        this.setState({ timer: "" });
      }
    });

    socket.on("info", data => {
      this.setState({ info: data });
    });
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  handleIntervalTimer() {
    if (this.interval !== "undefined" || this.interval !== null) {
      clearTimeout(this.interval);
    }

    this.state.timer = 10;
    this.interval = setInterval(
      () => this.setState({ timer: --this.state.timer }),
      1000
    );
  }

  startQuiz() {
    this.props.socket.emit("quiz", "start");
    this.setState({ startedQuiz: true });
  }

  startQuizButton() {
    let buttonText = "Start Quiz";

    if (!this.state.startedQuiz && this.props.creator) {
      if (this.props.players.length === 0) {
        return (
          <button className="btn answer centered" disabled>
            {buttonText}
          </button>
        );
      } else {
        return (
          <button className="btn answer centered" onClick={this.startQuiz}>
            {buttonText}
          </button>
        );
      }
    } else {
      return <div />;
    }
  }

  getButtons() {
    let className = "btn answer";
    let index = 0;

    const { answers } = this.state;
    if (answers.length <= 1) {
      className = "btn answer centered";
    }
    if (this.state.buttonsEnabled) {
      this.state.answersList = answers.length ? (
        answers.map(answer => (
          <div className="col s6">
            <button
              className={className}
              value={index++}
              onClick={this.handleAnswer}
            >
              {answer}
            </button>
          </div>
        ))
      ) : (
        <div />
      );
    } else {
      this.state.answersList = answers.length ? (
        answers.map(answer => (
          <div className="col s6">
            <button className={className} disabled>
              {answer}
            </button>
          </div>
        ))
      ) : (
        <div />
      );
    }
  }

  handleAnswer(answer) {
    this.props.socket.emit("answer", this.state.answers[answer.target.value]);
    this.setState({ buttonsEnabled: false });
  }

  render() {
    this.getButtons();
    return (
      <div>
        <div className="card">
          <div className="card-body">
            <div className="card-title center-align">Quizzer</div>
            <div className="question col s12">
              <div className="col s12">
                <p className="center-align col s4">{this.state.difficulty}</p>
                <h4 className="center-align col s4">{this.state.timer}</h4>
                <p className="center-align col s4">{this.state.category}</p>
              </div>
              <h4 className="center-align">{this.state.question}</h4>
              <h5 className="center-align quizinfo">{this.state.info}</h5>
            </div>
            <div>{this.state.answersList}</div>
          </div>
        </div>
        <div className="center-align col s6">{this.startQuizButton()}</div>
      </div>
    );
  }
}

export default Quizzer;
