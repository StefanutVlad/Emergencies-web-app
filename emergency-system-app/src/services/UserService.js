// service for accessing data
//uses auth-header() helper function to add JWT to HTTP header.

import axios from "axios";
import authHeader from "./AuthHeader";

const API_URL = "http://localhost:3006/api/test/";

const getPublicContent = () => {
  return axios.get(API_URL + "all");
};

const getUserBoard = () => {
  return axios.get(API_URL + "userBoard", { headers: authHeader() });
};

const getModeratorBoard = () => {
  return axios.get(API_URL + "modBoard", { headers: authHeader() });
};

const getAdminBoard = () => {
  return axios.get(API_URL + "adminPannel", { headers: authHeader() });
};

export default {
  getPublicContent,
  getUserBoard,
  getModeratorBoard,
  getAdminBoard,
};
