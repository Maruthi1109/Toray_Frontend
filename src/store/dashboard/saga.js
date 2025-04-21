import { call, put, takeLatest, all } from "redux-saga/effects"
import { getDashboardDataSuccess, getDashboardDataFail } from "./actions"
import { GET_DASHBOARD_DATA } from "./actionTypes"
import { APIClient } from "../../helpers/api_helper"
import { GET_APPLICATIONS, GET_USERS } from "../../helpers/url_helper"

const api = new APIClient()

function* fetchApplications() {
  try {
    console.log('Fetching applications...')
    const response = yield call(api.get, GET_APPLICATIONS)
    console.log('Applications response:', response)
    return response
  } catch (error) {
    console.error('Applications API Error:', {
      error,
      message: error.message,
      response: error.response,
      status: error.response?.status
    })
    return { data: [] }
  }
}

function* fetchUsers() {
  try {
    console.log('Fetching users...')
    const response = yield call(api.get, GET_USERS)
    console.log('Users response:', response)
    return response
  } catch (error) {
    console.error('Users API Error:', {
      error,
      message: error.message,
      response: error.response,
      status: error.response?.status
    })
    return { data: [] }
  }
}

function* fetchDashboardData() {
  try {
    console.log('Starting dashboard data fetch...')

    // Fetch both applications and users data in parallel
    const [applicationsResponse, usersResponse] = yield all([
      call(fetchApplications),
      call(fetchUsers)
    ])

    console.log('Raw API Responses:', {
      applicationsResponse,
      usersResponse
    })

    // Safely get data from responses
    const applications = Array.isArray(applicationsResponse?.data) ? applicationsResponse.data : 
                        (applicationsResponse?.data?.data && Array.isArray(applicationsResponse.data.data)) ? applicationsResponse.data.data : []
    
    const users = Array.isArray(usersResponse?.data) ? usersResponse.data : 
                 (usersResponse?.data?.data && Array.isArray(usersResponse.data.data)) ? usersResponse.data.data : []

    console.log('Processed Data:', {
      applications,
      users
    })

    // Combine the data with only total counts
    const dashboardData = {
      totalApplications: applications.length,
      totalUsers: users.length
    }

    console.log('Final Dashboard Data:', dashboardData)

    yield put(getDashboardDataSuccess(dashboardData))
  } catch (error) {
    console.error('Dashboard Data Fetch Error:', {
      error,
      message: error.message,
      response: error.response,
      status: error.response?.status
    })
    
    yield put(getDashboardDataFail({
      message: error.response?.data?.message || error.message || 'Failed to fetch dashboard data',
      details: {
        status: error.response?.status,
        data: error.response?.data
      }
    }))
  }
}

function* dashboardSaga() {
  yield takeLatest(GET_DASHBOARD_DATA, fetchDashboardData)
}

export default dashboardSaga 