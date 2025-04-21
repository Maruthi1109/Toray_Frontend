import {
  REGISTER_USER,
  REGISTER_USER_SUCCESS,
  REGISTER_USER_ERROR,
} from "./actionTypes"

export const registerUser = user => {
  return {
    type: REGISTER_USER,
    payload: { user },
  }
}

export const registerUserSuccess = user => {
  return {
    type: REGISTER_USER_SUCCESS,
    payload: user,
  }
}

export const registerUserError = error => {
  return {
    type: REGISTER_USER_ERROR,
    payload: error,
  }
}
