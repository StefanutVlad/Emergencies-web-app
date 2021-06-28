// This Store will bring Actions and Reducers together and hold the Application state.

// Now we need to install Redux, Thunk Middleware and Redux Devtool Extension.
// Run the command:

// In the previous section, we used combineReducers() to combine 2 reducers into one. Let’s import it, and pass it to createStore():

import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import rootReducer from "./reducers";

const middleware = [thunk];

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;