import { takeEvery, put, call } from "redux-saga/effects"

// Profile Redux States
import { EDIT_PROFILE } from "./actionTypes"
import { profileSuccess, profileError } from "./actions"

// Include Helper File with needed methods
import {APIClient } from '../../../helpers/api_helper' 
const api = new APIClient();


function* editProfile({ payload: { user } }) {
  try {
    const response = yield call(api.put, "/api/profile", user)
    if (response) {
      yield put(profileSuccess(response.data))
    }
  } catch (error) {
    yield put(profileError(error))
  }
}

function* profileSaga() {
  yield takeEvery(EDIT_PROFILE, editProfile)
}

export default profileSaga
