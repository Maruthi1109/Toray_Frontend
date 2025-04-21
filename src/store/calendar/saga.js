import { takeEvery, put, call } from "redux-saga/effects"

// Calender Redux States
import {
  ADD_NEW_EVENT,
  DELETE_EVENT,
  GET_CATEGORIES,
  GET_EVENTS,
  UPDATE_EVENT,
} from "./actionTypes"
import {
  getEventsSuccess,
  getEventsFail,
  addEventFail,
  addEventSuccess,
  updateEventSuccess,
  updateEventFail,
  deleteEventSuccess,
  deleteEventFail,
  getCategoriesSuccess,
  getCategoriesFail,
} from "./actions"

//Include Both Helper File with needed methods
//import { api } from "../../config"
import {APIClient } from '../../helpers/api_helper' 
const api = new APIClient();

function* fetchEvents() {
  try {
    const response = yield call(api.get, "/api/events")
    yield put(getEventsSuccess(response.data))
  } catch (error) {
    yield put(getEventsFail(error))
  }
}

function* onAddNewEvent({ payload: event }) {
  try {
    const response = yield call(api.post, "/api/events", event)
    yield put(addEventSuccess(response.data))
  } catch (error) {
    yield put(addEventFail(error))
  }
}

function* onUpdateEvent({ payload: event }) {
  try {
    const response = yield call(api.put, `/api/events/${event.id}`, event)
    yield put(updateEventSuccess(response.data))
  } catch (error) {
    yield put(updateEventFail(error))
  }
}

function* onDeleteEvent({ payload: event }) {
  try {
    yield call(api.delete, `/api/events/${event.id}`)
    yield put(deleteEventSuccess(event))
  } catch (error) {
    yield put(deleteEventFail(error))
  }
}

function* fetchCategories() {
  try {
    const response = yield call(api.get, "/api/categories")
    yield put(getCategoriesSuccess(response.data))
  } catch (error) {
    yield put(getCategoriesFail(error))
  }
}

function* calendarSaga() {
  yield takeEvery(GET_EVENTS, fetchEvents)
  yield takeEvery(ADD_NEW_EVENT, onAddNewEvent)
  yield takeEvery(UPDATE_EVENT, onUpdateEvent)
  yield takeEvery(DELETE_EVENT, onDeleteEvent)
  yield takeEvery(GET_CATEGORIES, fetchCategories)
}

export default calendarSaga
