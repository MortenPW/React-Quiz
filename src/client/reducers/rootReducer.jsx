import { combineReducers } from "redux";
import forumReducer from "./forumReducer";
import authReducer from "./authReducer";

const rootReducer = combineReducers({
  posts: forumReducer,
  username: authReducer
});

export default rootReducer;
