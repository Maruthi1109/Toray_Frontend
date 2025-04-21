import axios from "axios";

// Base URL setup
axios.defaults.baseURL = process.env.REACT_APP_API_URL || '/api';

// Global headers (do NOT set Content-Type globally)
axios.defaults.withCredentials = true;
axios.defaults.headers.common["Accept"] = "application/json";

// Helper to get user from localStorage
const getLoggedinUser = () => {
  const user = localStorage.getItem("authUser");
  if (!user) return null;
  try {
    return JSON.parse(user);
  } catch {
    return null;
  }
};

// Helper to set Auth header
const setAuthorization = (token) => {
  axios.defaults.headers.common["Authorization"] = "Bearer " + token;
};

class APIClient {
  constructor() {
    this.axiosInstance = axios.create({
      baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000',
      timeout: 10000,
      withCredentials: true,
      headers: {
        Accept: 'application/json'
        // No Content-Type set here!
      }
    });

    // Request interceptor
    this.axiosInstance.interceptors.request.use(
      (config) => {
        const user = getLoggedinUser();
        if (user?.token) {
          config.headers.Authorization = `Bearer ${user.token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const user = getLoggedinUser();
            if (user?.refreshToken) {
              const response = await axios.post('/api/auth/refresh-token', {
                refreshToken: user.refreshToken
              });

              if (response.data.token) {
                user.token = response.data.token;
                localStorage.setItem('authUser', JSON.stringify(user));

                originalRequest.headers.Authorization = `Bearer ${response.data.token}`;
                return this.axiosInstance(originalRequest);
              }
            }
          } catch (refreshError) {
            console.error('Error refreshing token:', refreshError);
            localStorage.removeItem('authUser');
            window.location.href = '/login';
            return Promise.reject(refreshError);
          }
        }

        let errorMsg = error.response?.data?.message || 'An error occurred';
        switch (error.response?.status) {
          case 400:
            errorMsg = 'Bad Request';
            break;
          case 401:
            errorMsg = 'Invalid credentials';
            localStorage.removeItem('authUser');
            window.location.href = '/login';
            break;
          case 404:
            errorMsg = 'Resource not found';
            break;
          case 500:
            errorMsg = 'Internal Server Error';
            break;
          default:
            if (!error.response) {
              errorMsg = 'Network Error - Please check your connection';
            }
        }

        return Promise.reject(new Error(errorMsg));
      }
    );
  }

  get = (url, params) => {
    return this.axiosInstance.get(url, { params });
  };

  post = (url, data, config = {}) => {
    const headers = config.headers || {};

    // Detect FormData and let browser handle headers
    if (data instanceof FormData) {
      delete headers['Content-Type']; // Let browser handle
    } else {
      headers['Content-Type'] = 'application/json';
    }

    return this.axiosInstance.post(url, data, { ...config, headers });
  };

  put = (url, data, config = {}) => {
    const headers = config.headers || {};

    if (data instanceof FormData) {
      delete headers['Content-Type'];
    } else {
      headers['Content-Type'] = 'application/json';
    }

    return this.axiosInstance.put(url, data, { ...config, headers });
  };

  delete = (url) => {
    return this.axiosInstance.delete(url);
  };
}

export { APIClient, setAuthorization, getLoggedinUser };
