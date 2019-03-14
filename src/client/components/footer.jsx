import React from "react";
import { Link, NavLink, withRouter } from "react-router-dom";

class Footer extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <footer className="page-footer">
        <div className="container">
          <div className="row">
            <div className="col l6 s12">
              <h5 className="white-text">{document.title}</h5>
              <p className="grey-text text-lighten-4">
                Knowing our quiz, is our biz!
              </p>
            </div>
            <div className="col l4 offset-l2 s12">
              <h5 className="white-text">Fine Choices</h5>
              <ul>
                <li>
                  <Link to="/quiz">Quiz</Link>
                </li>
                <li>
                  <Link to="/highscores">High Scores</Link>
                </li>
                <li>
                  <Link to="/forum">Forum</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="footer-copyright">
          <div className="container footer-padding">
            © {new Date().getFullYear()} <Link to="/">{document.title}</Link>
            <a
              className="grey-text text-lighten-4 right"
              href="https://github.com/arcuri82/pg6300"
              target="_blank"
            >
              PG6300
            </a>
          </div>
        </div>
      </footer>
    );
  }
}

export default withRouter(Footer);
