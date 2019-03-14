const initState = null;

const authReducer = (state = initState, action) => {
  if (action.type === "UPDATE_LOGGED_IN_USERNAME") {
    return action.username;
  }

  if (action.type === "SET_USERNAME") {
    return action.username;
  }

  return state;
};

export default authReducer;
