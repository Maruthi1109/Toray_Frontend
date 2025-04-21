import { call, put, takeEvery } from "redux-saga/effects";

// Login Redux States
import { LOGIN_USER, LOGOUT_USER } from "./actionTypes";
import { apiError, loginSuccess, logoutUserSuccess } from "./actions";

// Include Helper File with needed methods
import { postLogin, postLogout } from "../../../helpers/auth_helper";

function* loginUser({ payload: { user, history } }) {
  try {
    const response = yield call(postLogin, {
      email: user.email,
      password: user.password,
    });
    if (response) {
      localStorage.setItem("user", JSON.stringify(response));
      yield put(loginSuccess(response));
      history.push("/dashboard");
    }
  } catch (error) {
    yield put(apiError(error));
  }
}

function* logoutUser({ payload: { history } }) {
  try {
    localStorage.removeItem("user");
    yield call(postLogout);
    yield put(logoutUserSuccess());
    history.push("/login");
  } catch (error) {
    yield put(apiError(error));
  }
}

function* authSaga() {
  yield takeEvery(LOGIN_USER, loginUser);
  yield takeEvery(LOGOUT_USER, logoutUser);
}

export default authSaga;
