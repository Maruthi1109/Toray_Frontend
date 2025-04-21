import {
  GET_DASHBOARD_DATA,
  GET_DASHBOARD_DATA_SUCCESS,
  GET_DASHBOARD_DATA_FAIL,
} from "./actionTypes"

export const getDashboardData = () => ({
  type: GET_DASHBOARD_DATA,
})

export const getDashboardDataSuccess = data => ({
  type: GET_DASHBOARD_DATA_SUCCESS,
  payload: data,
})

export const getDashboardDataFail = error => ({
  type: GET_DASHBOARD_DATA_FAIL,
  payload: error,
}) 