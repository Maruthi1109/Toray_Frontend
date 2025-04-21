import { takeLatest, put, call } from "redux-saga/effects"
import { REGISTER_USER } from "./actionTypes"
import { registerUserSuccess, registerUserError } from "./actions"
import { APIClient } from "../../../helpers/api_helper"

const api = new APIClient()

function* registerUser({ payload: { user, history } }) {
  try {
    const response = yield call(api.post, "/api/auth/register", user)
    yield put(registerUserSuccess(response.data))
    history.push("/login")
  } catch (error) {
    yield put(registerUserError(error))
  }
}

function* registerSaga() {
  yield takeLatest(REGISTER_USER, registerUser)
}

export default registerSaga 