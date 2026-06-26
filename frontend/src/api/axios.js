import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const publicApi = axios.create({
  baseURL: `${API_BASE_URL}/api/v1/auth`,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

const api = axios.create({
  baseURL: `${API_BASE_URL}/api/v1/auth`,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// Request interceptor — attach accessToken
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor — silent token refresh on 401
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

const forceLogout = () => {
  localStorage.removeItem("accessToken");
  window.dispatchEvent(new Event("auth:logout"));
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      // Queue concurrent requests while a refresh is already in flight
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await publicApi.post("/refresh-token");
        const { accessToken } = data.data;

        localStorage.setItem("accessToken", accessToken);
        api.defaults.headers.Authorization = `Bearer ${accessToken}`;
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        processQueue(null, accessToken);
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        forceLogout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export { publicApi };
export default api;
