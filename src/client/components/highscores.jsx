import React from "react";

class Highscores extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      posts: []
    };
  }

  componentDidMount() {
    fetch("https://jsonplaceholder.typicode.com/posts")
      .then(response => response.json())
      .then(posts => this.setState({ posts }));
  }

  render() {
    /*
    setTimeout(() => {
      this.props.history.push("/forum");
    }, 2000);
    */
    var numberOfBooks = 5;

    const { posts } = this.state;
    const postList = posts.length ? (
      posts.slice(0, numberOfBooks).map(post => {
        return (
          <div className="post card" key={post.id}>
            <div className="card-content">
              <span className="card-title">{post.title}</span>
              <p>{post.body}</p>
            </div>
          </div>
        );
      })
    ) : (
      <div>No books yet.</div>
    );
    return (
      <div>
        <h4>High Scores</h4>
        {postList}
      </div>
    );
  }
}

export default Highscores;
