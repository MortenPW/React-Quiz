import React from "react";
import { connect } from "react-redux";
import { deletePost } from "../../actions/postActions";
import { addReply } from "../../actions/postActions";

class Post extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      body: ""
    };

    this.onChangeBody = this.onChangeBody.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleReply = this.handleReply.bind(this);
  }

  onChangeBody(event) {
    this.setState({ body: event.target.value });
  }

  handleDelete() {
    this.props.deletePost(this.props.post.id);
    this.props.history.push("/forum");
  }

  handleReply() {
    if (this.state.body.length != 0) {
      this.props.addReply(this.props.post.id, this.state.body);
      this.state.body = "";
    }
  }

  render() {
    const post = this.props.post ? (
      <div className="post">
        <h4>{this.props.post.title}</h4>
        <p>{this.props.post.body}</p>
        <p className="right-align postedBy">{this.props.post.postedBy}</p>

        <p>{this.props.post.replies.body}</p>
        <p>{this.props.post.replies.postedBy}</p>

        <button className="btn grey" onClick={this.handleDelete}>
          Delete Post
        </button>
      </div>
    ) : (
      <div>
        <h4>Loading</h4>
        <p>Loading post...</p>
      </div>
    );

    const { replies } = this.props.post;
    const repliesList = replies.length ? (
      replies.map(reply => (
        <div>
          <div className="horizontal-line col s12" />
          <p>{reply.body}</p>
          <p className="right-align postedBy">{reply.postedBy}</p>
        </div>
      ))
    ) : (
      <div>No replies yet.</div>
    );

    return (
      <div>
        {post}
        {repliesList}
        <div className="post card padding">
          <div className="row">
            <div className="input-field col s12">
              <h6>Add reply:</h6>
              <textarea
                className="textarea materialize-textarea"
                value={this.state.body}
                onChange={this.onChangeBody}
                required
              />
            </div>
          </div>
          <button className="btn" onClick={this.handleReply}>
            Add Reply
          </button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  let id = ownProps.match.params.post_id;
  return {
    post: state.posts.posts.find(post => post.id === id)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    deletePost: id => {
      dispatch(deletePost(id));
      // dispatch({ type: "DELETE_POST", id: id });
    },

    addReply: (id, body) => {
      dispatch(addReply(id, body));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Post);
