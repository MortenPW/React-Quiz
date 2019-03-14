import React from "react";

import { connect } from "react-redux";

class Home extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <div className="row">
          <div className="col s6 margin-right no-padding">
            <h4>QuizBiz</h4>
            <p>
              Start quizzing with QuizBiz- we provide the latest and the
              greatest from opentdb.com!
            </p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </p>
          </div>
          <div className="col s1" />
          <div className="col s5 no-padding">
            <h5 className="padding-bottom">Top Quizzers</h5>
            <div className="collection">
              <a href="#!" className="collection-item">
                <span className="badge">18900</span>Harry
              </a>
              <a href="#!" className="collection-item">
                <span className="badge">4300</span>Ron
              </a>
              <a href="#!" className="collection-item">
                <span className="badge">1400</span>Hermine
              </a>
              <a href="#!" className="collection-item">
                <span className="badge">800</span>Anon-boss
              </a>
            </div>
          </div>
        </div>
        <div className="divider margin-top" />
        <div className="row">
          <div className="col s4 center-align">
            <i className="material-icons large">equalizer</i>
            <h6>Learn new strategies</h6>
          </div>
          <div className="col s4 center-align">
            <i className="material-icons large middle-i">layers</i>
            <h6>Beat the best</h6>
          </div>
          <div className="col s4 center-align">
            <i className="material-icons large">flash_on</i>
            <h6>Become top Quizzer</h6>
          </div>
        </div>
        <div className="divider margin-top" />
        <div className="row">
          <div className="col s2" />
          <div className="col s8 center-align margin-top">
            <h5>The new way of doing Quiz</h5>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
          </div>
          <div className="col s2" />
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

export default connect(mapStateToProps)(Home);
