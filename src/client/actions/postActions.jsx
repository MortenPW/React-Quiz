export const deletePost = id => {
  return {
    type: "DELETE_POST",
    id
  };
};

export const addPost = (title, body) => {
  return {
    type: "ADD_POST",
    title,
    body
  };
};

export const addReply = (id, body) => {
  return {
    type: "ADD_REPLY",
    id,
    body
  };
};
