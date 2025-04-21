import { all, fork } from "redux-saga/effects";

import LayoutSaga from "./layout/saga";
import registerSaga from "./auth/register/saga";
import AuthSaga from "./auth/login/saga";
import ForgetSaga from "./auth/forgetpwd/saga";
import ProfileSaga from "./auth/profile/saga";
import calendarSaga from "./calendar/saga";
import dashboardSaga from "./dashboard/saga";

export default function* rootSaga() {
  yield all([
    //public
    fork(LayoutSaga),
    fork(registerSaga),
    fork(AuthSaga),
    fork(ForgetSaga),
    fork(ProfileSaga),
    fork(calendarSaga),
    fork(dashboardSaga),
  ]);
}
