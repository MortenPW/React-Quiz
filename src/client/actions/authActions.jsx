export const setUsername = username => {
  return {
    type: "SET_USERNAME",
    username
  };
};

export const updateLoggedInUsername = username => {
  return {
    type: "UPDATE_LOGGED_IN_USERNAME",
    username
  };
};
