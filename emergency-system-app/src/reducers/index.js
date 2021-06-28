// Combine Reducers because we only have a single store in a Redux application.
// We use reducer composition instead of several stores to split data handling logic.

import { combineReducers } from "redux";
import AuthReducer from "./AuthReducer.js";
import MessageReducer from "./MessageReducer.js";

export default combineReducers({
  AuthReducer,
  MessageReducer,
});
