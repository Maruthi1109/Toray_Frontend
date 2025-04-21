import { call, put, takeEvery } from "redux-saga/effects"

// Login Redux States
import { FORGET_PASSWORD } from "./actionTypes"
import { userForgetPasswordSuccess, userForgetPasswordError } from "./actions"

// Include Helper File with needed methods
import { postForgetPwd } from "../../../helpers/auth_helper"

function* forgetUser({ payload: { user } }) {
  try {
    const response = yield call(postForgetPwd, user)
    if (response) {
      yield put(userForgetPasswordSuccess(response))
    }
  } catch (error) {
    yield put(userForgetPasswordError(error))
  }
}

function* forgetPasswordSaga() {
  yield takeEvery(FORGET_PASSWORD, forgetUser)
}

export default forgetPasswordSaga;
