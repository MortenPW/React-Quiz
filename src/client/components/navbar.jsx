import React from "react";
import { Link, NavLink } from "react-router-dom";

import { connect } from "react-redux";

class NavBar extends React.Component {
  constructor(props) {
    super(props);

    this.doLogout = this.doLogout.bind(this);
  }

  async doLogout() {
    const url = "/api/logout";
    let response;

    try {
      response = await fetch(url, { method: "post" });
    } catch (err) {
      alert("Failed connecting to server: " + err);
      return;
    }

    if (response.status !== 204) {
      alert("Error connecting to server: status code " + response.status);
      return;
    }

    this.props.updateLoggedInUsername(null);
    this.props.history.push("/");
  }

  renderLoggedIn() {
    return (
      <div className="btn right login login-margin" onClick={this.doLogout}>
        Log out
      </div>
    );
  }

  renderNotLoggedIn() {
    return (
      <div>
        <Link to="/login" className="btn login right">
          Log in
        </Link>
        <Link to="/signup" className="btn login login-margin right">
          Sign up
        </Link>
      </div>
    );
  }

  render() {
    const username = this.props.username;
    let loggedInStatus;

    if (username === null || username === undefined) {
      loggedInStatus = this.renderNotLoggedIn();
    } else {
      loggedInStatus = this.renderLoggedIn(username);
    }

    return (
      <nav className="header">
        <div className="nav-wrapper blue darken-3">
          <div className="container">
            <div className="brand-logo">
              <Link to="/">{document.title}</Link>
            </div>

            {loggedInStatus}

            <ul id="nav-mobile" className="right">
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <NavLink to="/quiz">Quiz</NavLink>
              </li>
              <li>
                <NavLink to="/highscores">High Scores</NavLink>
              </li>
              <li>
                <NavLink to="/forum">Forum</NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    );
  }
}

const mapStateToProps = state => {
  return {
    username: state.username
  };
};

export default connect(mapStateToProps)(NavBar);
