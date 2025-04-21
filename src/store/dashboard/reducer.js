import {
  GET_DASHBOARD_DATA,
  GET_DASHBOARD_DATA_SUCCESS,
  GET_DASHBOARD_DATA_FAIL,
} from "./actionTypes"

const initialState = {
  dashboardData: {
    totalApplications: 0,
    totalUsers: 0
  },
  loading: false,
  error: null,
}

const dashboard = (state = initialState, action) => {
  switch (action.type) {
    case GET_DASHBOARD_DATA:
      return {
        ...state,
        loading: true,
        error: null
      }

    case GET_DASHBOARD_DATA_SUCCESS:
      return {
        ...state,
        loading: false,
        dashboardData: action.payload,
        error: null
      }

    case GET_DASHBOARD_DATA_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload
      }

    default:
      return state
  }
}

export default dashboard 