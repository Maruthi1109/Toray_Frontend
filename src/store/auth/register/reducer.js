import {
  REGISTER_USER,
  REGISTER_USER_SUCCESS,
  REGISTER_USER_ERROR,
} from "./actionTypes"

const initialState = {
  registrationError: null,
  message: null,
  loading: false,
  user: null,
}

const register = (state = initialState, action) => {
  switch (action.type) {
    case REGISTER_USER:
      return {
        ...state,
        loading: true,
      }
    case REGISTER_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        user: action.payload,
      }
    case REGISTER_USER_ERROR:
      return {
        ...state,
        loading: false,
        registrationError: action.payload,
      }
    default:
      return state
  }
}

export default register
