//Authentication service -> using Axios for HTTP requests and Local Storage for information & JWT

// GENERAL:
// The service uses Axios for HTTP requests and Browser Local Storage for user information & JWT.

import axios from "axios";
const API_URL = "http://localhost:3006/api/auth/";

// Register method: HTTP POST request to "signup" endpoint
const register = (username, email, password) => {
  return axios.post(API_URL + "signup", {
    username,
    email,
    password,
  });
};

// Login method: HTTP POST request to "signin" endpoint & save JWT to Local Storage using Axios
const login = (username, password) => {
  return axios
    .post(API_URL + "signin", { username, password })
    .then((response) => {
      if (response.data.accessToken) {
        localStorage.setItem("user", JSON.stringify(response.data));
      }

      return response.data;
    });
};

// Logout method: remove JWT from Local Storage
const logout = () => {
  localStorage.removeItem("user");
};

export default {
  register,
  login,
  logout,
};
