import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import { connect } from "react-redux";
import { setUsername } from "./actions/authActions";

import Home from "./components/home";
import Login from "./components/authentication/login";
import SignUp from "./components/authentication/signup";
import NavBar from "./components/navbar";
import Footer from "./components/footer";
import Highscores from "./components/highscores";
import Quiz from "./components/quiz/quiz";
import Forum from "./components/forum/forum";
import Post from "./components/forum/post";
import AddPost from "./components/forum/addPost";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.updateLoggedInUsername = this.updateLoggedInUsername.bind(this);
  }

  componentDidMount() {
    this.checkIfAlreadyLoggedIn();
  }

  // Mainly adopted from lecturer course
  async checkIfAlreadyLoggedIn() {
    const url = "/api/user";

    let response;

    try {
      response = await fetch(url, {
        method: "get"
      });
    } catch (err) {
      this.setState({ errorMsg: "Failed to connect to server: " + err });
      return;
    }

    if (response.status === 401) {
      this.updateLoggedInUsername(null);
      return;
    }

    if (response.status !== 200) {
      // TODO here could have some warning message in the page.
    } else {
      const payload = await response.json();
      this.updateLoggedInUsername(payload.username);
    }
  }

  updateLoggedInUsername(username) {
    this.props.setUsername(username);
  }

  notFound() {
    return (
      <div>
        <h4>NOT FOUND: 404</h4>
        <p>ERROR: the page you requested is not available.</p>
      </div>
    );
  }

  render() {
    return (
      <BrowserRouter>
        <div>
          <NavBar updateLoggedInUsername={this.updateLoggedInUsername} />
          <div className="main container white z-depth-1 padding">
            <div className="row">
              <Switch>
                <Route exact path="/" component={Home} />
                <Route
                  exact
                  path="/login"
                  render={props => (
                    <Login
                      {...props}
                      updateLoggedInUsername={this.updateLoggedInUsername}
                    />
                  )}
                />
                <Route
                  exact
                  path="/signup"
                  render={props => (
                    <SignUp
                      {...props}
                      updateLoggedInUsername={this.updateLoggedInUsername}
                    />
                  )}
                />
                <Route path="/quiz" component={Quiz} />
                <Route path="/highscores" component={Highscores} />
                <Route path="/forum/add-post" component={AddPost} />
                <Route path="/forum/post/:post_id" component={Post} />
                <Route path="/forum" component={Forum} />
                <Route component={this.notFound} />
              </Switch>
            </div>
          </div>
          <Footer />
        </div>
      </BrowserRouter>
    );
  }
}

const mapStateToProps = state => {
  return {
    username: state.username
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setUsername: username => {
      dispatch(setUsername(username));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
