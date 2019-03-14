const initState = {
  posts: [
    {
      id: "1",
      postedBy: "admin",
      title: "First post",
      body: "nothing interestingggggg",
      replies: []
    },
    {
      id: "2",
      postedBy: "admin",
      title: "Second post",
      body: "nothing interesting",
      replies: []
    },
    {
      id: "3",
      postedBy: "admin",
      title: "Third post",
      body:
        "nothing interestingnothing interestingnothing interestingnothing interesting",
      replies: [{ postedBy: "test", body: "it out" }]
    },
    {
      id: "4",
      postedBy: "admin",
      title: "Third post",
      body: "nothing",
      replies: [{ postedBy: "test", body: "it out" }]
    },
    {
      id: "5",
      postedBy: "admin",
      title: "Third post",
      body: "nothing",
      replies: [{ postedBy: "test", body: "it out" }]
    },
    {
      id: "6",
      postedBy: "admin",
      title: "Third post",
      body: "nothing",
      replies: []
    },
    {
      id: "7",
      postedBy: "admin",
      title: "Third post",
      body: "nothing",
      replies: [{ postedBy: "test", body: "it out" }]
    },
    {
      id: "8",
      postedBy: "admin",
      title: "Third post",
      body: "nothing",
      replies: []
    },
    {
      id: "9",
      postedBy: "admin",
      title: "Third post",
      body: "nothing",
      replies: []
    },
    {
      id: "10",
      postedBy: "admin",
      title: "Third post",
      body: "nothing",
      replies: [{ postedBy: "test", body: "it out" }]
    },
    {
      id: "11",
      postedBy: "admin",
      title: "Third post",
      body: "nothing",
      replies: [
        { postedBy: "test", body: "it out" },
        { postedBy: "test", body: "it out" }
      ]
    }
  ]
};

// Without altering state- only replace with new states
const forumReducer = (state = initState, action) => {
  if (action.type === "DELETE_POST") {
    let newPosts = state.posts.filter(post => {
      return action.id !== post.id;
    });
    return {
      state,
      posts: newPosts
    };
  }

  if (action.type === "ADD_POST") {
    let newid =
      state.posts[Object.keys(state.posts)[Object.keys(state.posts).length - 1]]
        .id;
    ++newid;

    let newPosts = state.posts;
    newPosts.push({
      id: String(newid),
      postedBy: "admin",
      title: action.title,
      body: action.body,
      replies: []
    });

    return {
      state,
      posts: newPosts
    };
  }

  if (action.type === "ADD_REPLY") {
    let newPosts = state.posts.filter(post => {
      return action.id !== post.id;
    });

    let newPost = state.posts.filter(post => {
      return action.id === post.id;
    });

    let replies = newPost[0].replies;
    replies.push({ postedBy: "anon", body: action.body });

    newPosts.push({
      id: newPost[0].id,
      postedBy: newPost[0].postedBy,
      title: newPost[0].title,
      body: newPost[0].body,
      replies: replies
    });

    return {
      state,
      posts: newPosts
    };
  }
  return state;
};

export default forumReducer;
