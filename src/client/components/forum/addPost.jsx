import React from "react";
import { connect } from "react-redux";
import { addPost } from "../../actions/postActions";

class AddPost extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      body: "",
      title: ""
    };

    this.handleClick = this.handleClick.bind(this);
    this.onChangeTitle = this.onChangeTitle.bind(this);
    this.onChangeBody = this.onChangeBody.bind(this);
  }

  handleClick() {
    if (this.state.title.length != 0) {
      this.props.addPost(this.state.title, this.state.body);
      this.props.history.push("/forum");
    }
  }

  onChangeTitle(event) {
    this.setState({ title: event.target.value });
  }

  onChangeBody(event) {
    this.setState({ body: event.target.value });
  }

  render() {
    return (
      <div>
        <h4>Add Post</h4>

        <p>Title:</p>
        <input
          type="text"
          value={this.state.title}
          onChange={this.onChangeTitle}
          required
        />
        <p>Message:</p>
        <div className="row">
          <div className="input-field col s12">
            <textarea
              className="textarea materialize-textarea"
              value={this.state.body}
              onChange={this.onChangeBody}
              required
            />
          </div>
        </div>

        <button className="btn grey" onClick={this.handleClick}>
          Add Post
        </button>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    posts: state.posts
  };
};

const mapDispatchToProps = dispatch => {
  return {
    addPost: (title, body) => {
      dispatch(addPost(title, body));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddPost);
