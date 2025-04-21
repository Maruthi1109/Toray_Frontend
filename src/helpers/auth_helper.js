import axios from "axios";
import * as url from "./url_helper";

// Gets the logged in user data from local session
export const getLoggedInUser = () => {
  const user = localStorage.getItem("user");
  if (user) return JSON.parse(user);
  return null;
};

//is user is logged in
export const isUserAuthenticated = () => {
  const user = getLoggedInUser();
  if (user && user.token) return true;
  return false;
};

// Register Method
export const postRegister = (data) => {
  return axios.post(url.POST_REGISTER, data).then((response) => response.data);
};

// Login Method
export const postLogin = (data) => {
  return axios.post(url.POST_LOGIN, data).then((response) => response.data);
};

// Logout Method
export const postLogout = () => {
  return axios.post(url.POST_LOGOUT).then((response) => response.data);
};

// Forgot Password
export const postForgetPwd = (data) => {
  return axios.post(url.POST_FORGET_PWD, data).then((response) => response.data);
};

// Reset Password
export const postResetPwd = (data) => {
  return axios.post(url.POST_RESET_PWD, data).then((response) => response.data);
}; 