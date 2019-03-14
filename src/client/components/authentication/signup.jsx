import React from "react";

import { connect } from "react-redux";

class SignUp extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      password: "",
      confirm: "",
      errorMsg: null
    };

    this.onUsernameChange = this.onUsernameChange.bind(this);
    this.onPasswordChange = this.onPasswordChange.bind(this);
    this.onConfirmChange = this.onConfirmChange.bind(this);
    this.doSignUp = this.doSignUp.bind(this);
  }

  onUsernameChange(event) {
    // TODO: Redux: hent direkte fra minnet
    this.setState({ username: event.target.value, errorMsg: null });
  }

  onPasswordChange(event) {
    this.setState({ password: event.target.value, errorMsg: null });
  }

  onConfirmChange(event) {
    this.setState({ confirm: event.target.value, errorMsg: null });
  }

  // Responses taken from pg6300 course
  async doSignUp() {
    const { username, password, confirm } = this.state;

    if (confirm !== password) {
      this.setState({ errorMsg: "Passwords do not match" });
      return;
    }

    const url = "/api/signup";

    const payload = { username: username, password: password };

    let response;

    try {
      response = await fetch(url, {
        method: "post",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
    } catch (err) {
      this.setState({ errorMsg: "Failed to connect to server: " + err });
      return;
    }

    if (response.status === 400) {
      this.setState({ errorMsg: "Invalid username / password" });
      return;
    }

    if (response.status !== 204) {
      this.setState({
        errorMsg:
          "Error when connecting to server: status code " + response.status
      });
      return;
    }

    this.setState({ errorMsg: null });
    this.props.updateLoggedInUsername(username);
    this.props.history.push("/");
  }

  render() {
    let error = <div />;
    if (this.state.errorMsg !== null) {
      error = (
        <div className="errorMsg">
          <p>{this.state.errorMsg}</p>
        </div>
      );
    }

    let confirmMsg = "";
    if (this.state.confirm !== this.state.password) {
      confirmMsg = "Not matching";
    }

    if (this.state.password.length < 8 && this.state.password.length !== 0) {
      confirmMsg = "Password too short";
    }

    return (
      <div>
        <div>
          <h4>Sign Up</h4>

          <p>Username:</p>
          <input
            type="text"
            value={this.state.username}
            onChange={this.onUsernameChange}
          />
        </div>
        <div>
          <p>Password:</p>
          <input
            type="password"
            value={this.state.password}
            onChange={this.onPasswordChange}
          />
        </div>
        <div>
          <p>Confirm:</p>
          <input
            type="password"
            value={this.state.confirm}
            onChange={this.onConfirmChange}
          />
          <div>{confirmMsg}</div>
        </div>

        {error}

        <div className="btn" onClick={this.doSignUp}>
          Sign Up
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    username: state.username
  };
};

export default connect(mapStateToProps)(SignUp);
