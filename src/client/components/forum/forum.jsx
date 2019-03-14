import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import Pagination from "./pagination";

class Forum extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      pageOfItems: [],
      currentPage: ""
    };

    this.onChangePage = this.onChangePage.bind(this);
  }

  onComponentDidMount() {
    this.onChangePage();
  }

  onChangePage(pageOfItems, currentPage) {
    this.setState({ pageOfItems: pageOfItems, currentPage: currentPage });

    if (currentPage != 1) {
      this.props.history.push("/forum/" + currentPage);
    } else this.props.history.push("/forum");

    window.scrollTo(0, 0);
  }

  render() {
    /*
    setTimeout(() => {
      this.props.history.push("/forum");
    }, 2000);
    */

    const { posts } = this.props.posts;
    //posts.reverse();
    const postList = posts.length ? (
      this.state.pageOfItems.map(post => (
        <div key={post.id}>
          <div className="post card" key={post.id}>
            <div className="card-content">
              <Link to={"/forum/post/" + post.id}>
                <span className="card-title">{post.title}</span>
              </Link>
              <p>{post.body}</p>
              <p className="right-align postedBy">{post.postedBy}</p>
            </div>
          </div>
        </div>
      ))
    ) : (
      <div>No posts yet.</div>
    );
    return (
      <div>
        <h4>Forum</h4>

        <Link to="/forum/add-post">
          <button className="addPost btn">Add Post</button>
        </Link>

        {postList}

        <div className="text-center center-align">
          <Pagination items={posts} onChangePage={this.onChangePage} />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    posts: state.posts
  };
};

export default connect(mapStateToProps)(Forum);
