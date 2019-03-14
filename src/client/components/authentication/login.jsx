import React from "react";
import { Link } from "react-router-dom";

import { connect } from "react-redux";

class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      password: "",
      errorMsg: null
    };

    this.onUsernameChange = this.onUsernameChange.bind(this);
    this.onPasswordChange = this.onPasswordChange.bind(this);
    this.doLogIn = this.doLogIn.bind(this);
  }

  onUsernameChange(event) {
    this.setState({ username: event.target.value });
  }

  onPasswordChange(event) {
    this.setState({ password: event.target.value });
  }

  // Responses taken from pg6300 course
  async doLogIn() {
    const { username, password } = this.state;
    const url = "/api/login";
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
      this.setState({ errorMsg: "Failed connecting to server: " + err });
      return;
    }

    if (response.status === 401) {
      this.setState({ errorMsg: "Invalid username / password" });
      return;
    }

    if (response.status !== 204) {
      this.setState({
        errorMsg: "Error connecting to server: status code " + response.status
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

    return (
      <div>
        <div>
          <h4>Log In</h4>

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

        {error}

        <div className="btn" onClick={this.doLogIn}>
          Log In
        </div>
        <Link to={"/signup"} className="margin-left">
          Sign up?
        </Link>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    username: state.username
  };
};

export default connect(mapStateToProps)(Login);
